var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var razorPaymentCapture = LocalServiceRegistry.createService('razorPay_service_capture_N',{
    createRequest : function(svc,reqObj){
        var URL = svc.configuration.credential.URL+""+session.privacy.razorpay_payment_id+"/capture";
        svc.setURL(URL);
        svc.setRequestMethod('POST');
        svc.addHeader('Content-Type','application/json');
        return reqObj;
    },
    parseResponse : function(svc,response){
        return response;
    }
});

module.exports = {
    razorPaymentCapture:razorPaymentCapture
}