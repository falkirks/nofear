#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Unofficial CLI/crawler for SparkNotes: No Fear Shakespeare


## Install

```sh
$ npm install --save nofear
```


## CLI usage
```sh
$ nofear "To be or not to be" # Searches all plays
$ nofear "To be or not to be" --play="Hamlet" # Searches Hamlet
$ nofear "To be or not to be" --play=Hamlet --act=3 # Searches ACT 3 of Hamlet
$ nofear "To be or not to be" --play=Hamlet --act=3 --scene=1 # Searches ACT 3, Scene 1
```

## Library usage
```js
var NoFear = require('nofear');
var nofear = new NoFear(); // You can pass options if you want
```

## Install CLI

```sh
$ npm i -g nofear
$ nofear --help
```

## License

MIT © [Falkirks](falkirks.com)


[npm-image]: https://badge.fury.io/js/nofear.svg
[npm-url]: https://npmjs.org/package/nofear
[travis-image]: https://travis-ci.org/Falkirks/nofear.svg?branch=master
[travis-url]: https://travis-ci.org/Falkirks/nofear
[daviddm-image]: https://david-dm.org/Falkirks/nofear.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Falkirks/nofear
