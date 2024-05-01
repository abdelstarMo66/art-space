const asyncHandler = require("../middlewares/asyncHandler");
const UserModel = require("../models/userModel");


const testingController = asyncHandler(async (req, res, next) => {
    const doc = await UserModel.find();

    return res.json(doc);
});

module.exports = {testingController}

// auction cart user