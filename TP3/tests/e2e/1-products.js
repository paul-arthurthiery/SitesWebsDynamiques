"use strict";

var assert = require("assert");
var config = require("./data/config.json").products;
var productConfig = require("./data/config.json").product;
var utils = require("./utils");

/**
 * Validates the products list.
 *
 * @param client                The client to use.
 * @param expectedProductsList  The expected products in the list.
 */
function validateProductsList(client, expectedProductsList) {
  var expectedProductsCountText = expectedProductsList.length + " produit" +
    ((expectedProductsList.length > 1) ? "s" : "");

  // Check if the products count displayed is correct.
  client.waitForText(config.elements.count, function(text) {
    return text.indexOf(expectedProductsCountText) !== -1;
  }, 2000, "L'indicateur du nombre de produits doit indiquer '" + expectedProductsCountText + "'.");

  client.elements("css selector", config.elements.list + " > *", function(result) {
    var count = 0;

    // Check if the products count is correct.
    function checkProductsCount() {
      assert.equal(count, expectedProductsList.length,
        "La liste de produits doit compter un total de " + expectedProductsList.length + " produits.");
    }

    // Iterates over all the products of the list.
    var products = result.value;
    products.forEach(function(v, i) {
      client.elementIdDisplayed(v.ELEMENT, function(result) {
        if (!result.value) {
          if (i === products.length - 1) { // Checks the products count at the end.
            checkProductsCount();
          }
          return;
        }
        var index = count;
        ++count;


        // Retrieve the element text.
        client.elementIdText(v.ELEMENT, function(result) {
          // Check if the product name is correct.
          client.assert.ok(result.value.indexOf(expectedProductsList[index].name) !== -1,
            "Le produit #" + count + " doit être '" + expectedProductsList[index].name + "'.");

          // Check if the product price is correct.
          var price = utils.getFormattedPrice(expectedProductsList[index].price);
          assert(result.value.indexOf(price) !== -1,
            "Le prix pour le produit #" + count + " doit être '" + price + "$'.");
        });

        // Check if the product image is correct.
        client.elementIdElement(v.ELEMENT, "css selector", "img", function(result) {
          client.elementIdAttribute(result.value.ELEMENT, "src", function(result) {
            assert(result.value.indexOf(expectedProductsList[index].image) !== -1,
              "L'image pour le produit #" + count + " doit être '" + expectedProductsList[index].image + "'.");
          });
        });

        // Check if the product link is correct.
        client.elementIdName(v.ELEMENT, function(result) {
          function validateLink(element) {
            client.elementIdAttribute(element, "href", function(result) {
              var link = productConfig.url + expectedProductsList[index].id;
              assert(result.value.indexOf(link) !== -1,
                "Le lien pour le produit #" + count + " doit être '" + link + "'.");
            });
          }
          if (result.value.toLowerCase() === "a") {
            validateLink(v.ELEMENT);
          } else {
            client.elementIdElement(v.ELEMENT, "css selector", "a", function(result) {
              validateLink(result.value.ELEMENT);
            });
          }
        });

        if (i === products.length - 1) { // Checks the products count at the end.
          checkProductsCount();
        }
      });
    });
  });
}

/**
 * Validates a buttons group.
 *
 * @param client            The client to use.
 * @param buttonGroupId     The ID of the button group.
 * @param expectedButtons   The expected buttons list.
 * @param fileTemplate      The file template to use to validate the products list.
 */
function validateButtonsGroup(client, buttonGroupId, expectedButtons, fileTemplate) {
  client.assert.elementPresent(buttonGroupId, "Le groupe de boutons '" + buttonGroupId + "' est présent sur la page.");

  client.elements("css selector", buttonGroupId + " > button", function(result) {
    client.assert.equal(result.value.length, expectedButtons.length,
      "Le groupe de boutons '" + buttonGroupId + "' doit compter " + expectedButtons.length + " boutons.");

    // Iterates over the buttons.
    result.value.map(function(v, i) {
      var name = expectedButtons[i].name;

      // Validate the text of the button.
      client.elementIdText(v.ELEMENT, function(result) {
        client.assert.equal(result.value, name, "Le nom du bouton #" + (i + 1) + " doit être '" + name + "'.");
      });

      // Simulate a click on the button.
      client.elementIdClick(v.ELEMENT, function() {
        console.log("\nLe bouton '" + name + "' est cliqué...")
      }).waitForUpdate()
        .elementIdCssProperty(v.ELEMENT, "selected", function(result) {
          client.assert.equal(result.state, "success", "Le bouton '" + name + "' doit posséder la classe '.selected'.");
        })
        .elements("css selector", buttonGroupId + " > button:not(.selected)", function(result) {
          var expectedCount = expectedButtons.length - 1;
          client.assert.equal(result.value.length, expectedCount,
            "Il doit y avoir " + expectedCount + " boutons qui ne possède pas la classe '.selected'.");
        })
        .perform(function() {
          validateProductsList(client, require("./data/" + fileTemplate.replace("{{ID}}", expectedButtons[i].id)));
        });
    });
  });
}

var consoleLog;
module.exports = {
  before: function() {
    consoleLog = console.log;
  },
  "Page des produits": function(client) {
    console.log = function() {}; // Ignore the first log.
    client.url("http://localhost:8000/" + config.url)
      .perform(function() {
        console.log = consoleLog;
      })
      .assert.elementPresent(config.elements.list, "La liste de produits est présente sur la page.")
      .waitForUpdate();
  },
  "Liste des produits pour les valeurs par defauts" : function(client) {
    validateProductsList(client, require("./data/products-all-price-up.json"));
  },
  "Categories des produits": function(client) {
    var expectedCategories = [
      { id: "cameras",   name: "Appareils photo"   },
      { id: "consoles",  name: "Consoles"          },
      { id: "screens",   name: "Écrans"            },
      { id: "computers", name: "Ordinateurs"       },
      { id: "all",       name: "Tous les produits" }
    ];
    validateButtonsGroup(client, config.elements.categories, expectedCategories, "products-{{ID}}-price-up.json");
  },
  "Classement des produits": function(client) {
    var expectedSortingCriteria = [
      { id: "price-up",   name: "Prix (bas-haut)" },
      { id: "price-down", name: "Prix (haut-bas)" },
      { id: "alpha-up",   name: "Nom (A-Z)"       },
      { id: "alpha-down", name: "Nom (Z-A)"       }
    ];
    validateButtonsGroup(client, config.elements.criteria, expectedSortingCriteria, "products-all-{{ID}}.json");
    client.end();
  }
};
