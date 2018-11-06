var onlineShop = onlineShop || {};

/**
 * Provides some useful functions.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.utils = {

  /**
   * Gets the value of the URL parameter associated with the specified name.
   *
   * @param name          The name of the parameter to retrieve.
   * @returns {*|number}  The value of the parameter.
   * @see https://www.sitepoint.com/url-parameters-jquery/
   */
  getUrlParameter: name => {
    const results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);
    return results[1] || 0;
  },

  /**
   * Formats the specified number as a price.
   *
   * @param price         The price to format.
   * @returns {string}    The price formatted.
   */
  formatPrice: price => price.toFixed(2).replace(".", ",") + "&thinsp;$",

  /**
   * Pads a number with zeros or a specified symbol.
   *
   * @param number      The number to format.
   * @param width       The total width of the formatted number.
   * @param symbol      The padding symbol to use. By default, the symbol is '0'.
   * @returns {*}       The formatted number.
   * @see https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
   */
  pad: (number, width, symbol) => {
    symbol = symbol || '0';
    number = number + '';
    return number.length >= width ? number : new Array(width - number.length + 1).join(symbol) + number;
  }
};
