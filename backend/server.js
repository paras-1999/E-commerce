const express = require('express');
const PORT = 8899;
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors());
const router = require('./routes/user.js')
const prouter = require('./routes/product.js')
app.use('/user', router);
app.use('/products', prouter);
const connectDB = require('./config/db')
connectDB();
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`working on port :${PORT}`)
})
// const categoryModel = require('./db/Product')
// app.post('/add', (req, res) => {
//     let entery = categoryModel({ ...req.body });
//     entery.save((err) => {
//         if (err) { res.send(err) }
//         else { res.send(req.body ) }
//     })
// })