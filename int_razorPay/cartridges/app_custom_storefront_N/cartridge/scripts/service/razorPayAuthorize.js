var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var razorPaymentAuthorize = LocalServiceRegistry.createService('razor_pay_authorize_service_N',{
    createRequest : function(svc,reqObj){
        var URL = svc.configuration.credential.URL+""+session.privacy.razorpay_payment_id;
        svc.setURL(URL);
        svc.setRequestMethod('GET');
        svc.addHeader('Content-Type','application/json');
        return reqObj;
    },
    parseResponse : function(svc,response){
        return response;
    }
});

module.exports = {
    razorPaymentAuthorize:razorPaymentAuthorize
}