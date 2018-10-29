jQuery.validator.addMethod("expicb", function(value, element) {
    var filter = new RegExp("(0[123456789]|10|11|12)([/])([1-2][0-9][0-9][0-9])");
    return filter.test(value)
}, "La date d’expiration de votre carte de crédit est invalide.");



$('#orderform').validate({
    rules: {
        firstname:{
            required: true,
            minlength: 2
        },
        lastname: {
            required: true,
            minlength: 2
        },
        email: {
            required: true,
            minlength: 2
        },
        phone:{
            required: true,
            phoneUS: true
        },
        credit_card:{
            required: true,
            creditcard: true
        },
        credit_card_expiry:{
            required: true,
            expicb: true
        },
        messages:{


        },
        submitHandler: function(form) {
            alert("Submitted!");

        }
    }



})


