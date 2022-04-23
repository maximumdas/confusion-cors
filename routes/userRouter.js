const User = require('./../models/users');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { router } = require('../app');
const passport = require('passport');
const authencticate = require('./../authencticate');
const cors = require('./cors');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.post('/signup', (req, res, next) => {
    User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success:false, err: err});
        } else {
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Registration successfull!'});
            })
        }
    });
})

userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
    let token = authencticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: "You're successfully logged in!"});
})

userRouter.post('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        let token = authencticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: "You're successfully logged in!"});
    }
})

userRouter.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Logout successfull!'});
    } else {
        let err = new Error("you're not authenticated!");
        err.status=403;
        next(err);
    }
})

module.exports = userRouter;