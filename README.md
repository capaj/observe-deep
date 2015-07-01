observe-deep
=============

A function for robust observing of the whole object tree, not just own properties on the observed object.
Uses ES6 Object.observe. Works anywhere where [Object.observe is](http://caniuse.com/#feat=object-observe) and [WeakMap](http://kangax.github.io/compat-table/es6/#WeakMap) is.

## Install
Just run:
`npm install observe-deep` or
`jspm install npm:observe-deep`

## Usage
Api is modelled similarly to [Object.observe](http://www.html5rocks.com/en/tutorials/es7/observe/), so:
```javascript
var observed = {a: {b: 1}, c:2};
function observer(changesTriggered) {
    console.log(changesTriggered);
}
var deliver = observeDeep(observed, observer);
//deliver can be used for synchronous delivery of changes on demand
```

## Utility
Why? Because we can! Also I believe this little observation helper can save you a lot of troubles when you use MVVM patter for your app. Observing, you can be sure your views are rendered whenever anything changes in your model.
So could this be used instead of Flux for example? Or instead of dirty checking for Angular 1.x.x? I believe it could, I will try to prove that claim soon.

## TODO
Try using observe-js, so that we can support other browsers as well.
