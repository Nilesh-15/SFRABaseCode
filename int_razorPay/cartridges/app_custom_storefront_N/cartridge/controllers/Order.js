var server = require('server');
var page = module.superModule;
server.extend(page);

server.prepend(
    'Confirm',
    function (req, res, next) {
        var OrderMgr = require('dw/order/OrderMgr');
        var Transaction = require('dw/system/Transaction');
        var razorPayService = require('*/cartridge/scripts/service/razorPayAuthorize');
        var order;

        if (!req.form.orderToken || !req.form.orderID) {
            res.render('/error', {
                message: Resource.msg('error.confirmation.error', 'confirmation', null)
            });

            return next();
        }
        order = OrderMgr.getOrder(req.form.orderID, req.form.orderToken);
        var result = razorPayService.razorPaymentAuthorize.call();
        if(result.status == 'OK'){
            var jsonResult = JSON.parse(result.object.text);
            Transaction.wrap(function () {
                order.custom.order_payment_status = jsonResult.status;
            });
        }
        next();
    }
);

module.exports = server.exports();