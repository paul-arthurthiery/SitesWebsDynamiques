var onlineShop = onlineShop || {};

/**
 * Controls the "products" view.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
(($, productsService, utils) => {
  "use strict";

  const filters = {
    category: "all",
    sortingCriteria: "price-asc"
  };

  /**
   * Updates the product view.
   *
   * @param products    The products list to render.
   * @private
   */
  function _updateView(products) {
    const productsElement = $(".products");
    productsElement.html("");
    products.forEach(product => productsElement.append(_createProductElement(product)));

    $("#products-count").text(products.length + " produit" +
      (products.length > 1 ? "s" : ""));

    const categoriesElement = $("#product-categories");
    categoriesElement.children().removeClass("selected");
    categoriesElement.find("[data-category=" + filters.category + "]").addClass("selected");

    const criteriaElement = $("#product-criteria");
    criteriaElement.children().removeClass("selected");
    criteriaElement.find("[data-criteria=" + filters.sortingCriteria + "]").addClass("selected");
  }

  /**
   * Creates a product element.
   *
   * @param product                   The product to use.
   * @returns {jQuery|promise}        A jQuery element.
   * @private
   */
  function _createProductElement(product) {
    return $(`<div class="product" data-product-id="${product.id}">
      <a href="./produits/${product.id}" title="En savoir plus...">
      <h2>${product.name}</h2>
      <img alt="product" src="./assets/img/${product.image}">
      <p class="price"><small>Prix</small> ${utils.formatPrice(product.price)}</p>
      </a>
      </div>`);
  }

  // Initialize the products view.
  $("#product-categories").children().click(e => {
    filters.category = $(e.target).attr("data-category");
    productsService.getProducts(filters.sortingCriteria, filters.category).done(_updateView);
  });
  $("#product-criteria").children().click(e => {
    filters.sortingCriteria = $(e.target).attr("data-criteria");
    productsService.getProducts(filters.sortingCriteria, filters.category).done(_updateView);
  });

})(jQuery, onlineShop.productsService, onlineShop.utils);
