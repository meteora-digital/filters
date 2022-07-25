# Filters

A class to make ajax (no jquery) requests super easy

#### Note: version 2.0.0 includes breaking changes since the previous version 1.0.0
#### Note: version 1.0.0 includes breaking changes since the previous beta version 0.1.1

## Installation

```bash
npm i @meteora-digital/filters
yarn add @meteora-digital/filters
```

## Usage

```html
<select name="colours" id="colours">
    <option value="red">red</option>
    <option value="blue">blue</option>
    <option value="green">green</option>
    <option value="purple">purple</option>
    <option value="yellow">yellow</option>
</select>
```

```es6
import FiltersController from '@meteora-digital/filters';

const Filter = new FiltersController('/my/endpoint');
const select = document.querySelector('select');

Filter.on('success', (response) => {
  // do something with the response
})

select.addEventListener('change', () => {
  Filter.set(select.name, select.value);
  Filter.apply();
});
```

## Arguments

| Argument | Type | Description |
|--------|------|-------------|
| api | string | This is the URL that will be used in the ajax call |

## Methods

First argument should either be an object or a string. The second argument will only be used if the first argument is a string.
The second argument can either be a string or an array of strings.

```set()```

This will remove any current values in this parameter and set it to a specific value in the value object.

```javascript
Filter.set({
  colour: ['purple', 'red', 'blue'],
});

Filter.set('colour', ['purple', 'red', 'blue']);
```

```add()```

Add more values to the filters object

```javascript
Filter.add({
  colour: 'green',
});

Filter.add('colour', 'green');
```

```remove()```

Remove data from the filters object

```javascript
Filter.add({
  colour: 'red',
});

Filter.add('colour', 'red');
```

```clear()```

Remove all data from the filters object

```javascript
Filter.clear();
```

```apply()```

Make the XHR Request to load new content

```javascript
Filter.updateURL(Filter.api.segmentURL);
```

```updateURL()```

Replace the history state and update the URL to a string

```javascript
Filter.updateURL(Filter.api.segmentURL);
```

## Events

Each method has it's own event that is fired when the method is called. These can be accessed using the on() method

```on()```

```javascript
Filter.on('success', (response) => {
  // do something with the response
});
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

