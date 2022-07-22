function capturePayment () {
    var captureService = require('*/cartridge/scripts/service/cupturePaymentService');
    var OrderMgr = require('dw/order/OrderMgr');
    var Transaction = require('dw/system/Transaction');
    
    var authorizeOrder = OrderMgr.queryOrders("custom.order_payment_status = {0}",null,'authorized').asList().toArray();
    try {
        for (let index = 0; index < authorizeOrder.length; index++) {
            var reqObject = {
                "amount" : authorizeOrder[index].adjustedMerchandizeTotalGrossPrice.value,
                "currency" : authorizeOrder[index].adjustedMerchandizeTotalGrossPrice.currencyCode,
            }
            var orderID = authorizeOrder[index].orderNo;
            Transaction.wrap(function () {
                var order = OrderMgr.getOrder(orderID)
                order.custom.order_payment_status = "capture";
                order.paymentStatus = 2;
            });
            session.privacy.razorpay_payment_id = authorizeOrder[index].paymentInstrument.custom.razorpay_payment_id;
            var result = captureService.razorPaymentCapture.call(JSON.stringify(reqObject));
            if(result.status == 'OK'){
                var jsonResult = JSON.parse(result.object.text);
                // Transaction.wrap(function () {
                //     authorizeOrder[index].custom.order_payment_status = jsonResult.status;
                //     authorizeOrder[index].setPaymentStatus = 2;
                // });
            }
        }
    } catch (e) {
        dw.system.Logger.warn('Capture Servie throwing error :'+e);
    }
}

module.exports ={
    capturePayment:capturePayment
}