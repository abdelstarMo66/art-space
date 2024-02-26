const express = require('express');
const {check} = require("express-validator");

const {userSearch} = require("../controllers/searchController")
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {permissionValidate, allowedToUser} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);

router.get("/user",
    allowedToUser(),
    permissionValidate,
    [
        check("keyword").notEmpty().withMessage("keyword search must be not empty")
    ],
    validationMiddleware,
    userSearch,
)

module.exports = router;