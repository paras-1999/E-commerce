const express = require('express')
const prouter = express.Router();
const productModel = require('../db/Product');
const categoryModel = require('../db/Category')
const colorModel = require('../db/Color')
const cartModel = require('../db/PendingCart')
prouter.get('/all', (req, res) => {
    productModel.find(req.query)
        .populate(["category_id", "color_id"])
        .then(product => {
            res.send(product)
        })
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
prouter.post('/pendinglist/:email', (req, res) => {
    cartModel.findOne({ email: req.params.email }).exec(async (err, data) => {
        if (data == null) {
            let ins = await new cartModel({ email: req.params.email, items: req.body });
            ins.save();
        }
        else {
            let up = await cartModel.findOneAndUpdate({ email: req.params.email }, { items: req.body })
            up.save();
        }
        res.end();
    })
})
prouter.get('/pendingcart/:email', (req, res) => {
    cartModel.findOne({ email: req.params.email }).exec(async (err, data) => {
        if (data == null) {
            res.send(false)
        }
        else {
            await cartModel.deleteOne({ email: req.params.email })
            res.send(data)
        }

    })
})
prouter.get('/viewproduct', (req, res) => {
    productModel.findOne(req.query).populate(["category_id", "color_id"]).exec((err, data) => {
        if (err) {
            res.send(false)
        }
        else if (data == null) {
            res.send(false)
        }
        else {
            res.send(data)
        }
    })
})
prouter.put('/rating/:id', async (req, res) => {
    let up = await productModel.findOneAndUpdate({ _id: req.params.id }, req.body)
    await up.save();
    res.send("Thanks For The Rating")
})
prouter.post("/search", (req, res) => {
    productModel.find({ product_name: { $regex: req.body.data, $options: '$i' } }, "product_name")
        .then(response => {
            res.json(response)
        })
})
module.exports = prouter;

// prouter.get('/all', (req, res) => {
//     if (Object.keys(req.query).length == 0) {
//         productModel.find()
//             .populate(["category_id", "color_id"])
//             .then(product => {
//                 res.send(product)
//             })
//     }
//     else if (Object.keys(req.query).length == 1) {
//         let type;
//         let selector = '';
//         if (Object.keys(req.query)[0] == 'color') {
//             selector = "color_id";
//             type = req.query.color;
//         }
//         else {
//             selector = "category_id";
//             type = req.query.category
//         }
//         productModel.find({ [selector]: type })
//             .populate(["category_id", "color_id"])
//             .then(product => {
//                 res.send(product)
//             })
//     }
//     else {
//         productModel.find({ category_id: req.query.category, color_id: req.query.color })
//             .populate(["category_id", "color_id"])
//             .then(product => {
//                 res.send(product)
//             })
//     }



// })