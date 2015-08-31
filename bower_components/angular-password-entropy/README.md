# angular-password-entropy
AngularJS directive to create an entropy bar meter for a password field

## Install

```
bower install pernas/angular-password-entropy
```

## Update

```
bower update angular-password-entropy
```

## Usage

- Include the module dependency:

```javascript
    angular.module('myApp', ['passwordEntropy'])
```

- The element `<password-entropy>` prints the entropy bar.
- The bar options (color, steps) can be defined or ignored and use the default settings. The password entropy must be in the range [0..100].
- The minimum entropy validation can be set as `min-entropy="50"`.


```html
<form role="form" name="testform" ng-submit="controller.mysubmit()">
    <div class="form-group">
      <label for="pwd">Password: </label>
      <input id="pwd"
             name="passwordInput"
             class="form-control"
             type="text"
             ng-model="controller.pwd"
             min-entropy="50"
             required ></input>
      <password-entropy
        password="controller.pwd"
        options="controller.myOpt">
      </password-entropy>
    </div>
    <div class="form-group">
      <button type="submit"
              class="btn btn-default"
              ng-disabled="testform.$invalid">
              Say hello
      </button>
    </div>
</form>
```

```javascript
    .controller('controller', [
      function(){
        var self = this;
        self.pwd = "";
        self.mysubmit = function() {alert("Hola!!");};
        self.myOpt = {
                     '0': ['progress-bar-danger',  'very weak'],
                    '15': ['progress-bar-danger',  'weak'],
                    '35': ['progress-bar-warning',    'normal'],
                    '50': ['progress-bar-success', 'strong'],
                    '70': ['progress-bar-success', 'very strong']
        }; 
    }])
```


## Development

```
git clone repo
cd repo
npm install
grunt watch
```

## Test

You may need to install PhantomJS. On Mac Os X:

```
brew install phantomjs
```

To run test and monitor for changes
```
npm install
karma start
```