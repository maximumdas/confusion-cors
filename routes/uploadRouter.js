const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
var path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only accept image file"), false);
    }
    cb(null, true);
}

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/').get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET not supported');
}).post(upload.single('imageFile'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(req.file);
}).put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT not supported');
}).delete((req, res, next) => {
    res.statusCode = 200;
    console.log(path.join('public', 'images', req.body.filename))
    fs.unlink(path.join(__dirname, '..', 'public', 'images', req.body.filename), (err) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        res.end('Deleted')
    });
})

module.exports = uploadRouter;