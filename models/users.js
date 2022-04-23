const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model('User', userSchema);
module.exports = User;