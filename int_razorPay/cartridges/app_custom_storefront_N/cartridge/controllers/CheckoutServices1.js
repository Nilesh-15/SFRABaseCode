'use strict';
var server = require('server');
var page = module.superModule;
server.extend(page);

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
server.prepend('SubmitPayment',
    function (req, res, next) {
    var reqValue = req.httpParameterMap;
    if(reqValue != null){
        session.privacy.razorpay_payment_id = reqValue.razorpay_payment_id.value;
        session.privacy.razorpay_order_id = reqValue.razorpay_order_id.value;
        session.privacy.razorpay_signature = reqValue.razorpay_signature.value;
    }
    // res.json({});
    this.emit('route:Complete', req, res);
    // next();
    return;
});

module.exports = server.exports();
