const express = require("express");

const {
    createSubject,
    getSubjects,
    getSubject,
    search,
    updateSubject,
    deleteSubject,
} = require("../controllers/subjectController");
const {
    createSubjectValidation,
    getSubjectValidation,
    searchValidation,
    updateSubjectValidation,
    deleteSubjectValidation
} = require("../validations/subjectValidation")
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, allowedToUser, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken, allowedToAdmins("CEO"));

router.route("/")
    .get(allowedToUser(), permissionValidate, getSubjects)
    .post(permissionValidate, createSubjectValidation, validationMiddleware, createSubject)

router.get("/search", permissionValidate, searchValidation, validationMiddleware, search)

router.route("/:id")
    .get(allowedToUser(), permissionValidate, getSubjectValidation, validationMiddleware, getSubject)
    .patch(permissionValidate, updateSubjectValidation, validationMiddleware, updateSubject)
    .delete(permissionValidate, deleteSubjectValidation, validationMiddleware, deleteSubject)

module.exports = router;