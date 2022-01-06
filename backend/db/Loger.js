const mongoose = require('mongoose');
const logerSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    phone: { type: Number },
    gender: { type: String },
    address: { type: Array },
    otp: { type: Number }

})
module.exports = mongoose.model('loger', logerSchema);