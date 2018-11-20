/**
 * Wait until all the AJAX request are completed.
 *
 * @return {exports}
 */
module.exports.command = function() {
  this.pause(250);
  return this;
};
