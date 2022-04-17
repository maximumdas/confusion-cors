const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

let User = mongoose.model('User', dishSchema);
module.exports = User;