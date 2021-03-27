/*------------------------------------------------------------------
This will act as our filtering engine. We will pass in filters,
Then call apply(). an ajax request will be sent in the form of
URL parameters, the response will be returned to the gobal scope.
------------------------------------------------------------------*/

/*------------------------------------------------------------------
Import External Modules
------------------------------------------------------------------*/

import { ajax } from 'meteora';

/*------------------------------------------------------------------
Filters
------------------------------------------------------------------*/

export default class Filters {
  constructor(options = {}) {
    // This will be used for out URL creation
    this.api = {};
    // Where we will store the filter parameters
    this.filters = {};
    // Will be used to throttle our filter
    this.timeout = null;

    // Our user settings
    this.settings = {
      api: '/',
      // The success function will be added in the global scope. It returns the ajax response
      success: (response) => console.log(response),
    };

    // ObjectAssign all the user's options
    for (let key in this.settings) {
      // Just check if the key exists in the user's options and if it does override the defaults
      if (options[key] != undefined) this.settings[key] = options[key];
    }
  }

  add(data = {}) {
    // If we dont have this parameter yet, create it as an array
    if (this.filters[data.parameter] == undefined) this.filters[data.parameter] = [];

    // If our value is an array
    if (Array.isArray(data.value)) {
      // Loop the value array
      data.value.forEach((value) => {
        // If the filter parameter value does not contain this value, then add it
        if (this.filters[data.parameter].indexOf(value) == -1) this.filters[data.parameter].push(value);
      });
    }else {
      // If the parameter value is not an array
      // Simply push the value to the filter
      if (this.filters[data.parameter].indexOf(data.value) == -1) this.filters[data.parameter].push(data.value);
    }
  }

  remove(data = {}) {
    // If we dont have this parameter yet, exit the function, nothing else to do
    if (this.filters[data.parameter] == undefined) return;

    // If our value is an array
    if (Array.isArray(data.value)) {
      // Loop the value array
      data.value.forEach((value) => {
        // If the filter parameter value contains this value, then remove it
        if (this.filters[data.parameter].indexOf(value) >= 0) this.filters[data.parameter] = this.filters[data.parameter].filter((item) => item != value);
      });
    }else {
      // If the parameter value is not an array
      // Simply remove the value from the filter
      if (this.filters[data.parameter].indexOf(data.value) >= 0) this.filters[data.parameter] = this.filters[data.parameter].filter((item) => item != data.value);
    }

    // If there are no filter values left, delete the parameter
    if (this.filters[data.parameter].length === 0) delete this.filters[data.parameter];
  }

  clear() {
    // Loop all the filters and delete them
    for (let key in this.filters) delete this.filters[key];
  }

  apply() {
    // Stop the current filter
    clearTimeout(this.timeout);

    // Start the filter function
    this.timeout = setTimeout(() => {
      ajax({
        url: this.updateAPI().url,
        method: 'GET',
        success: (response) => this.settings.success(response),
      })
    }, 1000);
  }

  updateAPI() {
    // Used to begin the URL parameters
    this.api.prefix = '?';
    // Used to save our default api URL
    this.api.url = this.settings.api;
    // Used to determine if our prefix should be ? || &
    this.api.index = (this.settings.api.indexOf('?') >= 0) ? 1 : 0;
    // This will be a more pretty URL for frontend purposes
    this.api.segmentURL = window.location.origin + window.location.pathname;

    // Generate the URL based on the current filters
    for (let key in this.filters) {
      // Determine which prefix to use
      this.api.prefix = (this.api.index === 0) ? '?' : '&';

      // If we have a value for a given parameter
      if (this.filters[key].length) {
        // Create an api URL
        this.api.url += `${this.api.prefix + key}=${this.filters[key].join(',')}`;
        // Create a prettier URL
        this.api.segmentURL += `${this.api.prefix + key}=${this.filters[key].join(',')}`;
        // Add 1 to our index
        this.api.index += 1;
      };
    }

    // Return the API
    return this.api;
  }

  updateURL(url) {
    window.history.replaceState({}, "filters", url);
  }
}