var onlineShop = onlineShop || {};

/**
 * Defines a service to manage the orders.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.ordersService = (() => {
  "use strict";

  const self = {};
  let orders = [];

  /**
   * Creates a new order.
   *
   * @param order   The order to create.
   */
  self.createOrder = order => {
    if (order) {
      order.id = orders.length + 1;
      orders.push(order);
      _updateLocalStorage();
    }
  };

  /**
   * Gets the order based on the specified ID.
   *
   * @param orderId   The ID of the order.
   * @returns {*}     The order associated with the specified ID.
   */
  self.getOrder = orderId => {
    if (orderId <= 0 || orderId > orders.length) {
      throw new Error("Invalid order ID specified.")
    }
    return orders[orderId - 1];
  };

  /**
   * Gets the orders count.
   *
   * @returns {Number}  The orders count.
   */
  self.getOrdersCount = () => {
    return orders.length;
  };

  /**
   * Updates the orders list in the local storage.
   *
   * @private
   */
  function _updateLocalStorage() {
    localStorage["orders"] = JSON.stringify(orders);
  }

  // Initializes the orders list.
  if (localStorage["orders"]) {
    orders = JSON.parse(localStorage["orders"]);
  }

  return self;
})();
