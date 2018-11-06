var util = require("util");
var events = require("events");

function ReqDelete() {
  events.EventEmitter.call(this);
}

util.inherits(ReqDelete, events.EventEmitter);

/**
 * Execute a DELETE request in the browser.
 *
 * @param url         The URL to use.
 * @param [callback]  The callback to use. The callback must have one parameter:
 *                    - err: indicates if there is an error (TRUE/FALSE);
 * @return {this}     The current context.
 */

ReqDelete.prototype.command = function(url, callback) {
  var self = this;
  this.api.timeoutsAsyncScript(10000)
    .executeAsync(function(url, done) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200 || xmlHttp.status === 204)
          done();
      };
      xmlHttp.open("DELETE", url, true); // true for asynchronous
      xmlHttp.send();
    }, [url], function(result) {
      if (result.status === 0 && callback) {
        callback.call(self, false);
      } else {
        callback.call(self, true);
      }
      self.emit("complete");
    });
  return this;
};

module.exports = ReqDelete;
