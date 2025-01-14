const ordersBusiness = require('./ordersBusiness');
const cartBusiness = require('../cart/cartBusiness');
let $ = require('jquery');
const request = require('request');
const moment = require('moment');

const renderCheckoutPage = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await cartBusiness.getCartWithItem(userId);
        const userProfile = await ordersBusiness.getUserProfile(userId);
        const { subtotal, taxes, total } = calculateTotalPrice(cartItems.items);
        res.render('checkout', {
            title: 'Checkout',
            userProfile,
            cartItems,
            subtotal,
            taxes,
            total,
        });
    } catch (error) {
        res.status(500).send('Error rendering checkout page');
    }
};

const placeOrder = async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    
    let config = require('config');
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = `${process.env.APP_URL}${config.get('vnp_ReturnUrl')}`;
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = '';

    console.log(tmnCode);
    console.log(secretKey);
    console.log(vnpUrl);
    console.log(returnUrl);
    console.log(orderId);
    console.log(amount);
    console.log(req.body);
    
    let locale = 'vn'
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100 * parseFloat(process.env.VND_TO_USD);
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    // const userId = req.user.id;
    // const { recipient, phone, address } = req.body;
    // const order = await ordersBusiness.createOrder(
    //     userId,
    //     recipient,
    //     phone,
    //     address,
    // );
    // await ordersBusiness.clearCart(userId);

    res.redirect(vnpUrl)
};

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const getVnpayReturn = (req, res) => {
    let vnp_Params = req.query;

    // Extract secure hash for verification
    let secureHash = vnp_Params['vnp_SecureHash'];

    // Remove hash-related fields for signature validation
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sort parameters
    vnp_Params = sortObject(vnp_Params);

    // Configuration for VNPAY
    let config = require('config');
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');

    // Generate secure hash to validate
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    // Check if secure hash matches
    if (secureHash === signed) {
        // Send relevant data to the view
        res.render('checkout-success', {
            code: vnp_Params['vnp_ResponseCode'], // Success or failure response code
            transactionId: vnp_Params['vnp_TransactionNo'], // Transaction ID
            transactionTime: vnp_Params['vnp_PayDate'], // Payment date and time
            amountPaid: (vnp_Params['vnp_Amount'] / 100).toFixed(2), // Convert amount to readable format
            bankCode: vnp_Params['vnp_BankCode'], // Bank code used
        });
    } else {
        // Send failure response with code 97
        res.render('checkout-success', {
            code: '97',
        });
    }
};

const calculateTotalPrice = (cartItems) => {
    const vat = 0.08;
    const subtotal =
        Math.round(
            cartItems.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0,
            ) * 100,
        ) / 100;
    const taxes = parseFloat(process.env.SHIPPING_FEE);
    const total = Math.round((subtotal + taxes) * 100) / 100;
    return { subtotal, taxes, total };
};

const getOrderHistory = (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const orders = ordersBusiness.getOrdersByUserId(userId);

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.json({
            message: "Order history retrieved successfully.",
            orders,
        });
    } catch (error) {
        console.error("Error retrieving order history:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await ordersBusiness.getOrderById(id);

        res.render('order-detail', {
            title: 'Order Details',
            order,
        })
    } catch (error) {
        console.error("Error getting order:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

module.exports = {
    renderCheckoutPage,
    placeOrder,
    getOrderHistory,
    getOrderById,
    getVnpayReturn,
};
