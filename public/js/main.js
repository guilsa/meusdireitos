$( document ).ready(function() {

  // As-you-type currency formatting
  $("#input-pagar").number( true, 2, ",", "." );

  var url = window.location.href;
  if ( url.indexOf('?pagamento') != -1 ) {
    $('.payment-amount-modal').modal('show');
  }

  // Send user to credit card modal OR modal to confirm the boleto
  var credit_card = $(".select-payment-modal #option1");
  var boleto = $(".select-payment-modal #option2");
  credit_card.click(function(){
    $(".select-payment-modal button").attr({
      type: "button",
      class: "btn btn-primary",
      "data-dismiss": "modal",
      "data-toggle": "modal",
      "data-target": ".credit-card-modal"
    });
  });
  boleto.click(function(){
    // $("#select-payment-form button").removeAttr("data-dismiss");
    // $("#select-payment-form button").removeAttr("data-toggle");
    // $("#select-payment-form button").removeAttr("data-target");
    $(".select-payment-modal button").attr({
      class: "btn btn-primary",
      "data-target": ".boleto-confirm-modal"
    });
  });

  // Credit card error notification
  $("body").on("creditly_client_validation_error", function(e, data) {
    var message = ""
    for (var i = 0; i < data.messages.length; i++) {
      message = message + data.messages[i] + "<br/>";
    }
    $("#cc_alert_placeholder").html(message);
    $("#cc_alert").removeClass("hidden");
  });

  // Credit card validation & error messages
  var options = {
    "security_code_message": "Código de segurança inválido.",
    "expiration_message": "Data de expiração inválida.",
    "number_message": "Número do cartão inválido."
  };
  var creditly = Creditly.initialize(
    '.creditly-wrapper .expiration-month-and-year',
    '.creditly-wrapper .credit-card-number',
    '.creditly-wrapper .security-code',
    '.creditly-wrapper .card-type',
    options);

  // Pagamento Amount Modal
  // Pagar button click event
  $( "#btn-pagar" ).click(function(e) {
    var input = parseFloat($("#input-pagar").val()); // get user input for payment amount
    stopIfInputInvalid(input, $(".payment-amount-form button"));

    var cc_form = $("#payment_form"); // prepar to save the amount to another form
    var boleto_form = $("#select-payment-form"); // same as above
    var amount_in_cents = input * 0.15 * 100; // Pagar.me needs amount in cents
    var amount = (input * 0.15).toFixed(2); // round off the 15%
    var brazilianReaisFormatting = accounting.formatMoney(amount, "R$", 2, ".", ","); // use accounting.js to reformat

    // Modals don't respond to preventDefault()
    // Ugly solution was to remove the submit button's attributes that tell it to open next modal
    // Refactoring notes: seperate out this function to a helper file
    function stopIfInputInvalid(input, element){
      if ( inputInvalid(input) ) {
        element.removeAttr("data-dismiss");
        element.removeAttr("data-toggle");
        element.removeAttr("data-target");
        element.attr({
          type: "button",
          id: "btn-pagar",
          class: "btn btn-primary btn-lg"
        });
      } else {
        element.attr({
          type: "button",
          id: "btn-pagar",
          class: "btn btn-primary",
          "data-dismiss": "modal",
          "data-toggle": "modal",
          "data-target": ".select-payment-modal"
        });
      }
    };

    // Need to refactor this stuff into a helper file for encapsulation/easier reading
    function inputInvalid(input){
      return isNaN(input) ? true : false;
    };

    cc_form.append($('<input type="hidden" name="amount">').val(amount_in_cents));
    boleto_form.append($('<input type="hidden" name="amount">').val(amount_in_cents));
    $(".credit-card-modal .modal-title").text("Taxa Vou Atrás: " + brazilianReaisFormatting);
    $(".boleto-confirm-modal .modal-title").text("Taxa Vou Atrás: " + brazilianReaisFormatting);

  });

  // Pagar.me form capture via the Creditly helpers
  PagarMe.encryption_key = "ek_live_Soq0KYBZ8D37Sgufeh56KACOR92F4M";

  var form = $("#payment_form");

  form.submit(function(event) { // quando o form for enviado...
      // inicializa um objeto de cartão de crédito e completa
      // com os dados do form

      event.preventDefault();
      var output = creditly.validate();
      if (output) {
        // Complete payment.

        var creditCard = new PagarMe.creditCard();
        creditCard.cardHolderName = $("#payment_form #card_holder_name").val();
        if (output["expiration_month"].toString().length == 1){
          output["expiration_month"] = "0" + output["expiration_month"]
        }
        creditCard.cardExpirationMonth = output["expiration_month"];
        creditCard.cardExpirationYear = output["expiration_year"];
        creditCard.cardNumber = output["number"];
        creditCard.cardCVV = output["security_code"];

        // pega os erros de validação nos campos do form
        var fieldErrors = creditCard.fieldErrors();

        //Verifica se há erros
        var hasErrors = false;
        for(var field in fieldErrors) { hasErrors = true; break; }

        if(hasErrors) {
            // realiza o tratamento de errors
            alert(fieldErrors);
        } else {
            // se não há erros, gera o card_hash...
            creditCard.generateHash(function(cardHash) {
                // ...coloca-o no form...
                form.append($('<input type="hidden" name="card_hash">').val(cardHash));
                // e envia o form
                form.get(0).submit();
            });
        }

        return false;
    }
  });


  $('#characterLeft').text('1500 caracteres restantes');
    $('#message').keydown(function () {
        var max = 1500;
        var len = $(this).val().length;
        if (len >= max) {
            $('#characterLeft').text('Você alcançou o seu limite.');
            $('#characterLeft').addClass('red');
            $('#btnSubmit').addClass('disabled');
        }
        else {
            var ch = max - len;
            $('#characterLeft').text(ch + ' caracteres restantes');
            $('#btnSubmit').removeClass('disabled');
            $('#characterLeft').removeClass('red');
        }
    });

});
