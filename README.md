## dominantcolors.js

![npm-image](http://img.shields.io/npm/v/dominantcolors.js.svg)
![downloads-image](http://img.shields.io/npm/dw/dominantcolors.js.svg)
![downloads-image](http://img.shields.io/npm/dm/dominantcolors.js.svg)
![downloads-image](http://img.shields.io/npm/dy/dominantcolors.js.svg)
![downloads-image](http://img.shields.io/npm/dt/dominantcolors.js.svg)

> Extract dominant colors from image. [source code](https://github.com/hunnble/dominantcolors.js)

### how to use

```sh
yarn add dominantcolors.js
```

```javascript
dominantcolors("./example.jpg", {
  colorCount: 4
})
  .then(result => {
    // result is an array of colors
    // eg: ['#4B2A29', '#180C0C', '#582929', '#160808']
  })
  .catch(error => {
    // handle the error
  });
```
