SEO.js for Node.js
==================

Welcome to [SEO.js](http://getseojs.com/) for Node.js! SEO.js makes your BackboneJS, AngularJS or EmberJS apps crawlable by Google to make them appear in search results. Integrating it to your Node.js (read: Express.js) application is easy.

## Installation

To get started with seojs install the ```express-seojs``` package:

```sh
$ npm install express-seojs --save
```

Next you need an **API token**. To get it sign up at http://getseojs.com/. While you're there add your site in the dashboard so the snapshots can already be prepared.

In your Node.js app you need to include the SEO.js middleware in the initialization section:

```js
var seojs = require('express-seojs');
app.use(seojs('your_secret_api_token'));
```

After this your ```app.js``` probably looks something like this:

```js
...
var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));

var seojs = require('express-seojs');
app.use(seojs('your_secret_api_token'));

app.use(express.bodyParser());
app.use(express.methodOverride());
...
```

That's it! Requests to your app containing the *\_escaped_fragment\_* query parameter will now be forwarded to the SEO.js CDN where HTML snapshots of your pages are kept. To tell search engines to look for these snapshots you need to add the fragment meta tag to the head section of your views (maybe at ```views/index.ejs``` if you're using ejs as the view engine):

``` html
<head>
  <meta name="fragment" content="!">
  ...
</head>
```

This method works both with **HTML5 pushState URLs** as well as **Hashbang URLs** (/some/action#!route)

## Contributing to express-seojs
 
* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet.
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it.
* Fork the project.
* Start a feature/bugfix branch.
* Commit and push until you are happy with your contribution.

## License

The MIT License (MIT)

Copyright (c) 2013 SEO.js. http://getseojs.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
