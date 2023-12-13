const asyncHandler = require("../middlewares/asyncHandler");
const handlerFactory = require("./handlerFactory")
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const UserModel = require("../models/userModel");

const getAllUsers = handlerFactory.getAll(UserModel, "users");

const getUser = handlerFactory.getOne(UserModel, "users");

const updateUser = asyncHandler(async (req, res, next) => {
})

const deleteUser = asyncHandler(async (req, res, next) => {
})

module.exports = {
    getAllUsers, getUser, updateUser, deleteUser,
}