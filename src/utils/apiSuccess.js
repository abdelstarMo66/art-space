const apiSuccess = (message, code, data) => {
    return {
        status: "success",
        code: code,
        message: message,
        data: data
    }
};


module.exports = apiSuccess;