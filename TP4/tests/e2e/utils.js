"use strict";

var self = {};

/**
 * Gets the formatted price.
 *
 * @param price       The price to format.
 * @returns {string}  The price formatted.
 */
self.getFormattedPrice = function(price) {
  return price.toFixed(2).replace(".", ",");
};

/**
 * Gets a random integer between the min and the max.
 *
 * @param min   The min integer.
 * @param max   The max integer.
 * @returns {*} The random integer generated.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
self.getRandomIntInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
};

/**
 * Strips the HTML tags from the specified HTML code.
 *
 * @param html        The HTML code to use.
 * @returns {string}  The code without the tags (plain text).
 *
 * @see https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
 */
self.stripHTMLTags = function(html) {
  return html.replace(/<(?:.|\n)*?>/gm, "");
};


/**
 * Shuffles the specified array.
 *
 * @param array   The array to shuffle.
 * @returns {*}   The array shuffled.
 *
 * @see https://stackoverflow.com/questions/18806210/generating-non-repeating-random-numbers-in-js
 */
self.shuffle = function(array) {
  var i = array.length;
  var j = 0;
  var temp;

  while (i--) {
    j = Math.floor(Math.random() * (i+1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;

  }
  return array;
};

module.exports = self;
