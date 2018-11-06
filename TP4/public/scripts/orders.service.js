var onlineShop = onlineShop || {};

/**
 * Defines a service to manage the orders.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.ordersService = ($ => {
  "use strict";

  const self = {};

  /**
   * Creates a new order.
   *
   * @param order   The order to create.
   * @returns {jquery.promise}  A promise.
   */
  self.createOrder = order => {
    return self.getOrders().then(orders => {
      order.id = orders.length + 1;
      return $.ajax({
        url: "/api/orders",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(order)
      });
    });
  };

  /**
   * Gets all the orders.
   *
   * @returns {jquery.promise}  A promise that contains an array of orders.
   */
  self.getOrders = () => $.get("/api/orders");

  return self;
})(jQuery);
