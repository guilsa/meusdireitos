$( document ).ready(function() {

  // Credit card error notification
  $("body").on("creditly_client_validation_error", function(e, data) {
    for (var i = 0; i < data.messages.length; i++) {
      var message = data.messages[i];
      $("#cc_alert_placeholder").append(message + "<br>");
    }
    $("#cc_alert").removeClass("hidden");
  });

  // Credit card validation & error messages
  var options = {
    "security_code_message": "Your security code was really wrong!",
    "expiration_message": "Check yo' expiration date yo!",
    "number_message": "Invalid cc number."
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
    var form = $("#payment_form");
    var amount_in_cents = parseInt(input * 0.15) * 100;
    var amount = parseInt(input * 0.15);

    if (input.match(/[^$,.\d]/) || $("#input-pagar").val() == ""){
      $('#alert_placeholder').removeClass("hidden");
      e.preventDefault();
      return false;
    }else{
      $('#alert_placeholder').addClass("hidden");

      form.append($('<input type="hidden" name="amount">').val(amount_in_cents));
      $(".modal-title").text("CARTÃO DE CRÉDITO: R$" + amount);
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
        // Do something with your credit card output.
        console.log(output["number"]);
        console.log(output["security_code"]);
        console.log(output["expiration_month"]);
        console.log(output["expiration_year"]);
      }



      // var creditCard = new PagarMe.creditCard();
      // creditCard.cardHolderName = $("#payment_form #card_holder_name").val();
      // creditCard.cardExpirationMonth = $("#payment_form #card_expiration_month").val();
      // creditCard.cardExpirationYear = $("#payment_form #card_expiration_year").val();
      // creditCard.cardNumber = $("#payment_form #card_number").val();
      // creditCard.cardCVV = $("#payment_form #card_cvv").val();
      //
      // // pega os erros de validação nos campos do form
      // var fieldErrors = creditCard.fieldErrors();
      //
      // //Verifica se há erros
      // var hasErrors = false;
      // for(var field in fieldErrors) { hasErrors = true; break; }
      //
      // if(hasErrors) {
      //     // realiza o tratamento de errors
      //     alert(fieldErrors);
      // } else {
      //     // se não há erros, gera o card_hash...
      //     creditCard.generateHash(function(cardHash) {
      //         // ...coloca-o no form...
      //         form.append($('<input type="hidden" name="card_hash">').val(cardHash));
      //         // e envia o form
      //         form.get(0).submit();
      //     });
      // }
      //
      // return false;
  });

});
