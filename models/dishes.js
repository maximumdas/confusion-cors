const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min:1,
        max:5,
        default:1
    }
})

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: "Test description"
    },
    comments: [commentSchema]
}, {
    timestamps: true
})

let Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;