const Order = require("../modals/orderModel");
const Product = require("../modals/productModal");
const ErrorHander = require("../utils/errorHander");
const catchAsynceErrors = require("../middleware/catchAsyncErrors");




// Create New Order

exports.newOrder = catchAsynceErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order,
    })
});

// get single order

exports.getSingleOrder = catchAsynceErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHander("Order not found with this id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});


// get logged in user order

exports.myOrders = catchAsynceErrors(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    })
})

// get All order -- admin

exports.getAllOrders = catchAsynceErrors(async (req, res, next) => {

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
});
//Update order status -- admin

exports.updateOrder = catchAsynceErrors(async (req, res, next) => {

    const orders = await Order.find(req.params.id);

    if (!order) {
        return next(new ErrorHander("order not found with this Id", 404))
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHander("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity)
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.Stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}




// Delete orders -- admin

exports.deleteOrder = catchAsynceErrors(async (req, res, next) => {

    const orders = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
});