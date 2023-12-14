// const asyncHandler = require("../middlewares/asyncHandler");
// const apiSuccess = require("../utils/apiSuccess");
// const ApiError = require("../utils/apiError");
// const UserModel = require("../models/userModel");
//
// const getAllUsers = asyncHandler(async (req, res, next) => {
//     const usersCount = await UserModel.countDocuments();
//     const page = +req.query.page || 1;
//     const limit = +req.query.limit || 20;
//     const skip = (page - 1) * limit;
//     const endIndex = page * limit;
//     // pagination results
//     const pagination = {};
//     pagination.currentPage = page;
//     pagination.limit = limit;
//     pagination.numbersOfPages = Math.ceil(usersCount / limit);
//     pagination.totalResults = usersCount;
//     if (endIndex < usersCount) {
//         pagination.nextPage = page + 1;
//     }
//     if (skip > 0) {
//         pagination.previousPage = page - 1;
//     }
//
//     let sortBy = "createdAt"
//     if (req.query.sort) {
//         sortBy = this.queryString.sort.split(',').join(" ");
//     }
//
//     let limitField = "-__v -password";
//     if (req.query.fields) {
//         limitField = this.queryString.fields.split(",").join(" ");
//     }
//
//     const users = await UserModel
//         .find()
//         .limit(limit)
//         .skip(skip)
//         .sort(sortBy)
//         .select(limitField);
//
//     if (!users) {
//         return next(new ApiError(`No users found`, 404));
//     }
//
//     return res.status(200).json(
//         apiSuccess(
//             `users Found`,
//             200,
//             {
//                 pagination,
//                 users
//             }
//         ));
// });
//
// const getUser = asyncHandler(async (req, res, next) => {
//     const {id} = req.params;
//
//     const user = await UserModel.findById(id, "-password -__v");
//
//     if (!user) {
//         return next(new ApiError(`no user for this id ${id}`, 404))
//     }
//
//     return res.status(200).json(
//         apiSuccess(
//             "user found successfully",
//             200,
//             {user}
//         ));
// });
//
// const updateUser = asyncHandler(async (req, res, next) => {
// })
//
// const deleteUser = asyncHandler(async (req, res, next) => {
// })
//
// module.exports = {
//     getAllUsers,
//     getUser,
//     updateUser,
//     deleteUser,
// }