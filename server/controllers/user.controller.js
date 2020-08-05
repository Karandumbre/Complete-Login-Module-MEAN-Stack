const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');

let otp = 000000;
let currentOtp = 000000;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'xxx-xx-x@gmail.com',
        pass: 'xxx'
    }
});


module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({
            "token": user.generateJwt()
        });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) => {
    User.findOne({
            _id: req._id
        },
        (err, user) => {
            if (!user)
                return res.status(404).json({
                    status: false,
                    message: 'User record not found.'
                });
            else
                return res.status(200).json({
                    status: true,
                    user: _.pick(user, ['fullName', 'email'])
                });
        }
    );
}


module.exports.generateOtp = (req, res) => {
    User.findOne({
        'email': req.body.id
    }, (err, response) => {
        if (err) {
            res.send(err);
        } else {
            otp = Math.floor(100000 + Math.random() * 900000);
            currentOtp = otp;

            var mailOptions = {
                from: 'slxnjdhv@gmail.com',
                to: req.body.id,
                subject: 'Sending Email using Node.js',
                text: ``,
                html: `<p>Hi ${response.fullName}, this is auto generated email. Please don't reply to this email</p><br>
                <h3> Your otp is</h3>
                <p> ${otp} </p>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log('Error', error)
                    res.send(error);
                } else {
                    res.send({
                        status: true
                    })
                }
            });
        }
    })
}

module.exports.checkOtp = (req, res) => {
    let recievedOtp = req.body.otp;
    if (currentOtp === Number(recievedOtp)) {
        res.json({
            status: true
        })
    } else {
        res.json({
            status: false
        })
    }
}

module.exports.resetPassword = (req, res) => {
    let password = req.body.password
    let email = req.body.id;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            password = hash;
            this.saltSecret = salt;
            User.findOneAndUpdate({
                'email': email
            }, {
                'password': password,
            }, (err, user) => {
                if (err) {
                    console.log('In Error', err);
                    res.send(err);
                } else {
                    console.log('Success');
                    res.json({
                        status: true
                    })
                }
            })

        });
    });
}