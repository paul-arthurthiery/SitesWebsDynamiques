const assert = require('assert');
const config = require('./data/config.json').products;
const productConfig = require('./data/config.json').product;
const utils = require('./utils');

/**
 * Validates the products list.
 *
 * @param client                The client to use.
 * @param expectedProductsList  The expected products in the list.
 */
function validateProductsList(client, expectedProductsList) {
  const expectedProductsCountText = `${expectedProductsList.length} produit${
    (expectedProductsList.length > 1) ? 's' : ''}`;

  // Check if the products count displayed is correct.
  client.waitForText(config.elements.count, text => text.indexOf(expectedProductsCountText) !== -1, 2000, `L'indicateur du nombre de produits doit indiquer '${expectedProductsCountText}'.`);

  client.elements('css selector', `${config.elements.list} > *`, (result) => {
    let count = 0;

    // Check if the products count is correct.
    function checkProductsCount() {
      assert.equal(
        count, expectedProductsList.length,
        `La liste de produits doit compter un total de ${expectedProductsList.length} produits.`,
      );
    }

    // Iterates over all the products of the list.
    const products = result.value;
    products.forEach((v, i) => {
      client.elementIdDisplayed(v.ELEMENT, (result) => {
        if (!result.value) {
          if (i === products.length - 1) { // Checks the products count at the end.
            checkProductsCount();
          }
          return;
        }
        const index = count;
        ++count;


        // Retrieve the element text.
        client.elementIdText(v.ELEMENT, (result) => {
          // Check if the product name is correct.
          client.assert.ok(
            result.value.indexOf(expectedProductsList[index].name) !== -1,
            `Le produit #${count} doit être '${expectedProductsList[index].name}'.`,
          );

          // Check if the product price is correct.
          const price = utils.getFormattedPrice(expectedProductsList[index].price);
          assert(
            result.value.indexOf(price) !== -1,
            `Le prix pour le produit #${count} doit être '${price}$'.`,
          );
        });

        // Check if the product image is correct.
        client.elementIdElement(v.ELEMENT, 'css selector', 'img', (result) => {
          client.elementIdAttribute(result.value.ELEMENT, 'src', (result) => {
            assert(
              result.value.indexOf(expectedProductsList[index].image) !== -1,
              `L'image pour le produit #${count} doit être '${expectedProductsList[index].image}'.`,
            );
          });
        });

        // Check if the product link is correct.
        client.elementIdName(v.ELEMENT, (result) => {
          function validateLink(element) {
            client.elementIdAttribute(element, 'href', (result) => {
              const link = productConfig.url + expectedProductsList[index].id;
              assert(
                result.value.indexOf(link) !== -1,
                `Le lien pour le produit #${count} doit être '${link}'.`,
              );
            });
          }
          if (result.value.toLowerCase() === 'a') {
            validateLink(v.ELEMENT);
          } else {
            client.elementIdElement(v.ELEMENT, 'css selector', 'a', (result) => {
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
  client.assert.elementPresent(buttonGroupId, `Le groupe de boutons '${buttonGroupId}' est présent sur la page.`);

  client.elements('css selector', `${buttonGroupId} > button`, (result) => {
    client.assert.equal(
      result.value.length, expectedButtons.length,
      `Le groupe de boutons '${buttonGroupId}' doit compter ${expectedButtons.length} boutons.`,
    );

    // Iterates over the buttons.
    result.value.map((v, i) => {
      const name = expectedButtons[i].name;

      // Validate the text of the button.
      client.elementIdText(v.ELEMENT, (result) => {
        client.assert.equal(result.value, name, `Le nom du bouton #${i + 1} doit être '${name}'.`);
      });

      // Simulate a click on the button.
      client.elementIdClick(v.ELEMENT, () => {
        console.log(`\nLe bouton '${name}' est cliqué...`);
      }).waitForUpdate()
        .elementIdCssProperty(v.ELEMENT, 'selected', (result) => {
          client.assert.equal(result.state, 'success', `Le bouton '${name}' doit posséder la classe '.selected'.`);
        })
        .elements('css selector', `${buttonGroupId} > button:not(.selected)`, (result) => {
          const expectedCount = expectedButtons.length - 1;
          client.assert.equal(
            result.value.length, expectedCount,
            `Il doit y avoir ${expectedCount} boutons qui ne possède pas la classe '.selected'.`,
          );
        })
        .perform(() => {
          validateProductsList(client, require(`./data/${fileTemplate.replace('{{ID}}', expectedButtons[i].id)}`));
        });
    });
  });
}

let consoleLog;
module.exports = {
  before() {
    consoleLog = console.log;
  },
  'Page des produits': function (client) {
    console.log = function () {}; // Ignore the first log.
    client.url(`http://localhost:8000/${config.url}`)
      .perform(() => {
        console.log = consoleLog;
      })
      .assert.elementPresent(config.elements.list, 'La liste de produits est présente sur la page.')
      .waitForUpdate();
  },
  'Liste des produits pour les valeurs par defauts': function (client) {
    validateProductsList(client, require('./data/products-all-price-up.json'));
  },
  'Categories des produits': function (client) {
    const expectedCategories = [{
      id: 'cameras',
      name: 'Appareils photo',
    },
    {
      id: 'consoles',
      name: 'Consoles',
    },
    {
      id: 'screens',
      name: 'Écrans',
    },
    {
      id: 'computers',
      name: 'Ordinateurs',
    },
    {
      id: 'all',
      name: 'Tous les produits',
    },
    ];
    validateButtonsGroup(client, config.elements.categories, expectedCategories, 'products-{{ID}}-price-up.json');
  },
  'Classement des produits': function (client) {
    const expectedSortingCriteria = [{
      id: 'price-up',
      name: 'Prix (bas-haut)',
    },
    {
      id: 'price-down',
      name: 'Prix (haut-bas)',
    },
    {
      id: 'alpha-up',
      name: 'Nom (A-Z)',
    },
    {
      id: 'alpha-down',
      name: 'Nom (Z-A)',
    },
    ];
    validateButtonsGroup(client, config.elements.criteria, expectedSortingCriteria, 'products-all-{{ID}}.json');
    client.end();
  },
};
