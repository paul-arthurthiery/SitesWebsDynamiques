/**
 * Wait until all the AJAX request are completed.
 *
 * @return {exports}
 */
module.exports.command = function() {
  this.pause(150)
    .waitForJqueryAjaxRequest(10000, "Les requêtes AJAX sont complétées.")
    .pause(50);
  return this;
};
