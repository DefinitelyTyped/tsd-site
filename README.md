# tsd-site

[![Build Status](https://secure.travis-ci.org/DefinitelyTyped/tsd-site.png?branch=master)](http://travis-ci.org/DefinitelyTyped/tsd-site)

> Source for [www.tsdpm.com](http://www.tsdpm.com/)

:construction: Updating after [tsd](https://github.com/DefinitelyTyped/tsd) `~v0.5.x`

Currently the output of this lives as the `gh-pages` of [tsd](https://github.com/DefinitelyTyped/tsd), on [tsd](http://definitelytyped.github.io/tsd)

## Build

Make sure you have dependencies:

````bash
$ npm install
$ bower install
````

Rebuild site in `./public/`:

````bash
$ grunt build
````.

Manually build / update data JSON (slow, only do this when needed_

````bash
$ grunt update
````


## Contributing

Contributions are very welcome, please create an Issue before doing something major.

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
