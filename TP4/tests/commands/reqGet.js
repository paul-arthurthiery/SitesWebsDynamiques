var util = require("util");
var events = require("events");

function ReqGet() {
  events.EventEmitter.call(this);
}

util.inherits(ReqGet, events.EventEmitter);

/**
 * Execute a GET request in the browser.
 *
 * @param url         The URL to use.
 * @param [callback]  The callback to use. The callback must have two parameters:
 *                    - err: indicates if there is an error (TRUE/FALSE);
 *                    - value: the response text value.
 * @return {this}     The current context.
 */

ReqGet.prototype.command = function(url, callback) {
  var self = this;
  this.api.timeoutsAsyncScript(10000)
    .executeAsync(function(url, done) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
          done(JSON.parse(xmlHttp.responseText));
      };
      xmlHttp.open("GET", url, true); // true for asynchronous
      xmlHttp.send();
    }, [url], function(result) {
      if (result.status === 0 && callback) {
        callback.call(self, false, result.value);
      } else {
        callback.call(self, true, null);
      }
      self.emit("complete");
    });
  return this;
};

module.exports = ReqGet;
