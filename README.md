observe-deep
=============

Object.deepObserve method for robust observing of the whole object tree, not just own properties on the observed object.
Uses ES6 Object.observe. Works anywhere where [Object.observe is](http://caniuse.com/#feat=object-observe).

## Install
Just run:
`npm install observe-deep`
`jspm install npm:observe-deep`

## Utility
Why? Because we can! Also I believe this little observation helper can save you a lot of troubles when you use MVVM. Observing, you can be sure your views are rendered whenever anything changes in your model.
So could this be used instead of Flux for example? Or instead of dirty checking for Angular 1.x.x? I believe it could, I will try to prove that claim soon.

## TODO
Try using observe-js, so that we can support other browsers as well.