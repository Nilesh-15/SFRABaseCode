var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var BasketMgr = require('dw/order/BasketMgr');
server.post('PayPayment', function(req,res,next){
    try {
        var razorPayService = require('*/cartridge/scripts/service/razorPayPayment');
        var formData = req.httpParameterMap;
        var currentBasket = BasketMgr.getCurrentBasket();
        var grandTotal = currentBasket.adjustedMerchandizeTotalGrossPrice.value;
        var grandTotalCurrency = currentBasket.adjustedMerchandizeTotalGrossPrice.currencyCode;
        var requestObj = {
            "amount": grandTotal * 100,
            "currency": grandTotalCurrency,
            "receipt": Date.now().toString(36) + Math.random().toString(36).substr(2)
        }
        var result = razorPayService.razorPayment.call(JSON.stringify(requestObj));
        if(result.status == 'OK'){
            var jsonResult = JSON.parse(result.object.text);
            jsonResult.redirectURL = ""+URLUtils.url('RazorPay-HandleResponse');
            jsonResult.customerName = ""+formData.custName.value;
            jsonResult.customerEmail = ""+formData.custEmail.value;
            jsonResult.customerContactNumber = ""+formData.custPhone.value;
            jsonResult.customerAddress = ""+formData.custAddress.value;
            jsonResult.key = ""+dw.system.Site.getCurrent().getPreferences().getCustom()['razorId'];
            res.json(jsonResult);
        }else{
            dw.system.Logger.warn("resopnse error :"+JSON.stringify(result.object.text));
        }
    } catch (error) {
        dw.system.Logger.warn("Service having issue Please check :"+error)
    }
    next();
});

server.post('HandleResponse',function(req,res,next){
    var reqValue = req.httpParameterMap;
    var success = false;
    if(reqValue != null){
        session.privacy.razorpay_payment_id = reqValue.razorpay_payment_id.value;
        session.privacy.razorpay_order_id = reqValue.razorpay_order_id.value;
        session.privacy.razorpay_signature = reqValue.razorpay_signature.value;
        success = true
    }
    res.json({
        success:success
    });
    next();
});
module.exports = server.exports();