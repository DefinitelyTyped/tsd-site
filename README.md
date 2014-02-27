# tsd-site

[![Build Status](https://secure.travis-ci.org/DefinitelyTyped/tsd-site.png?branch=master)](http://travis-ci.org/DefinitelyTyped/tsd-site)

> Source for [www.tsdpm.com](http://www.tsdpm.com/)

Currently the output of this lives on [definitelytyped.github.io/tsd](http://definitelytyped.github.io/tsd), as the `gh-pages` of [TSD](https://github.com/DefinitelyTyped/tsd) itself. 

## Build

Make sure you have dependencies:

````bash
$ npm install
$ bower install
````

Rebuild site in `./public/`:

````bash
$ grunt build
````

Manually build / update data JSON (slow, only do this when needed)

````bash
$ grunt update
````

## Contributing

Contributions are very welcome, please create an Issue before doing something major.

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
