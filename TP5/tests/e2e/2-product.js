"use strict";

var assert = require("assert");
var config = require("./data/config.json").product;
var productsList = require("./data/products.json");
var utils = require("./utils");

var expectedProduct = {};

/**
 * Validates if the shopping cart count is valid.
 *
 * @param client              The client to use.
 * @param expectedQuantity    The expected quantity.
 */
function validateShoppingCartQuantity(client, expectedQuantity) {
  var shoppingCartConfig = require("./data/config.json").shoppingCart;
  if (expectedQuantity < 1) {
    client.assert.hidden(shoppingCartConfig.elements.count,
      "Le nombre de produits dans le panier ne doit pas être visible lorsque le panier est vide.");
  } else {
    client.assert.visible(shoppingCartConfig.elements.count,
      "Le nombre de produits dans le panier doit être visible.");
    client.assert.containsText(shoppingCartConfig.elements.count, expectedQuantity,
      "Le nombre de produits dans le panier doit être de '" + expectedQuantity + "'.");
  }
}

module.exports = {
  "Page d'un produit": function(client) {
    var randomId = utils.getRandomIntInclusive(1, productsList.length);
    var product = productsList[randomId - 1];

    // Validate the name, the image and the description associated with the current product.
    client.url("http://localhost:8000/" + config.url + randomId)
      .waitForUpdate()
      .assert.containsText(config.elements.name, product.name, "Le nom du produit doit être '" + product.name + "'.")
      .assert.attributeContains(config.elements.image, "src", product.image,
        "L'image associé au produit doit être '" + product.image + "'.")
      .assert.containsText(config.elements.description, utils.stripHTMLTags(product.description),
        "La description associée au produit '" + product.name  + "' doit être valide.");

    // Validate the product features.
    client.elements("css selector", config.elements.features + " > li", function(result) {
      client.assert.equal(result.value.length, product.features.length,
        "Le produit doit compter " + product.features.length + " caractéristiques.");
      result.value.forEach(function(v, i) {
        client.elementIdText(v.ELEMENT, function(result) {
          var feature = utils.stripHTMLTags(product.features[i]);
          assert.equal(result.value, feature, "La caractéristique #" + (i + 1) + " doit être '" + feature + "'.");
        });
      });
    });

    // Validate the product price.
    var price = utils.getFormattedPrice(product.price);
    client.assert.containsText(config.elements.price, price, "Le prix du produit doit être '" + price + "$'.\n");
  },
  "Produit invalide": function(client) {
    var randomInvalidId = utils.getRandomIntInclusive(productsList.length + 1, 1000);
    client.url("http://localhost:8000/" + config.url + randomInvalidId)
      .waitForUpdate()
      .assert.containsText("h1", "Page non trouvée!",
        "Lorsqu'un identifiant invalide est spécifié à la page d'un produit, le titre doit indiquer 'Page non trouvée!'.");
  },
  "Ajout de produits dans le panier": function(client) {
    var randomId = utils.getRandomIntInclusive(1, productsList.length);
    client.url("http://localhost:8000/" + config.url + randomId)
      .waitForUpdate();

    validateShoppingCartQuantity(client, 0);

    // @Disabled
    // Validate the shopping cart quantity associated with the current product.
    /*client.assert.elementPresent(config.elements.quantityAdded,
      "La quantité associée à ce produit dans le panier doit être affichée sur la page.");

    client.assert.containsText("#shopping-cart-quantity", "0", "La quantité associée à ce produit doit être de '0'.");*/

    // Validate if the dialog is hidden.
    client.assert.hidden(config.elements.dialog, "La boîte de confirmation ne doit pas être visible.");

    // Validate if the form is present on the page.
    client.assert.elementPresent(config.elements.form,
      "Le formulaire permettant d'ajouter le produit au panier est présent sur la page.");

    // Interact with the form.
    var randomQuantity = utils.getRandomIntInclusive(1, 10);
    client.clearValue(config.elements.input);
    client.setValue(config.elements.input, randomQuantity, function() {
      console.log("Le nombre de produits à ajouter dans le panier est de '" + randomQuantity + "'.");
    }).submitForm(config.elements.form, function() {
      console.log("Le formulaire a été soumis.");
    });
    client.waitForUpdate();

    // @Disabled
    // Validate if the quantity associated with the product is correct.
    /*client.assert.containsText(config.elements.quantityAdded, randomQuantity,
        "La quantité associée à ce produit doit être de '" + randomQuantity + "'.");*/

    // Validate if the shopping cart count is correct.
    validateShoppingCartQuantity(client, randomQuantity);

    // Validate if the dialog is correct.
    client.assert.visible(config.elements.dialog, "La boîte de confirmation doit être visible sur la page.")
      .waitForElementVisible(config.elements.dialog, 4500, true, function() {},
        "Le boîte de confirmation doit être visible pour 5 secondes.")
      .waitForElementNotVisible(config.elements.dialog, 5500, true, function() {},
        "Le boîte de confirmation ne doit pas être visible après 5 secondes.");

    client.end();

    // @Disabled
    //expectedProduct = productsList[randomId - 1];
    //expectedProduct.quantity = randomQuantity;
  },
  // @Disabled
  "La quantite ajoutee doit etre indiquee dans la liste de produits": ""+function(client) {
    var productsConfig = require("./data/config.json").products;
    var productsList = require("./data/products-all-price-up.json");

    var expectedIndex = 0;
    productsList.forEach(function(product, i) {
      if (product.name === expectedProduct.name) {
        expectedIndex = i;
      }
    });
    client.url("http://localhost:8000/" + productsConfig.url)
      .waitForUpdate();

    client.elements("css selector", productsConfig.elements.list + " > *", function(result) {
      result.value.forEach(function(v, i) {
        client.elementIdText(v.ELEMENT, function(result) {
          if (expectedIndex === i && result.value.indexOf(expectedProduct.name) !== -1) {
            client.assert.ok(result.value.indexOf(expectedProduct.quantity) !== -1,
              "La quantité indiqué pour le produit '" + expectedProduct.name +
              "' doit être '" + expectedProduct.quantity + "'.");
          }
        });
      });
    });
    validateShoppingCartQuantity(client, expectedProduct.quantity);
  }
};
