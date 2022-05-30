const jsonwebtoken = require("jsonwebtoken");
const ErrorHander = require("../utils/errorHander");
const catchAsynceErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../modals/userModel")

const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("Please Login To accrss this resource", 401))
    }

    const decodeDate = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodeDate._id);

    next();

});

exports.authorizeRoles = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHander(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403));
        };
    }
    next();
}

