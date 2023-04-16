"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* ---------------------------------------------
░░░░░░░ ░░ ░░   ░░░░░░░░ ░░░░░░░ ░░░░░░  ░░░░░░░
▒▒      ▒▒ ▒▒      ▒▒    ▒▒      ▒▒   ▒▒ ▒▒     
▒▒▒▒▒   ▒▒ ▒▒      ▒▒    ▒▒▒▒▒   ▒▒▒▒▒▒  ▒▒▒▒▒▒▒
▓▓      ▓▓ ▓▓      ▓▓    ▓▓      ▓▓   ▓▓      ▓▓
██      ██ ███████ ██    ███████ ██   ██ ███████

This will act as our filtering engine. We will 
pass in filters, then call apply(). an xhr 
request will be sent in the form of URL parameters,
the response will be returned and accessible via
the on('success', (response) => {}) method.

---------------------------------------------- */
var FiltersController = /*#__PURE__*/function () {
  function FiltersController() {
    var api = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

    _classCallCheck(this, FiltersController);

    // This will be used for out URL creation
    this.api = {}; // Where we will store the filter parameters

    this.value = {}; // Store the events here

    this.events = {}; // Our user settings

    this.settings = {
      api: api
    }; // Our xhr request

    this.xhr = new XMLHttpRequest();
  }

  _createClass(FiltersController, [{
    key: "set",
    value: function set() {
      var parameter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (typeof parameter === 'string' || typeof parameter === 'number') {
        // Reset the value of the parameter
        this.value[parameter] = [];
        this.add(parameter, value);
      } else {
        for (var key in parameter) {
          if (parameter.hasOwnProperty(key)) this.set(key, parameter[key]);
        }
      } // Trigger the change method


      this.change(); // Call the set callback

      this.callback('set', this.value);
    }
  }, {
    key: "add",
    value: function add() {
      var _this = this;

      var parameter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (typeof parameter === 'string' || typeof parameter === 'number') {
        // If we dont have this parameter yet, create it as an array
        if (this.value[parameter] == undefined) this.value[parameter] = [];

        if (Array.isArray(value)) {
          value.forEach(function (value) {
            // If the filter parameter value does not contain this value, then add it
            if (_this.value[parameter].indexOf(value) == -1) _this.value[parameter].push(value);
          });
        } else {
          // If the parameter value is not an array
          // Simply push the value to the filter
          if (this.value[parameter].indexOf(value) == -1) this.value[parameter].push(value);
        }
      } else {
        for (var key in parameter) {
          if (parameter.hasOwnProperty(key)) this.add(key, parameter[key]);
        }
      } // Trigger the change method


      this.change(); // Call the add callback

      this.callback('add', this.value);
    }
  }, {
    key: "remove",
    value: function remove() {
      var parameter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (typeof parameter === 'string' || typeof parameter === 'number') {
        if (this.value[parameter] && Array.isArray(value)) {
          for (var index = 0; index < value.length; index++) {
            console.log(value[index]);
            this.remove(parameter, value[index]);
          }
        } else if (this.value[parameter] && this.value[parameter].indexOf(value) >= 0) {
          // Remove this value from the parameter array
          this.value[parameter].splice(this.value[parameter].indexOf(value), 1); // If the parameter array is empty, delete it

          if (this.value[parameter].length === 0) delete this.value[parameter];
        } else if (this.value[parameter] && value == null) {
          // Remove the parameter
          delete this.value[parameter];
        }
      } else if (Array.isArray(parameter)) {
        for (var _index = 0; _index < parameter.length; _index++) {
          delete this.value[parameter[_index]];
        }
      } else {
        try {
          for (var key in parameter) {
            if (parameter.hasOwnProperty(key)) this.remove(key, parameter[key]);
          }
        } catch (err) {
          console.log(err);
        }
      } // Trigger the change method


      this.change(); // Call the remove callback

      this.callback('remove', this.value);
    }
  }, {
    key: "clear",
    value: function clear() {
      // Clear all filters
      this.value = {}; // Trigger the change method

      this.change(); // Call the clear callback

      this.callback('clear', this.value);
    }
  }, {
    key: "change",
    value: function change() {
      this.callback('change', this.value);
    }
  }, {
    key: "apply",
    value: function apply() {
      var _this2 = this;

      // Used to begin the URL parameters
      this.api.prefix = '?'; // Used to save our default api URL

      this.api.url = this.settings.api; // Used to determine if our prefix should be ? || &

      this.api.index = this.settings.api.indexOf('?') >= 0 ? 1 : 0; // This will be a more pretty URL for frontend purposes

      this.api.segmentURL = window.location.origin + window.location.pathname; // Generate the URL based on the current filters

      for (var key in this.value) {
        // Determine which prefix to use
        this.api.prefix = this.api.index === 0 ? '?' : '&'; // If we have a value for a given parameter

        if (this.value[key].length) {
          // Create an api URL
          this.api.url += "".concat(this.api.prefix + key, "=").concat(this.value[key].join(',')); // Create a prettier URL

          this.api.segmentURL += "".concat(this.api.prefix + key, "=").concat(this.value[key].join(',')); // Add 1 to our index

          this.api.index += 1;
        }

        ;
      } // Abort the previous request


      this.xhr.abort();
      this.xhr.open('GET', this.api.url, true); // On success

      this.xhr.onload = function () {
        if (_this2.xhr.status === 200) {
          _this2.success(_this2.xhr.responseText);
        } else {
          _this2.error(_this2.xhr.status);
        }
      }; // Send the request


      this.xhr.send();
      this.callback('apply', {
        url: this.api.url,
        segmentURL: this.api.segmentURL
      });
    }
  }, {
    key: "updateURL",
    value: function updateURL(url) {
      window.history.replaceState({}, "filters", url || this.api.segmentURL);
      this.callback('updateURL');
    }
  }, {
    key: "success",
    value: function success(response) {
      this.callback('success', response);
    }
  }, {
    key: "error",
    value: function error(status) {
      this.callback('error', status);
    }
  }, {
    key: "callback",
    value: function callback(type) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // run the callback functions
      if (this.events[type]) this.events[type].forEach(function (event) {
        return event(data);
      });
    }
  }, {
    key: "on",
    value: function on(event, func) {
      // If we loaded an event and it's not the on event and we also loaded a function
      if (event && event != 'on' && event != 'callback' && this[event] && func && typeof func == 'function') {
        if (this.events[event] == undefined) this.events[event] = []; // Push a new event to the event array

        this.events[event].push(func);
      }
    }
  }]);

  return FiltersController;
}();

exports["default"] = FiltersController;