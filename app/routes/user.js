module.exports = app => {
    const router = require("express").Router()
    const user = require("../controllers/user.js")
    const fileUpload = require("express-fileupload")
    app.use(fileUpload())
  
  
    app.post("/auth/signUp",user.signUp);
    app.post("/auth/login",user.login);
    app.post("/auth/changePassword",user.changePassword);
    app.post("/auth/updateProfile",user.updateProfile);
    app.post("/auth/userDetail",user.userDetail);
    app.post("/auth/forgotPassword",user.forgotPassword);
    app.post("/auth/resetPassword",user.resetPassword);
    app.post("/auth/logout",user.logout);
};