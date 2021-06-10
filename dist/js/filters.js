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

    this.filters = {}; // Our user settings

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
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // Set / reset the parameter in the filters object
      this.filters[data.parameter] = []; // Call the add function to add the new data to the filters object

      this.add(data);
    }
  }, {
    key: "add",
    value: function add() {
      var _this = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // If we dont have this parameter yet, create it as an array
      if (this.filters[data.parameter] == undefined) this.filters[data.parameter] = []; // If our value is an array

      if (Array.isArray(data.value)) {
        // Loop the value array
        data.value.forEach(function (value) {
          // If the filter parameter value does not contain this value, then add it
          if (_this.filters[data.parameter].indexOf(value) == -1) _this.filters[data.parameter].push(value);
        });
      } else {
        // If the parameter value is not an array
        // Simply push the value to the filter
        if (this.filters[data.parameter].indexOf(data.value) == -1) this.filters[data.parameter].push(data.value);
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // If we dont have this parameter yet, exit the function, nothing else to do
      if (this.filters[data.parameter] == undefined) return; // If our value is an array

      if (Array.isArray(data.value)) {
        // Loop the value array
        data.value.forEach(function (value) {
          // If the filter parameter value contains this value, then remove it
          if (_this2.filters[data.parameter].indexOf(value) >= 0) _this2.filters[data.parameter] = _this2.filters[data.parameter].filter(function (item) {
            return item != value;
          });
        });
      } else {
        // If the parameter value is not an array
        // Simply remove the value from the filter
        if (this.filters[data.parameter].indexOf(data.value) >= 0) this.filters[data.parameter] = this.filters[data.parameter].filter(function (item) {
          return item != data.value;
        });
      } // If there are no filter values left, delete the parameter


      if (this.filters[data.parameter].length === 0) delete this.filters[data.parameter];
    }
  }, {
    key: "clear",
    value: function clear() {
      // Loop all the filters and delete them
      for (var key in this.filters) {
        delete this.filters[key];
      }
    }
  }, {
    key: "apply",
    value: function apply() {
      var _this3 = this;

      // Start the filter function
      return new Promise(function (resolve, reject) {
        (0, _meteora.ajax)({
          url: _this3.updateAPI().url,
          method: 'GET',
          error: function error(response) {
            return reject(response);
          },
          success: function success(response) {
            _this3.settings.success(response);

            resolve(response);
          }
        });
      });
    }
  }, {
    key: "updateAPI",
    value: function updateAPI() {
      // Used to begin the URL parameters
      this.api.prefix = '?'; // Used to save our default api URL

      this.api.url = this.settings.api; // Used to determine if our prefix should be ? || &

      this.api.index = this.settings.api.indexOf('?') >= 0 ? 1 : 0; // This will be a more pretty URL for frontend purposes

      this.api.segmentURL = window.location.origin + window.location.pathname; // Generate the URL based on the current filters

      for (var key in this.filters) {
        // Determine which prefix to use
        this.api.prefix = this.api.index === 0 ? '?' : '&'; // If we have a value for a given parameter

        if (this.filters[key].length) {
          // Create an api URL
          this.api.url += "".concat(this.api.prefix + key, "=").concat(this.filters[key].join(',')); // Create a prettier URL

          this.api.segmentURL += "".concat(this.api.prefix + key, "=").concat(this.filters[key].join(',')); // Add 1 to our index

          this.api.index += 1;
        }

        ;
      } // Return the API


      return this.api;
    }
  }, {
    key: "updateURL",
    value: function updateURL(url) {
      window.history.replaceState({}, "filters", url);
    }
  }]);

  return Filters;
}();

exports["default"] = Filters;