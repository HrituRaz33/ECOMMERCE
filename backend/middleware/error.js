const ErrorHander = require("../utils/errorhander")



module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong Mongodb ID error

    if (error.name = "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHander(message, 400);
    }

    // Mongoose duplicate key error
    if (err.code === 1100) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHander(message, 400)
    }
    //Wrong JWT  error

    if (error.name === "JsonWebTokenError") {
        const message = `Json web Token is Invalid, try again`;
        err = new ErrorHander(message, 400);
    }

    //Wrong JWT error

    if (error.name === "TokenExpiredError") {
        const message = `Json web Token is Expired, try again`;
        err = new ErrorHander(message, 400);
    }




    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}