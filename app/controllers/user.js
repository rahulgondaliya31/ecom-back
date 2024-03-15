const User = require("../models/user");
const fs = require("fs");
const nodemailer = require('nodemailer');
var sha512 = require('js-sha512');
var jwt = require('jsonwebtoken');


exports.signUp = (req, res) => {
    const { full_name, email, password, phone_number, address, device_type, device_token } = req.body;
    let errors = ""
    var filename;
    if (!full_name) {
        errors = "full_name is required"
    }
    else if (!email) {
        errors = "email is required"
    }
    else if (!password) {
        errors = "password is required"
    }
    else if (!phone_number) {
        errors = "phone number is required"
    }
    else if (!address) {
        errors = "address is required"
    }
    else if (!device_type) {
        errors = "device_type is required"
    }
    else if (!device_token) {
        errors = "device_token is required"
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    User.findEmailExists(email, (err, data) => {
        if (data) {
            return res.send({
                status: "ERROR",
                message: "Email Already Exist",
                data: data
            })

        }

        User.findPhoneExists(phone_number, (err, phoneData) => {
            if (phoneData) {
                return res.send({
                    status: "ERROR",
                    message: "Phone number Already Exist",
                    data: phoneData
                })

            }
            if (!req.files || Object.keys(req.files).length === 0) {
                filename = '';
            }
            else {
                const profilepic = req.files.profile_picture
                // console.log(profilepic);return false;
                const num = Math.floor(Math.random() * Date.now() * 10);
                filename = num + '-' + profilepic.name;
                const path = "uploads/profile_picture/" + filename
                profilepic.mv(path, function (err) {
                })
            }
            const userData = new User({
                full_name: full_name,
                email: email,
                password: password,
                profile_picture: filename,
                phone_number: phone_number,
                address: address,
                device_token: device_token,
                device_type: device_type
            })

            User.signUp(userData, (err, user) => {
                //    console.log(user); return false
                var id = user
                User.findUserInfo(id, (err, info) => {
                    if (info) {
                        return res.send({
                            status: "SUCCESS",
                            message: "Register successfully",
                            data: info
                        })
                    }
                    else {
                        return res.send({
                            status: "ERROR",
                            message: "something went worng",
                            data: {}
                        })
                    }
                })
            })
        })
    })
}


exports.login = (req, res) => {
    const { email, password, device_type, device_token } = req.body
    let errors = ""

    if (!email) {
        errors = "email is required"
    }
    else if (!password) {
        errors = "password is required"
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    User.Login(email, password, (err, data) => {
        if (data) {
            const user_id = data.id
            User.loginUpdate(user_id, device_type, device_token, (err, update) => {
                var id = update
                User.findUserInfo(id, (err, info) => {
                    if (info) {
                        return res.send({
                            status: "SUCCESS",
                            message: "Login successfully",
                            data: info
                        })
                    }
                    else {
                        return res.send({
                            status: "ERROR",
                            message: "something went worng",
                            data: {}
                        })
                    }
                })
            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: "Email and Password incorrect",
                data: {}
            })
        }
    })
}

exports.changePassword = (req, res) => {
    const { password, user_id, new_password } = req.body
    let errors = ""

    if (!password) {
        errors = "password is required"
    }
    else if (!user_id) {
        errors = "user_id is required"
    }
    else if (!new_password) {
        errors = "New password is required"
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    User.findPasswordExists(password, user_id, (err, data) => {
        if (!data) {
            return res.send({
                status: "ERROR",
                message: "old password is incorrect",
                data: {}
            })
        }
        else {
            const id = data.id
            User.changePassword(new_password, id, (err, pass) => {
                return res.send({
                    status: "SUCCESS",
                    message: "password change successfully",
                    data: {}
                })
            })
        }
    })
}

exports.updateProfile = (req, res) => {
    const { user_id, full_name, email, phone_number, address, current_image } = req.body;
    let errors = ""
    var filename;

    if (!user_id) {
        errors = "user_id is required"
    }

    var cimg = "";
    if (current_image != undefined && current_image != "") {
        cimg = current_image;
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    User.updateEmailExists(email, user_id, (err, emailData) => {
        if (emailData) {
            return res.send({
                status: "ERROR",
                message: 'Email Already Exist',
                data: {}
            });
        }

        User.updatePhoneExists(phone_number, user_id, (err, phoneData) => {
            if (phoneData) {
                return res.send({
                    status: "ERROR",
                    message: 'Phone number Already Exist',
                    data: {}
                });
            }
            if (!req.files || Object.keys(req.files).length === 0) {
                filename = cimg;
            }
            else {
                const profilepic = req.files.profile_picture
                const num = Math.floor(Math.random() * Date.now() * 10);
                // console.log(profilepic); return false
                filename = num + '-' + profilepic.name;
                const path = "uploads/profile_picture/" + filename
                profilepic.mv(path, function (err) {
                })
                var unpath = "uploads/profile_picture/" + cimg;
                fs.unlink(unpath, async function (err) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('Image File has been Deleted');
                });
            }
            User.updateProfile(user_id, full_name, email, phone_number, address, filename, (err, update) => {
                var id = update
                User.findUserInfo(id, (err, info) => {
                    if (info) {
                        return res.send({
                            status: "SUCCESS",
                            message: "Profile update successfully",
                            data: info
                        })
                    }
                    else {
                        return res.send({
                            status: "ERROR",
                            message: "something went worng",
                            data: {}
                        })
                    }
                })
            })
        })
    })
}

exports.userDetail = (req, res) => {
    const { user_id } = req.body
    let errors = ""

    if (!user_id) {
        errors = "user_id is required"
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    User.findUserInfo(user_id, (err, data) => {
        if (data) {
            return res.send({
                status: "SUCCESS",
                message: "User detail fetch successfully",
                data: data
            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: "something went worng",
                data: {}
            })
        }
    })
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    let errors = ""

    if (!email) {
        errors = "email is required"
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        })
    }

    User.findEmailExists(email, (err, data) => {
        if (data) {
            var token = jwt.sign({ foo: data.id },'shhhhh');
            User.updateUserToken(token, data.id, (err, update) => {


                // const transporter = nodemailer.createTransport({
                //     host: "mail.intelligentscripts.com",
                //     port: 587,
                //     secure: false,
                //     auth: {
                //       user: "noreply@intelligentscripts.com",
                //       pass: "HIhello2018@",
                //     },
                // });

                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                      user: "no-reply@pangalink.net",
                      pass: "Kvtja286",
                    },
                });


                let url = nodeSiteUrl +`setnewpassword/${token}`;
                let body = `<!DOCTYPE html>
                            <html>
                            <head>
                            <meta charset="utf-8" />
                            <title></title>
                            </head>
                            <body>
                            <table width="100%" height="100%" cellpadding="2" cellspacing="3">
                                <tr>
                                    <td>Dear ${data.full_name},</td>
                                </tr>
                                <tr>
                                    <td><p class="grey">A request has been received to change the password your kabooter app.</p></td>
                                </tr>
                                <tr>
                                    <td><a href="`+ url + `"><button style="background-color: #359999;border-color: #359999;border: 0;padding: 10px 15px 10px 15px;font-size: 15px;color: #fff;border-radius: 5px;cursor: pointer;">Reset Password</button></a></td>
                                </tr>
                                <tr>
                                    <td>Thank you</td>
                                </tr>
                            </table>
                            <body>
                            </body>
                            </html>`;
                var mailOptions = {
                    from:'noreply@intelligentscripts.com',
                    to: email,
                    subject: 'Kabooter App',
                    html: body
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.send({
                    status: "SUCCESS",
                    message: "Your password reset link has been sent to your email address, please check your email.",
                    data: {}
                })
            });
        }
        else {
            return res.send({
                status: "ERROR",
                message: "Enter a valid email address",
                data: {}
            })
        }
    })
}

exports.resetPassword = (req, res) => {
    const { password, user_id } = req.body
    let errors = ""

    if (!password) {
        errors = "password is required"
    }
    else if (!user_id) {
        errors = "user_id is required"
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    var pass = sha512(password);
    User.updatePassword(pass, user_id, (err, pass) => {
        if (pass) {
            return res.send({
                status: "SUCCESS",
                message: "password change successfully",
                data: {}
            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: "something went wrong",
                data: {}
            })
        }
    })
}

exports.logout = (req, res) => {
    const { user_id } = req.body;
    let errors = ""

    if (!user_id) {
        errors = "user_id is required"
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    User.userLogout(user_id, (err, update) => {
        return res.send({
            status: "SUCCESS",
            message: "User logout successfully",
            data: {}
        })
    })
}


