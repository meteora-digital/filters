# Filters

A class to make ajax (no jquery) requests super easy

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
import Filters from '@meteora-digital/filters';

const myFilter = new Filter({
  success: (response) => {
    console.log(response);
  }
});

document.querySelector('.js-filter--select').addEventListener('change', () => {
  myFilter.set(select.name, select.value);
});
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| api | string | This is the URL that will be used in the ajax call | 
| success | function | The function you want to run once the data has been received |

## Methods

First argument should either be an object or a string. The second argument will only be used if the first argument is a string.
The second argument can either be a string or an array of strings.

```set```

This will remove any current values in this parameter and set it to a specific value in the value object.

```javascript
myFilter.set({
  colour: ['purple', 'red', 'blue'],
});

myFilter.set('colour', ['purple', 'red', 'blue']);
```

```add```

Add more values to the filters object

```javascript
myFilter.add({
  colour: 'green',
});

myFilter.add('colour', 'green');
```

```remove```

Remove data from the filters object

```javascript
myFilter.add({
  colour: 'red',
});

myFilter.add('colour', 'red');
```

```clear```

Remove all data from the filters object

```javascript
myFilter.clear();
```

```updateURL```

Replace the history state and update the URL to a string

```javascript
myFilter.updateURL(myFilter.api.segmentURL);
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

