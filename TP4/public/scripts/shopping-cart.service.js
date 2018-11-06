var onlineShop = onlineShop || {};

/**
 * Defines a service to manage the shopping cart.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.shoppingCartService = (($, productsService) => {
  "use strict";

  const self = {};
  let promise = undefined;

  /**
   * Adds an item in the shopping cart.
   *
   * @param productId   The ID associated with the product to add.
   * @param [quantity]  The quantity of the product.
   * @return            A promise.
   */
  self.addItem = (productId, quantity) => {
    return _getItemsFromAPI().then(items => {
      const itemFound = items.find(item => item.productId === productId);
      if (!itemFound) {
        promise = undefined;
        return $.ajax({
          url: "/api/shopping-cart",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({ productId: productId, quantity: quantity })
        });
      } else {
        return self.updateItemQuantity(productId, itemFound.quantity + quantity);
      }
    });
  };

  /**
   * Gets the items in the shopping cart.
   *
   * @returns {jquery.promise}    A promise that contains the list of items in the shopping cart.
   */
  self.getItems = () => {
    return $.when(productsService.getProducts("alpha-asc"), _getItemsFromAPI()).then((products, items) => {
      function getItemAssociatedWithProduct(productId) {
        return items.find(item => item.productId === productId);
      }
      return products.filter(product => getItemAssociatedWithProduct(product.id) !== undefined)
        .map(product => {
          const item = getItemAssociatedWithProduct(product.id);
          return {
            product: product,
            quantity: item.quantity,
            total: product.price * item.quantity
          };
        });
    });
  };

  /**
   * Gets the item associated with the specified product ID.
   *
   * @param productId             The product ID associated with the item to retrieve.
   * @return {jquery.promise}     A promise that contrains the item associated with the ID specified.
   */
  self.getItem = productId => {
    return self.getItems().then(items => {
      return items.find(item => item.product.id === productId)
    });
  };

  /**
   * Gets the items count in the shopping cart.
   *
   * @returns {jquery.promise}    A promise that contains the items count.
   */
  self.getItemsCount = () => {
    return _getItemsFromAPI().then(items => items.reduce((sum, item) => sum + +item.quantity, 0));
  };

  /**
   * Gets the quantity associated with an item.
   *
   * @param productId             The product ID associated with the item quantity to retrieve.
   * @returns {jquery.promise}    A promise that contains the quantity associated with the specified item.
   */
  self.getItemQuantity = productId => {
    return _getItemsFromAPI().then(items => {
      const itemFound = items.find(item => item.productId === productId);
      return (itemFound) ? itemFound.quantity : 0;
    });
  };

  /**
   * Gets the total amount of the products in the shopping cart.
   *
   * @returns {jquery.promise}    A promise that contains the total amount.
   */
  self.getTotalAmount = () => {
    return self.getItems().then(items => {
      let total = 0;
      items.forEach(item => {
        if (item) {
          total += item.total;
        }
      });
      return total;
    });
  };

  /**
   * Updates the quantity associated with a specified item.
   *
   * @param productId   The product ID associated with the item to update.
   * @param quantity    The item quantity.
   * @return            A promise.
   */
  self.updateItemQuantity = (productId, quantity) => {
    promise = undefined;
    return $.ajax({
      url: "/api/shopping-cart/" + productId,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ quantity: quantity })
    });
  };

  /**
   * Removes the specified item in the shopping cart.
   *
   * @param productId   The product ID associated with the item to remove.
   * @return            A promise.
   */
  self.removeItem = productId => {
    promise = undefined;
    return $.ajax({
      url: "/api/shopping-cart/" + productId,
      type: "DELETE"
    });
  };

  /**
   * Removes all the items in the shopping cart.
   *
   * @return  A promise.
   */
  self.removeAllItems = () => {
    promise = undefined;
    return $.ajax({
      url: "/api/shopping-cart/",
      type: "DELETE"
    });
  };

  /**
   * Gets the items in the shopping cart from the API.
   *
   * @return A promise that contains the items list.
   * @private
   */
  function _getItemsFromAPI() {
    if (!promise) {
      promise = $.get("/api/shopping-cart/").then(items => items);
    }
    return promise;
  }

  return self;
})(jQuery, onlineShop.productsService);
