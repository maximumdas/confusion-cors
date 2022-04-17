const express = require('express');
const cors = require('cors');
const app = express();

const whiteList = ['http://localhost:3000', 'http://localhost:80'];
var corsOptionsDelegate = (req, callback) => {
    var corsOption;
    console.log(req.header('Origin'));
    if (whiteList.indexOf(req.header('Origin')) !== -1) {
        corsOption = {origin:true};
    } else {
        corsOption = {origin: false};
    }
    callback(null, corsOption);
};

exports.cors = cors();
exports.corsWithOption = cors(corsOptionsDelegate);