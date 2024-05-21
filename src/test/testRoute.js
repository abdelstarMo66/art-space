const express = require('express');

const {testingController} = require("./testController")

const router = express.Router();

router.get("/", testingController)

module.exports = router;