const express = require('express')
const prouter = express.Router();
const productModel = require('../db/Product');
const categoryModel = require('../db/Category')
const colorModel = require('../db/Color')
prouter.get('/all', (req, res) => {
    if (Object.keys(req.query).length == 0) {
        productModel.find()
            .populate(["category_id", "color_id"])
            .then(product => {
                res.send(product)
            })
    }
    else if (Object.keys(req.query).length == 1) {
        let type;
        let selector = '';
        if (Object.keys(req.query)[0] == 'color') {
            selector = "color_id";
            type = req.query.color;
        }
        else {
            selector = "category_id";
            type = req.query.category
        }
        productModel.find({ [selector]: type })
            .populate(["category_id", "color_id"])
            .then(product => {
                res.send(product)
            })
    }
    else {
        productModel.find({ category_id: req.query.category, color_id: req.query.color })
            .populate(["category_id", "color_id"])
            .then(product => {
                res.send(product)
            })
    }



})
prouter.get('/color', (req, res) => {
    colorModel.find()
        .then(color => {
            res.send(color)
        })
})
prouter.get('/category', (req, res) => {
    categoryModel.find()
        .then(cat => {
            res.send(cat)
        })
})
module.exports = prouter;

