# Filters

This will act as our filtering engine. We will pass in filters, Then call apply(). An ajax (No this doesn't use jQuery) request will be sent in the form of URL parameters, the response will be returned to the gobal scope.

## Installation

```bash
npm i @meteora-digital/filters
yarn add @meteora-digital/filters
```

## Usage

```html
<select name="colours" id="colours" class="[ js-filter--select ]" data-parameter="colours">
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
  myFilter.add({
    parameter: select.getAttribute('data-parameter'),
    value: select.value,
  });
});
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| api | string | This is the URL that will be used in the ajax call | 
| success | function | The function you want to run once the data has been received |

## Methods

```set```

This will remove any current values in this parameter and set it to a specific value in the filters object.

```javascript
myFilter.set({
  parameter: 'colour',
  value: 'purple',
});
```

```add```

Add more values to the filters object

```javascript
myFilter.add({
  parameter: 'colour',
  value: 'purple',
});
```

```remove```

Remove data from the filters object

```javascript
myFilter.remove({
  parameter: 'colour',
  value: 'purple',
});
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

