const asyncHandler = (fn) => req => {
    fn(req, res, next).catch((error) => {
        next(error);
    });
};

module.exports = asyncHandler;