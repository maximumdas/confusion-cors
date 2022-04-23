let passport = require('passport');
let localStrategy = require('passport-local').Strategy;
let User = require('./models/users');
let JwtStrategy = require('passport-jwt').Strategy;
let FacebookStrategy = require('passport-facebook-token');
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken');

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let config = require('./config');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
}

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT Payload:" + jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false)
            }
        })
    }));

exports.facebookPassport = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({username: profile.displayName, });
            user.facebookId = profile.id;
            user.save((err, user) => {
                if(err) return (done, err);
                else return done(null, user);
            })
        }
    })
}))

exports.jwtVerifyUser = passport.authenticate('jwt', {session: false});