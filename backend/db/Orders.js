const mongoose = require('mongoose')
const orderScehma = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    orderlist: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("order", orderScehma);