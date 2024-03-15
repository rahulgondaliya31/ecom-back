const express = require("express");
const path = require("path");
const router = express.Router();


router.get("/product/:filename", (req, res) => {
  res.sendFile(path.join(__dirname, "../../uploads/product/"+req.params.filename));
});

router.get("/profile_picture/:filename", (req, res) => {
  res.sendFile(path.join(__dirname, "../../uploads/profile_picture/"+req.params.filename));
});

module.exports = router;