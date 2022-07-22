function redirectToRazorPay(data){
    var url = "https://checkout.razorpay.com/v1/checkout.js";
    $.getScript( url, function() {
        console.log(JSON.stringify(data));
        // alert(data.key +"-"+data.amount+"-"+data.currency+"-"+data.id);
        var options = {
            "key": data.key, // Enter the Key ID generated from the Dashboard
            "amount": data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": data.currency,
            "name": "Appendd Digital Solution",
            "description": "Test Transaction",
            "image": "https://logodix.com/logos/1931230",
            "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response){
                if(response.razorpay_payment_id !== null){
                    $.ajax({
                        url:data.redirectURL,
                        type:"POST",
                        data:response,
                        dataType:"json",
                        success:function(data){
                            if(data.success){
                                $('.submit-payment').click();
                            }
                        }
                    });
                }
                console.log(response.razorpay_payment_id);
                console.log(response.razorpay_order_id);
                console.log(response.razorpay_signature)
            },
            "prefill": {
                "name": data.customerName,
                "email": data.customerEmail,
                "contact": data.customerContactNumber
            },
            "notes": {
                "address": data.customerAddress
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
        rzp1.on('payment.failed', function (response){
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
        });
    });
}

$('#rzp-button1').click(function(){
    var url = $(this).attr('url');
    console.log(url);
    var reqData = {
        "custName" : $(this).data('custname'),
        "custAddress" : $(this).data('address'),
        "custEmail" : $(this).data('email'),
        "custPhone" : $(this).data('contactnum'),
        "grandAmount" : $(this).data('amount')
    }
    console.log(JSON.stringify(reqData));
    $.ajax({
        url: url,
        type: 'POST',
        data: reqData,
        dataType: "json",
        success: function (data) {
            // window.location.replace(data.redirectURL);
            redirectToRazorPay(data);
        }
    });
});