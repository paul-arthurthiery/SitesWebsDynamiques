

const assert = require('assert');
const config = require('./data/config.json').shoppingCart;
const utils = require('./utils');

let expectedProducts = [];

/**
 * Validates the view when the shopping cart is empty.
 *
 * @param client  The client to use.
 * @private
 */
function validateEmptyShoppingCartView(client) {
  client.assert.containsText('h1', 'Panier', "Le titre doit être 'Panier'.")
    .assert.containsText(
      'h1 + *', 'Aucun produit dans le panier.',
      "Le paragraphe doit indiquer 'Aucun produit dans le panier.'.",
    )
    .assert.hidden(
      config.elements.count,
      'Le nombre de produits dans le panier ne doit pas être visible lorsque le panier est vide.',
    );
}

/**
 * Validates the shopping cart table.
 *
 * @param client        The client to use.
 * @param productsList  The products list to use.
 * @private
 */
function validateShoppingCartTable(client, productsList) {
  productsList = productsList.slice(); // Clone the list

  // Select all the "tr" elements in the table.
  client.elements('css selector', 'table tr', (result) => {
    result.value.forEach((v, i) => {
      if (i === 0) { // Ignore the table header.
        return;
      }
      const product = productsList[i - 1];

      client.elementIdText(v.ELEMENT, (result) => {
        // Check if the name of the product is valid.
        client.assert.ok(result.value.indexOf(product.name) !== -1, `Le produit #${i
        } doit être '${product.name}'.`);

        // Check if the unit price is valid.
        const expectedUnitPrice = utils.getFormattedPrice(product.price);
        assert.ok(result.value.indexOf(expectedUnitPrice) !== -1, `Le prix unitaire pour le product '${
          product.name}' doit être ${expectedUnitPrice}$.`);
      });

      // Check if the "X" button is present.
      client.elementIdElement(v.ELEMENT, 'css selector', config.elements.removeItemButton, (result) => {
        assert.equal(result.state, 'success', `Le bouton 'X' pour le produit '${product.name
        }' doit être présent.`);
      });

      // Check if the quantity is valid.
      client.elementIdElement(v.ELEMENT, 'css selector', config.elements.quantity, (result) => {
        client.elementIdText(result.value.ELEMENT, (result) => {
          assert.equal(result.value, product.quantity, `La quantité pour le produit '${product.name
          }' doit être '${product.quantity}'.`);
        });
      });

      // Check if the status of the "-" button is valid.
      client.elementIdElement(v.ELEMENT, 'css selector', config.elements.removeQuantityButton, (result) => {
        assert.equal(result.state, 'success', `Le bouton '-' pour le produit '${product.name
        }' doit être présent.`);
        client.elementIdEnabled(result.value.ELEMENT, (result) => {
          const expectedValue = product.quantity > 1;
          assert.equal(result.value, expectedValue, `Le bouton '-' pour le produit '${product.name
          }' doit être ${(expectedValue) ? 'activé' : 'désactivé'}.`);
        });
      });

      // Check if the "+" button is present.
      client.elementIdElement(v.ELEMENT, 'css selector', config.elements.addQuantityButton, (result) => {
        assert.equal(result.state, 'success', `Le bouton '+' pour le produit '${product.name
        }' doit être présent.`);
      });

      // Check if the price is valid.
      client.elementIdElement(v.ELEMENT, 'css selector', config.elements.price, (result) => {
        client.elementIdText(result.value.ELEMENT, (result) => {
          console.log(result.value);
          const expectedValue = utils.getFormattedPrice(product.price * product.quantity);
          assert.ok(result.value.indexOf(expectedValue) !== -1, `Le prix pour le produit '${product.name
          }' doit être ${expectedValue}$.`);
        });
      });
    });
  });
  client.assert.visible(
    config.elements.count,
    'Le nombre de produits dans le panier doit pas être visible.',
  );

  const quantity = productsList.reduce((sum, product) => sum + product.quantity, 0);
  client.assert.containsText(
    config.elements.count, quantity,
    `Le nombre de produits dans le panier doit être de '${quantity}'.`,
  );
}

/**
 * Validates the total amount.
 *
 * @param client        The client to use.
 * @param productsList  The products list to use.
 * @private
 */
function validateTotalAmount(client, productsList) {
  // Compute the expected amount and check is the total amount is valid.
  let expectedTotalAmount = productsList.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  expectedTotalAmount = utils.getFormattedPrice(expectedTotalAmount);
  client.verify.containsText(
    config.elements.totalAmount, expectedTotalAmount,
    `Le total doit être '${expectedTotalAmount}$'.`,
  );
}

module.exports = {
  before() {
    const MAX_COUNT = 3;
    const productsList = require('./data/products.json');
    const ranNums = utils.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

    expectedProducts = [];
    for (let i = 0; i < MAX_COUNT; ++i) {
      const id = ranNums[i];
      const product = productsList[id - 1];
      product.quantity = i + 1;
      expectedProducts.push(product);
    }

    // Sort the list in alphabetical order.
    expectedProducts = expectedProducts.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  },
  'Aucun produit dans le panier': function (client) {
    client.url(`http://localhost:8000/${config.url}`)
      .waitForUpdate();

    validateEmptyShoppingCartView(client);
  },
  'Un ou plusieurs produits dans le panier': function (client) {
    const productConfig = require('./data/config.json').product;

    // Add some products into the cart.
    expectedProducts.forEach((product) => {
      client.url(`http://localhost:8000/${productConfig.url}${product.id}`)
        .waitForUpdate()
        .clearValue(productConfig.elements.input)
        .setValue(productConfig.elements.input, product.quantity)
        .submitForm(productConfig.elements.form, () => {
          console.log(`Le produit '${product.name}' a été ajouté au panier.`);
        });
    });

    client.url(`http://localhost:8000/${config.url}`)
      .waitForUpdate();

    validateShoppingCartTable(client, expectedProducts);
    validateTotalAmount(client, expectedProducts);
  },
  "Suppression d'un item dans le panier": function (client) {
    function pressRemoveItemButton() {
      return client.click(config.elements.removeItemButton, () => {
        console.log('Le bouton de suppression pour le produit #1 a été cliqué...');
      });
    }
    // Press on "remove item" button and cancel the deletion.
    pressRemoveItemButton().dismissAlert(() => {
      console.log('La suppression a été annulée.');
      client.waitForUpdate();

      // Check if there is no change.
      validateShoppingCartTable(client, expectedProducts);
    });

    // Press on "remove item" button and accept the deletion.
    pressRemoveItemButton().acceptAlert(() => {
      console.log('La suppression a été confirmée.');
      expectedProducts.shift();

      // Check if the item was deleted.
      client.waitForUpdate();
      validateShoppingCartTable(client, expectedProducts);
      validateTotalAmount(client, expectedProducts);
    });
  },
  'Augmentation de la quantite associee a un item dans le panier': function (client) {
    client.click(config.elements.addQuantityButton, () => {
      console.log("Le bouton permettant d'augmenter la quantité pour le produit #1 a été cliqué...");
      expectedProducts[0].quantity += 1;
      client.waitForUpdate();
      validateShoppingCartTable(client, expectedProducts);
      validateTotalAmount(client, expectedProducts);
    });
  },
  'Diminution de la quantite associee a un item dans le panier': function (client) {
    client.click(config.elements.removeQuantityButton, () => {
      console.log('Le bouton permettant de diminuer la quantité pour le produit #1 a été cliqué...');
      expectedProducts[0].quantity -= 1;
      client.waitForUpdate();
      validateShoppingCartTable(client, expectedProducts);
      validateTotalAmount(client, expectedProducts);
    });
  },
  'Suppression de tous les produits dans le panier': function (client) {
    function pressRemoveAllItemsButton() {
      return client.click(config.elements.removeAllItemsButton, () => {
        console.log('Le bouton permettant de supprimer tous les produits du panier a été cliqué...');
      });
    }
    // Press on "remove all items" button and cancel the deletion.
    pressRemoveAllItemsButton().dismissAlert(() => {
      console.log('La suppression a été annulée.');
      client.waitForUpdate();
      validateShoppingCartTable(client, expectedProducts);
    });

    // Press on "remove all items" button and accept the deletion.
    pressRemoveAllItemsButton().acceptAlert(() => {
      console.log('La suppression a été acceptée.');
      client.waitForUpdate();
      validateEmptyShoppingCartView(client);
    });
    client.end();
  },
};
