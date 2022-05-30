const ErrorHander = require("../utils/errorhander");
const catchAsynceErrors = require("../middleware/catchAsyncErrors");
const User = require("../modals/userModel");
const { json } = require("express/lib/response");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const crypto = require("crypto");


//Register A User

exports.registerUser = catchAsynceErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "This is a simple id",
            url: "profilepicUrl",
        },
    });

    sendToken(user, 201, res);

});

//Login user

exports.loginUser = catchAsynceErrors(async (req, res, next) => {


    const { email, password } = req.body;

    //checking if user has given password and email both

    if (!email || password) {
        return next(new ErrorHander("Please Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {

        return next(new ErrorHander("Invalid email or Password", 401));
    }

    const isPasswordMatched = user.comparePassword(password);

    if (!isPasswordMatched) {

        return next(new ErrorHander("Invalid email or Password", 401));
    }

    sendToken(user, 200, res);
});

//Logout User

exports.logout = catchAsynceErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })


    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Forgot Password
exports.forgotPassword = catchAsynceErrors(async (req, res, next) => {

    const user = await User.findOne(({ email: req.body.email }));

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    // Get ResetPassword Token 
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, Please ignore it`;

    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHander(error.message, 500))
    }
});


// Reset Password

exports.resetPassword = catchAsyncErrors(async (req, res, nextS) => {


    // Creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digit("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHander("Reset Password Token is invalid or has been expire", 404))
    }

    if (req.body.password !== req.body.confirmpassword) {
        return next(new ErrorHander("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get User details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old Password is incorrect", 400))
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("Password done not matched", 400))
    }
    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res)
});


// Update User profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    // We will add cloudinary later

    const user = await User.findByIdAndUpdate(res.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true
    });
});


// Get all users(admin)

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {

    const User = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//get Single user(Admin)

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {

    const User = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

//update User Role --Admin

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }


    const user = await User.findByIdAndUpdate(res.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true
    });
});

//Delete User --Admin

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    // We will remove cloudinary later

    if (!user) {
        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`))
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted Successfully"
    });
});