var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

var razorPayment = LocalServiceRegistry.createService('razor_pay_service_N',{
    createRequest : function(svc,reqObj){
        svc.addHeader('Content-Type','application/json');
        return reqObj;
    },
    parseResponse : function(svc,response){
        return response;
    }
});


module.exports = {
    razorPayment:razorPayment
}