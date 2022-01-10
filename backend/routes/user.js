const express = require('express')
const jwt = require("jsonwebtoken");
const jwtSecret = "parassaxenaanexassarap";
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const logerModel = require('../db/Loger');
const nodemailer = require('nodemailer');
const orderModel = require('../db/Orders')
async function autenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = await authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.json({ "err": 1, "msg": "First Login" })
    }
    else {
        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                res.json({ "err": 1, "msg": "Auhentication Fail" })
            }
            else {
                next();
            }
        })
    }
}
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'nstcoders@gmail.com',
        pass: 'nstcoders1234'
    }
});
router.post('/signup', (req, res) => {
    const hash = bcrypt.hashSync(req.body.pass, saltRounds)
    let ins = new logerModel({ fname: req.body.fname, lname: req.body.lname, email: req.body.email, pass: hash, phone: req.body.phone, gender: req.body.gender, address: [], otp: '' });
    ins.save((err) => {
        if (err) { res.send("Email Already Exist") }
        else { res.send('User Registered') }
    })
})
router.post('/login', (req, res) => {
    // console.log(req.body)
    logerModel.findOne({ email: req.body.email }).exec((err, data) => {
        if (err) {
            res.json({ "show": true, "msg": "Email or password is not correct" })
        }
        else if (data == null) {
            res.json({ "show": true, "msg": "Enter Registered Email" })
        }
        else if (data.pass == "Social Logger") {
            res.json({ "show": true, "msg": "Social Log In Is Available For This Email" })
        }
        else {
            if (!bcrypt.compareSync(req.body.pass, data.pass)) {
                res.json({ "show": true, "msg": "Password Not match" })
            }
            else {
                let payload = {
                    fname: data.fname,
                    lname: data.lname,
                    email: data.email
                }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
                res.json({ "show": false, "msg": "Login Success", "token": token })
            }

        }
    })
})
router.post("/sociallogin", (req, res) => {
    // console.log(req.body)
    let payload = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email
    }
    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
    logerModel.findOne({ email: req.body.email }).exec((err, data) => {
        if (err) {
            res.json({ "show": true, "msg": "Somethong Went Wrong" })
        }
        else if (data == null) {
            let ins = new logerModel({ fname: req.body.fname, lname: req.body.lname, email: req.body.email, pass: "Social Logger", address: [], otp: '' });
            ins.save((err) => {
                if (err) { res.json({ "show": true, "msg": "Somethong Went Wrong" }) }
                else { res.json({ "show": false, "msg": "Login Success", "token": token }) }
            })
        }
        else if (data.pass == "Social Logger") {
            res.json({ "show": false, "msg": "Login Success", "token": token })
        }
        else {
            res.json({ "show": true, "msg": "This Is A Email Registered For Login " })
        }
    })

})
router.get('/forgetpassword/:email', async (req, res) => {
    logerModel.findOne({ email: req.params.email }).exec(async (err, data) => {
        if (err) {
            res.json({ "show": true, "msg": "something went wrong" })
        }
        else if (data == null) {
            res.json({ "show": true, "msg": "Enter Registered Email" })
        }
        else if (data.pass == "Social Logger") {
            res.json({ "show": true, "msg": "Social Log In Is Available For This Email" })
        }
        else {
            var otp = Math.floor(1000 + Math.random() * 9000);
            let up = await logerModel.findOneAndUpdate({ email: req.params.email }, { otp: otp })
            up.save()
                .then(() => {
                    logerModel.findOne({ email: req.params.email }).exec()
                })
            var mailOption = {
                from: "nstcoders@gmail.com",
                to: req.params.email,
                // to: "parassaxena206@gmail.com",
                subject: 'Password Recovery Request',
                html: `
                <h1 style="color:blue;">Neo<span style="color:red;">Store</span></h1>
                <h2>Password Recovery mail for ${req.params.email}</h2>
                <h1>OTP : <span style="color:red;">${otp}</span></h1>
                <p>this is a mail for recovering your password as you requested that you forget it if not then connect to our support team . don't share this OTP with anyone </p>
                <p>thank you for using our services</p>
                `,
            };
            setTimeout(() => {
                transporter.sendMail(mailOption)
            }, 2000);
            res.json({ "show": false, "msg": "Check Your Mail" })
        }
    })
})
router.get('/verifyotp/:email', (req, res) => {
    logerModel.findOne({ email: req.params.email }).exec((err, data) => {
        if (err) {
            res.json({ "show": true, "msg": "Something went Wrong" })
        }
        else {
            if (data.otp == req.query.otp) {
                res.json({ "show": false, "msg": "Set A New Password" })
            }
            else {
                res.json({ "show": true, "msg": "Wrong OTP" })
            }
        }
    })
})
router.put('/updatepass', async (req, res) => {
    const hash = bcrypt.hashSync(req.body.pass, saltRounds)
    let up = await logerModel.findOneAndUpdate({ email: req.body.email }, { pass: hash })
    await up.save();
    res.json({ "show": true, "msg": "Password updated" })


})
router.get('/getprofile/:email', (req, res) => {
    logerModel.findOne({ email: req.params.email }).exec((err, data) => {
        res.send(data)
    })
})
router.put('/updateprofile', async (req, res) => {
    let up = await logerModel.findOneAndUpdate({ email: req.body.email }, { fname: req.body.fname, lname: req.body.lname, phone: req.body.phone })
    await up.save();
    res.json({ "show": true, "msg": "Data updated" })
})
router.put('/resetpass', async (req, res) => {
    // console.log(req.body)
    logerModel.findOne({ email: req.body.email }).exec(async (err, data) => {
        if (err) {
            res.json({ "show": true, "msg": "Something went wrong refresh and try again" })
        }
        else {
            if (!bcrypt.compareSync(req.body.oldpass, data.pass)) {
                res.json({ "show": true, "msg": "Old Password Not match" })
            }
            else {
                const hash = bcrypt.hashSync(req.body.newpass, saltRounds)
                let up = await logerModel.findOneAndUpdate({ email: req.body.email }, { pass: hash })
                await up.save();
                res.json({ "show": true, "msg": "Password updated" })
            }

        }
    })
})
router.put('/addaddress/:email', (req, res) => {
    logerModel.updateOne(
        { email: req.params.email },
        { $push: { address: req.body } }
    ).exec((err) => {
        if (err) throw err;
        res.json({ "show": true, "msg": "Address Added" })
    })
})
router.get("/getaddress/:email", (req, res) => {
    logerModel.findOne({ email: req.params.email }, { address: 1 }).exec((err, data) => {
        if (err) throw err;
        res.send(data.address)
    })
})
router.put('/removeaddress/:email', async (req, res) => {
    console.log(req.body, req.params.email)
    let up = await logerModel.findOneAndUpdate({ email: req.params.email }, { address: req.body })
    await up.save();
    res.json({ "show": true, "msg": "Removed" })
})
router.get('/verfiy', autenticateToken, (req, res) => {
    res.json({ "err": 0 })

})

router.post('/placeorder', (req, res) => {
    let ins = new orderModel({ ...req.body });
    ins.save((err) => {
        if (err) { res.send("Something went worng Order is not placed") }
        else { res.send('Order Placed Continue Shoping ') }
    })
})
module.exports = router;