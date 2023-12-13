const express = require('express');

const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = require("../controllers/userController")
const {
    getUserValidation,
    updateUserValidation,
    deleteUserValidation,
} = require("../validations/userValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/:id")
    .get(getUserValidation, validationMiddleware, getUser)
    .patch(updateUserValidation, validationMiddleware, updateUser)
    .delete(deleteUserValidation, validationMiddleware, deleteUser);

module.exports = router