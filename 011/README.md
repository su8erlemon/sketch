# budo-gulp-starter

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A "starter kit" with [budō](https://github.com/mattdesl/budo), SASS, and Gulp. The aim is rapid iteration and a tight feedback loop. Could be augmented with VueJS, React, or any frameworks that work in browserify.

[[demo]](http://mattdesl.github.io/budo-gulp-starter/app/)

Some highlights:

  - npm dependencies with browserify
  - SASS for CSS pre-processing
  - Babel for ES2015 transpiling
  - All the goodies of [budo](https://github.com/mattdesl/budo):
    - Fast incremental bundling with watchify
    - Pretty-printed HTTP logging
    - Syntax errors reported in the browser
    - LiveReload browser refresh on `bundle.js` update
    - LiveReload CSS injection on *.scss changes
  
Note that budō is not tied to Gulp, and in some cases it may be easier to use it's command-line version. 

## Usage

```sh
git clone https://github.com/mattdesl/budo-gulp-starter.git
cd budo-gulp-starter

# install dependencies
npm install

# start development server & open browser
npm run open

# or, just start dev server
npm start
```

This should run the watch server and open `localhost:9966` in your default browser. Changes to `src/index.js` will trigger a incremental bundle and page reload. Changes to `src/sass/main.scss` will cause CSS injection without losing application state. 

Syntax errors are overlayed in the browser with a custom style:

![img](http://i.imgur.com/dP7lH7N.png) 

## tasks

```
npm run
  start  - start dev server
  open   - start dev server and open the browser to localhost
  build  - the compressed production build
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/budo-gulp-starter/blob/master/LICENSE.md) for details.
