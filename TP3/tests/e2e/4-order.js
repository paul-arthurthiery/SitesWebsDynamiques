"use strict";

var config = require("./data/config.json").order;
var shoppingCartConfig = require("./data/config.json").shoppingCart;
var utils = require("./utils");

var expectedProduct = {};
var errorMessages = {
  required: "Ce champ est obligatoire.",
  minLength: "Veuillez fournir au moins 2 caractères.",
  email: "Veuillez fournir une adresse électronique valide.",
  phone: "Veuillez fournir un numéro de téléphone valide.",
  creditCard: "Veuillez fournir un numéro de carte de crédit valide.",
  creditCardExpiry: "La date d'expiration de votre carte de crédit est invalide."
};
var inputs = [
  {
    id: config.elements.firstName,
    entries: [
      { value: "A", isValid: false, errorMessage: errorMessages.minLength },
      { value: "Antoine", isValid: true }
    ]
  },
  {
    id: config.elements.lastName,
    entries: [
      { value: "B", isValid: false, errorMessage: errorMessages.minLength },
      { value: "Béland", isValid: true }
    ]
  },
  {
    id: config.elements.email,
    entries: [
      { value: "antoine.beland@", isValid: false, errorMessage: errorMessages.email },
      { value: "antoine.beland@polymtl.ca", isValid: true }
    ]
  },
  {
    id: config.elements.phone,
    entries: [
      { value: "514-340-47", isValid: false, errorMessage: errorMessages.phone },
      { value: "514-340-4711", isValid: true }
    ]
  },
  {
    id: config.elements.creditCard,
    entries: [
      { value: "4111 1111 1111", isValid: false, errorMessage: errorMessages.creditCard },
      { value: "4111 1111 1111 1111", isValid: true }
    ]
  },
  {
    id: config.elements.creditCardExpiry,
    entries: [
      { value: "13/18", isValid: false, errorMessage: errorMessages.creditCardExpiry },
      { value: "00/18", isValid: false, errorMessage: errorMessages.creditCardExpiry },
      { value: "01/999", isValid: false, errorMessage: errorMessages.creditCardExpiry },
      { value: "01/20", isValid: true }
    ]
  }
];

module.exports = {
  before: function(client) {
    var productConfig = require("./data/config.json").product;
    var productsList = require("./data/products.json");

    expectedProduct = productsList[utils.getRandomIntInclusive(0, productsList.length - 1)];
    client.url("http://localhost:8000/" + productConfig.url + expectedProduct.id)
      .waitForUpdate()
      .clearValue(productConfig.elements.input)
      .setValue(productConfig.elements.input, 1)
      .submitForm(productConfig.elements.form, function() {
        console.log("Le produit '" + expectedProduct.name + "' a été ajouté au panier.");
      });
  },
  "État du panier d'achats": function(client) {
    client.url("http://localhost:8000/" + config.url)
      .waitForUpdate();

	// @Disabled
    /*var expectedTotalAmount = utils.getFormattedPrice(expectedProduct.price);
	client.verify.containsText(config.elements.totalAmount, expectedTotalAmount,
      "Le total indiqué doit être '" + expectedTotalAmount + "$'.");*/

    // Validate if the shopping cart count is correct.
    client.assert.visible(shoppingCartConfig.elements.count,
      "Le nombre de produits dans le panier doit pas être visible.");
    client.assert.containsText(shoppingCartConfig.elements.count, 1,
      "Le nombre de produits dans le panier doit être de '1'.");
  },
  "Soumission d'un formulaire invalide": function(client) {
    // Submit the invalid form.
    client.submitForm(config.elements.form)
      .waitForUpdate();

    // Check if the URL is the same than before.
    client.assert.urlContains(config.url, "La formulaire ne doit pas être envoyé en cas d'erreur(s).");
    inputs.forEach(function(input) {
      client.assert.containsText(input.id + "-error", errorMessages.required, "Le champ " + input.id +
        " doit indiquer qu'il est obligatoire.");
    });
  },
  "Remplissage du formulaire": function(client){
    inputs.forEach(function(input) {
      input.entries.forEach(function(entry) {
        client.clearValue(input.id)
          .setValue(input.id, entry.value);

        var statusMessage = "";
        if (entry.isValid) {
          statusMessage = "Le champ " + input.id + " est valide pour la valeur '" + entry.value + "'."
        } else {
          statusMessage = "Le champ " + input.id + " doit indiquer une erreur pour la valeur '" + entry.value + "'.";
        }
        client.assert.containsText(input.id + "-error", (!entry.isValid) ? entry.errorMessage : "", statusMessage);
      });
    });
  },
  "Soumission d'un formulaire valide": function(client) {
    var confirmationConfig = require("./data/config.json").confirmation;

    // Submit the valid form.
    client.submitForm(config.elements.form, function() {
      console.log("Soumission du formulaire valide...")
    }).waitForUpdate();

    // Check if the URL is valid.
    client.assert.urlContains(confirmationConfig.url, "La page de confirmation doit être affichée.");
    client.waitForUpdate();

    // Check if the name and the confirmation number are valid.
    client.assert.containsText(confirmationConfig.elements.name, "Antoine Béland",
        "Le nom indiqué doit être 'Antoine Béland'.")
      .assert.containsText(confirmationConfig.elements.confirmationNumber, "1",
        "Le numéro de confirmation doit être '1'.");

    // Validate if the shopping cart count is hidden when the cart is empty.
    client.assert.hidden(shoppingCartConfig.elements.count,
        "Le nombre de produits dans le panier ne doit pas être visible lorsque le panier est vide.");

    client.end();
  }
};
