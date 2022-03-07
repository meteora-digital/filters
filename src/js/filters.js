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
    this.value = {};

    // Our user settings
    this.settings = {
      api: '/',
      // The success function will be added in the global scope. It returns the ajax response
      success: (response) => console.log(response),
    };

    // ObjectAssign all the user's options
    for (let key in this.settings) {
      // Just check if the key exists in the user's options and if it does override the defaults
      if (this.settings.hasOwnProperty(key) && options.hasOwnProperty(key)) this.settings[key] = options[key];
    }
  }

  set(parameter = {}, value = null) {
    if (typeof parameter === 'string' || typeof parameter === 'number') {
      // Reset the value of the parameter
      this.value[parameter] = [];
      this.add(parameter, value);
    } else {
      for (let key in parameter) {
        if (parameter.hasOwnProperty(key)) this.set(key, parameter[key]);
      }
    }
  }

  add(parameter = {}, value = null) {
    if (typeof parameter === 'string' || typeof parameter === 'number') {
      // If we dont have this parameter yet, create it as an array
      if (this.value[parameter] == undefined) this.value[parameter] = [];
        
      if (Array.isArray(value)) {
        value.forEach((value) => {
          // If the filter parameter value does not contain this value, then add it
          if (this.value[parameter].indexOf(value) == -1) this.value[parameter].push(value);
        });
      } else {
        // If the parameter value is not an array
        // Simply push the value to the filter
        if (this.value[parameter].indexOf(value) == -1) this.value[parameter].push(value);
      }
    } else {
      for (let key in parameter) {
        if (parameter.hasOwnProperty(key)) this.add(key, parameter[key]);
      }
    }
  }

  remove(parameter = {}, value = null) {
    if (typeof parameter === 'string' || typeof parameter === 'number') {
      if (this.value[parameter] && Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
          console.log(value[index]);
          this.remove(parameter, value[index]);
        }
      }

      else if (this.value[parameter] && this.value[parameter].indexOf(value) >= 0) {
        // Remove this value from the parameter array
        this.value[parameter].splice(this.value[parameter].indexOf(value), 1);

        // If the parameter array is empty, delete it
        if (this.value[parameter].length === 0) delete this.value[parameter];
      }

      else if (this.value[parameter]) {
        // Remove the parameter
        delete this.value[parameter];
      }
    }

    else {
      for (let key in parameter) {
        if (parameter.hasOwnProperty(key)) this.remove(key, parameter[key]);
      }
    }
  }

  clear() {
    // Clear all filters
    this.value = {};
  }

  apply() {
    // Start the filter function
    return new Promise((resolve, reject) => {
      ajax({
        url: this.updateAPI().url,
        method: 'GET',
        error: (response) => reject(response),
        success: (response) => {
          this.settings.success(response);
          resolve(response);
        },
      });
    })
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
    for (let key in this.value) {
      // Determine which prefix to use
      this.api.prefix = (this.api.index === 0) ? '?' : '&';

      // If we have a value for a given parameter
      if (this.value[key].length) {
        // Create an api URL
        this.api.url += `${this.api.prefix + key}=${this.value[key].join(',')}`;
        // Create a prettier URL
        this.api.segmentURL += `${this.api.prefix + key}=${this.value[key].join(',')}`;
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