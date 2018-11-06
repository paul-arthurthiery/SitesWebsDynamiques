var onlineShop = onlineShop || {};

/**
 * Controls the "confirmation" view.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
(($, ordersService, utils) => {
  "use strict";

  const order = ordersService.getOrder(ordersService.getOrdersCount());
  $("#name").text(order.firstName + " " + order.lastName);
  $("#confirmation-number").text(utils.pad(order.id, 5));

})(jQuery, onlineShop.ordersService, onlineShop.utils);
