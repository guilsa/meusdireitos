$( document ).ready(function() {

  // Send user to credit card modal OR submit the boleto
  var credit_card = $("#select-payment-form #option1");
  var boleto = $("#select-payment-form #option2");
  credit_card.click(function(){
    $("#select-payment-form button").attr({
      type: "button",
      class: "btn btn-primary",
      "data-dismiss": "modal",
      "data-toggle": "modal",
      "data-target": ".credit-card-modal"
    });
  });
  boleto.click(function(){
    $("#select-payment-form button").removeAttr("data-dismiss", "data-toggle", "data-target");
    $("#select-payment-form button").attr({
      type: "submit",
      class: "btn btn-primary"
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

  // Purchase button's click event
  $( "#btn-pagar" ).click(function(e) {

    var input = $("#input-pagar").val().replace("$", "").replace("R", "").replace(",", "")
    var cc_form = $("#payment_form");
    var boleto_form = $("#select-payment-form");
    var amount_in_cents = parseInt(input * 0.15) * 100;
    var amount = parseInt(input * 0.15);

    if (input.match(/[^$,.\d]/) || $("#input-pagar").val() == ""){
      $('#alert_placeholder').removeClass("hidden");
      e.preventDefault();
      return false;
    }else{
      $('#alert_placeholder').addClass("hidden");
      cc_form.append($('<input type="hidden" name="amount">').val(amount_in_cents));
      boleto_form.append($('<input type="hidden" name="amount">').val(amount_in_cents));
      $(".modal-title").text("Cartão de Crédito: R$" + amount);
    }

  });

  // Pagar.me form capture via the Creditly helpers
  PagarMe.encryption_key = "ek_test_1iApOSxO2fc1yi1oIkFJSSZowB5pNu";

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

});
