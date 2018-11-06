var onlineShop = onlineShop || {};

/**
 * Defines a service to retrieve the products.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.productsService = ($ => {
  "use strict";

  const self = {};

  /**
   * Gets all the products.
   *
   * @param [sortingCriteria]   The sorting criteria to use. If no value is specified, the list returned isn't sorted.
   * @param [category]          The category of the product. The default value is "all".
   * @returns {jquery.promise}  A promise that contains the products list.
   */
  self.getProducts = (sortingCriteria, category) => {
    let url = "/api/products?criteria=" + sortingCriteria;
    if (category && category !== "all") {
      url += "&category=" + category
    }
    return $.get(url).then(products => products);
  };

  /**
   * Gets the product associated with the product ID specified.
   *
   * @param productId           The product ID associated with the product to retrieve.
   * @returns {jquery.promise}  A promise that contains the product associated with the ID specified.
   */
  self.getProduct = productId => {
    return $.get("/api/products/" + productId).then(product => product, () => null);
  };

  return self;
})(jQuery);
