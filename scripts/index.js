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

export default class FiltersController {
  constructor(api = '/', headers = {}) {
    // This will be used for out URL creation
    this.api = {};
    // Where we will store the filter parameters
    this.value = {};
    // Store the events here
    this.events = {};
    // Our user settings
    this.settings = { api };

    // Create a worker
    this.worker = null;

    // Store our scripts for the workers
    this.scripts = {
      xhr: `
        self.onmessage = function (event) {
          const xhr = new XMLHttpRequest();
          const { url, headers } = event.data;

          xhr.open('GET', url, true);

          Object.keys(headers).forEach((key) => {
            xhr.setRequestHeader(key, headers[key]);
          });

          xhr.onload = function () {
            if (xhr.status === 200) {
              self.postMessage({ status: 200, response: xhr.response });
            } else {
              self.postMessage({ status: xhr.status });
            }
          };

          xhr.send();
        };
      `,
    }

    this.headers = Object.assign({
      'x-requested-with': 'XMLHttpRequest',
    }, headers);
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

    // Trigger the change method
    this.change();

    // Call the set callback
    this.callback('set', this.value);
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

    // Trigger the change method
    this.change();

    // Call the add callback
    this.callback('add', this.value);
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

      else if (this.value[parameter] && value == null) {
        // Remove the parameter
        delete this.value[parameter];
      }
    }

    else if (Array.isArray(parameter)) {
      for (let index = 0; index < parameter.length; index++) {
        delete this.value[parameter[index]];
      }
    }

    else {
      try {
        for (let key in parameter) {
          if (parameter.hasOwnProperty(key)) this.remove(key, parameter[key]);
        }
      } catch (err) { console.log(err) }
    }

    // Trigger the change method
    this.change();

    // Call the remove callback
    this.callback('remove', this.value);
  }

  clear() {
    // Clear all filters
    this.value = {};

    // Trigger the change method
    this.change();

    // Call the clear callback
    this.callback('clear', this.value);
  }

  change() {
    this.callback('change', this.value);
  }

  getApiUrl() {
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
  }

  apply() {
    // Create the URL
    this.getApiUrl();

    // Abort the previous request
    if (this.worker) this.worker.terminate();

    // Create a new Blob object using the worker's code
    const blob = new Blob([this.scripts.xhr], { type: 'application/javascript' });
    // Create a new URL object from the Blob
    const script = URL.createObjectURL(blob);

    // Create a new worker
    this.worker = new Worker(script);

    // Post the message to the worker
    this.worker.postMessage({ url: this.api.url, headers: this.headers });

    // On success
    this.worker.onmessage = (event) => {
      if (event.data.status === 200) {
        // handle success
        this.success(event.data.response);
      } else {
        // handle error
        this.error(event.data.status);
      }
    };

    this.callback('apply', {
      url: this.api.url,
      segmentURL: this.api.segmentURL
    });
  }

  updateURL(url) {
    // Create the URL
    this.getApiUrl();

    window.history.replaceState({}, "filters", url || this.api.segmentURL);
    this.callback('updateURL');
  }

  success(response) {
    this.callback('success', response);
  }

  error(status) {
    this.callback('error', status);
  }

  callback(type, data = false) {
    // run the callback functions
    if (this.events[type]) this.events[type].forEach((event) => event(data));
  }

  on(event, func) {
    // If we loaded an event and it's not the on event and we also loaded a function
    if (event && event != 'on' && event != 'callback' && this[event] && func && typeof func == 'function') {
      if (this.events[event] == undefined) this.events[event] = [];
      // Push a new event to the event array
      this.events[event].push(func);
    }
  }
}
