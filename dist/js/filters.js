"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _meteora = require("meteora");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*------------------------------------------------------------------
Filters
------------------------------------------------------------------*/
var Filters = /*#__PURE__*/function () {
  function Filters() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Filters);

    // This will be used for out URL creation
    this.api = {}; // Where we will store the filter parameters

    this.value = {}; // Our user settings

    this.settings = {
      api: '/',
      // The success function will be added in the global scope. It returns the ajax response
      success: function success(response) {
        return console.log(response);
      }
    }; // ObjectAssign all the user's options

    for (var key in this.settings) {
      // Just check if the key exists in the user's options and if it does override the defaults
      if (this.settings.hasOwnProperty(key) && options.hasOwnProperty(key)) this.settings[key] = options[key];
    }
  }

  _createClass(Filters, [{
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
      }
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
      }
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
        } else if (this.value[parameter]) {
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
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      // Clear all filters
      this.value = {};
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
      } // Start the filter function


      return new Promise(function (resolve, reject) {
        (0, _meteora.ajax)({
          url: _this2.api.url,
          method: 'GET',
          error: function error(response) {
            return reject(response);
          },
          success: function success(response) {
            _this2.settings.success(response);

            resolve(response);
          }
        });
      });
    }
  }, {
    key: "updateURL",
    value: function updateURL(url) {
      window.history.replaceState({}, "filters", url || this.api.segmentURL);
    }
  }]);

  return Filters;
}();

exports["default"] = Filters;