express = require("express")
compression = require('compression')
fs = require('fs')
https = require('https')
HttpStatus = require('http-status-codes');
querystring = require('querystring');
bodyParser = require('body-parser')
seojs = require('express-seojs')
app = express();
app.use(require('prerender-node'));

app.use(seojs('c5jtsphy5jarp3qbrd7vqe1pc'))

# app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({ 
  extended: true
})); 


bodyParser = require('body-parser')
auth = require('basic-auth')
path = require('path')
r = require('request');
fs = require('fs')

basic = undefined
app.use express.logger()
app.use( bodyParser.json() )

app.use(compression({
  threshold: 512
}))

env = require('node-env-file')
try
  env(__dirname + '/.env');
catch e
  console.log("You may optionally create a .env file to configure the server.");

port = process.env.PORT or 8443

dist = process.env.DIST? && parseInt(process.env.DIST)
dist = 1

# Configuration
app.configure ->
  app.use (req, res, next) ->
    if req.url == "/"
      res.setHeader "content-security-policy", "img-src 'self' data:; style-src 'self' 'unsafe-inline'; frame-src 'self' https://*.youtube.com; script-src 'self' 'unsafe-inline'; connect-src 'self' *.ethereumwallet.org *.ethereumwallet.org wss://*.ethereumwallet.org https://ethereumwallet.org; object-src 'none'; media-src 'self' data: mediastream:; font-src 'self'"
      res.setHeader "X-Frame-Options", "SAMEORIGIN"
    if req.url.indexOf("beta_key")
      # Don't cache these
      res.setHeader('Cache-Control', 'public, max-age=0, no-cache');
    else if dist
      res.setHeader('Cache-Control', 'public, max-age=31557600');
    else
      res.setHeader('Cache-Control', 'public, max-age=31557600');
    next()

  app.use app.router
  app.engine "html", require("ejs").renderFile

  if dist
    console.log("Production mode: single javascript file, cached");
    app.set "views", __dirname + "/dist"
    app.use(express.static(__dirname + '/dist'));
  else
    console.log("Development mode: multiple javascript files, not cached");
    app.set "view engine", "jade"
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.set "views", __dirname
    app.use express.static(__dirname)

  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

  return

if process.env.BETA? && parseInt(process.env.BETA)
  console.log("Enabling beta invite system")

  hdBeta = require('hd-beta')(__dirname + '/' + process.env.BETA_DATABASE_PATH)

  origins = (process.env.BLOCKCHAIN || '').split(' ')
  setHeaderForOrigin = (req, res, origins) ->
    for o in origins
      if req.headers.origin? && req.headers.origin.indexOf(o) > -1
        res.setHeader 'Access-Control-Allow-Origin', req.headers.origin

  # beta key public

  app.get "/", (request, response) ->
    if dist && process.env.BETA?
      response.render "index-beta.html"
    else if dist
      response.render "index.html"
    else
      response.render "app/index.jade"

  app.get "/percent_requested", (request, response) ->
    setHeaderForOrigin request, response, origins
    response.json { width: (process.env.PERCENT_REQUESTED || 60) }

  app.get "/request_beta_key", (request, response) ->
    setHeaderForOrigin request, response, origins
    userEmail = request.query.email
    if (parseInt(process.env.PERCENT_REQUESTED) != 100)
      if (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(userEmail))
        ios = if request.query.ios == 'true' || request.query.ios == true then true else false
        android = if request.query.android == 'true' || request.query.android == true then true else false
        hdBeta.attemptToRequestKey userEmail, { ios: ios, android: android }, (err) ->
          if !err
            response.json { message: 'Successfully submitted request', success: true }
          else
            response.json { message: err, success: false }
      else
        response.json { message: 'Invalid email address', success: false }
    else
      response.json { message: 'Beta key request limit reached', success: false }

  app.post "/check_beta_key_unused", (request, response) ->
    hdBeta.verifyKey request.body.key, (err, verified) ->
      if err
        response.json {verified : false, error: {message: err}}
      else if verified
        hdBeta.doesKeyExistWithoutGUID request.body.key, (err, verified, email) ->
          if verified
            response.json {verified : true, email: email}
          else
            response.json {verified : false, error: {message: "Invite key already used. Please login instead."}}
      else
        response.json {verified : false, error: {message: "Invite key not found"}}

  app.post "/check_guid_for_beta_key", (request, response) ->
    hdBeta.isGuidAssociatedWithBetaKey request.body.guid, (err, verified) ->
      if err
        response.json {verified : false, error: {message: "There was a problem verifying your invite key. Please try again later.", err }}
      else if verified
        response.json {verified : true}
      else
        response.json {verified : false, error: {message: "This wallet is not associated with a beta invite key. Please create a new wallet first."}}

  app.post "/set_guid_for_beta_key", (request, response) ->
    hdBeta.doesKeyExistWithoutGUID request.body.key, (err, unclaimed, email) ->
      if err
        response.json {success : false, error: {message: err}}
      else if unclaimed
        hdBeta.setGuid request.body.key, request.body.guid, () ->
          response.json {success : true}
      else
        response.json {success : false}

  app.post "/verify_wallet_created", (request, response) ->
    hdBeta.newWalletCreated request.body.key, (err) ->
      if err
        response.json {success : false, error: {message: err}}
      else
        response.json {success : true}

  app.post '/whitelist_guid', (request, response) ->
    if !request.body?
      response.json { error: 'no request body' }
    else if request.body.secret != process.env.WHITELIST_SECRET
      response.json { error: 'incorrect secret' }
    else if !request.body.guid?
      response.json { error: 'missing request body guid parameter' }
    else
      name = request.body.name || 'Mobile Tester'
      hdBeta.assignKey name, request.body.email, request.body.guid, (err, key) ->
        response.json { error: err, key: key }

  # beta key admin

  app.get "/admin/?", (request, response, next) ->
    credentials = auth(request)

    if (!credentials || credentials.name != 'blockchain' || credentials.pass != process.env.ADMIN_PASSWORD)
      response.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="blockchain-beta-admin"'
      })
      response.end()
    else
      if dist
        response.render "admin.html"
      else
        response.render "app/admin.jade"

  app.get "/admin/api/:method", (request, response, next) ->
    credentials = auth(request)

    if (!credentials || credentials.name != 'blockchain' || credentials.pass != process.env.ADMIN_PASSWORD)
      response.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="blockchain-beta-admin"'
      })
      response.end()
    else
      # get-all-keys depricated
      if request.params.method == 'get-all-keys'
        hdBeta.getKeys (err, data) ->
          response.send JSON.stringify data

      else if request.params.method == 'get-sorted-keys'
        hdBeta.getKeys request.query, (err, data) ->
          response.json { error: err, data: data }

      else if request.params.method == 'assign-key'
        hdBeta.assignKey request.query.name, request.query.email, request.query.guid, (err, key) ->
          response.json { error: err, key: key }

      else if request.params.method == 'delete-key'
        hdBeta.deleteKey request.query, (err) ->
          response.json { error: err }

      else if request.params.method == 'update-key'
        hdBeta.updateKey request.query.selection, request.query.update, (err) ->
          response.json { error: err }

      else if request.params.method == 'activate-key'
        hdBeta.activateKey request.query.selection, request.query.update, (err) ->
          response.json { error: err }

      else if request.params.method == 'activate-all'
        range = [request.query.min || 0, request.query.max || 100000]
        hdBeta.activateAll range, (err, data) ->
          response.json { error: err, data: data }

      else if request.params.method == 'resend-activation'
        hdBeta.resendActivationEmail request.query.key, (err) ->
          response.json { error: err }

      else if request.params.method == 'resend-many'
        range = [request.query.min || 0, request.query.max || 100000]
        hdBeta.resendMany range, (err, data) ->
          response.json { error: err, data: data }

      else if request.params.method == 'wallets-created'
        hdBeta.fetchNumWalletsCreated (err, count) ->
          response.json { error: err, count: count }

      else if request.params.method == 'get-csv'
        hdBeta.fetchCSV {}, (err, csv) ->
          fs.writeFileSync 'tmp.csv', csv
          response.download 'tmp.csv', 'emails.csv', () ->
            fs.unlink 'tmp.csv'

      else if request.params.method == 'set-percent-requested'
        percent = parseInt(request.query.percent)
        isNumber = not isNaN(percent)
        if isNumber
          process.env.PERCENT_REQUESTED = percent
        response.json { success: Boolean(isNumber) }
else
  app.get "/", (request, response) ->
    if dist
      response.render "index.html"
    else
      response.render "app/index.jade"

# /verify-email?token=$token sends a request to ethereumwallet.org and redirects to login
app.get "/verify-email", (request, response) ->
  r.get 'https://ethereumwallet.org/wallet' + request.originalUrl
  response.cookie 'email-verified', true
  response.redirect '/'

app.get "/my/:guid", (request, response) ->
  response.cookie 'uid', '"' + request.params["guid"] + '"'
  response.redirect '/#/login'


app.post "/multiaddr", (request, response) ->
  response.header("Content-Type", "application/json");
  jira = 'http://127.0.0.1:7070' + request.originalUrl
  r.post { url: jira, body: querystring.stringify(request.body) }, (err, httpResponse, body) ->
    if !httpResponse or httpResponse.statusCode == 500
      response.send HttpStatus.INTERNAL_SERVER_ERROR,body
    else
      response.send HttpStatus.OK,body

app.post "/pushtx", (request, response) ->
  response.header("Content-Type", "application/json");
  jira = 'http://127.0.0.1:7070' + request.originalUrl
  r.post { url: jira, body: querystring.stringify(request.body) }, (err, httpResponse, body) ->
    if httpResponse.statusCode == 500 or body != "OK"
      response.send HttpStatus.INTERNAL_SERVER_ERROR,body
    else
      response.send HttpStatus.OK,body

app.post "/pushtx_ver2", (request, response) ->
  response.header("Content-Type", "application/json");
  jira = 'http://127.0.0.1:7070' + request.originalUrl
  r.post { url: jira, body: querystring.stringify(request.body) }, (err, httpResponse, body) ->
    if httpResponse.statusCode == 500 or body != "OK"
      response.send HttpStatus.INTERNAL_SERVER_ERROR,body
    else
      response.send HttpStatus.OK,body

app.post "/old-multiaddr", (request, response) ->
  response.send """
{
"recommend_include_fee" : true,
"sharedcoin_endpoint" : "https://api.sharedcoin.com",
"clientTimeDiff":"5387150",
"serverTime":"1439973625773",
"info": {
    "notice":"Please use our onion link https://blockchainbdgpzk.onion/",
    "conversion":100000000.00000000,
    "nconnected":1019,
    "symbol_local":{"symbol":"USD","code":"USD","symbolAppearsAfter":false,"name":"U.S. Dollar","local":true,"conversion":1},
    "symbol_btc":{"symbol":"ETH","code":"ETH","symbolAppearsAfter":true,"name":"Ethereum","local":false,"conversion":1000000000000000000.00000000},
    "latest_block" : {
        "height":370516,
        "block_index":964643,
        "hash":"00000000000000000a005e0d4f5ad2ad1e0efa9acf3e7c58f3027f27217554ba",
        "time":1439972880
    }
},
"wallet": {
    "n_tx":2,
    "n_tx_filtered":2,
    "total_received":107555700000000,
    "total_sent":0,
    "final_balance":107555700000000
},
"addresses":[
{
    "address":"xpub6CwPni6j251X3Ca9cZRuDhCmYNAcLxBb14DAQ6xdPnhfuECsW2KiuQGycsgqkwoQrZKLkL4792RPzsnSGEFkyZ6R1xYMgXDXYtkVKBuUfeh",
    "n_tx":2,
    "total_received":107555700000000,
    "total_sent":0,
    "final_balance":107555700000000,
    "gap_limit" : 20,
    "change_index" : 0,
    "account_index" :2
}],
"txs":[{
   "ver":1,
   "inputs":[
      {
         "sequence":4294967294,
         "prev_out":{
            "spent":true,
            "tx_index":98846254,
            "type":0,
            "addr":"1CxQKogUEKm1ES9eq7zoMh9PtnjHoxG4AH",
            "value":399487300000000,
            "n":0,
            "script":"76a9148323bb4a195d26ac4999fb588cccfaf5f886edb188ac"
         },
         "script":"483045022100e4fd6b54a4184810467cdaa0424c5b3f257877779fdf389c3d5a0fd5f0c84f75022058e8c8b73b7e3d1a093d10feafea666aa8a2dadb992614c3c94433f652f75d58012103f1d420e75961689b80941cea3f0ae229c7d2a55f95904494733c148641474086"
      }
   ],
   "relayed_by":"176.9.126.177",
   "out":[
      {
         "spent":false,
         "tx_index":98844227,
         "type":0,
         "addr":"1DHYrSvHm76zpaEbam4tkqqMemoNpNevVm",
         "value":50000000000000,
         "xpub":{
            "path":"M\/0\/1",
            "m":"xpub6CwPni6j251X3Ca9cZRuDhCmYNAcLxBb14DAQ6xdPnhfuECsW2KiuQGycsgqkwoQrZKLkL4792RPzsnSGEFkyZ6R1xYMgXDXYtkVKBuUfeh"
         },
         "n":0,
         "script":"76a91486c2c102cc189d41332e621946d408c0ed229e6f88ac"
      },
      {
         "spent":false,
         "tx_index":9884422700000000,
         "type":0,
         "addr":"1uu1T5bcjNbzHkmjvk8mJ8DHKKA8Rdkjn",
         "value":3489746,
         "n":1,
         "script":"76a9140a010b3cee53d7448ef96c6246fc676623557a8588ac"
      }
   ],
   "lock_time":370506,
   "result":500000,
   "size":226,
   "balance":1075557,
   "double_spend":false,
   "time":1439973604,
   "tx_index":98844227,
   "vin_sz":1,
   "hash":"c0182e925dbf4766dcdc68cc50c24c5049a0c01c0c5fd2c2c1fbf04d5583e621",
   "vout_sz":2
},{
   "ver":1,
   "inputs":[
      {
         "sequence":4294967294,
         "prev_out":{
            "spent":true,
            "tx_index":98460748,
            "type":0,
            "addr":"1Mjg7ErNzZvkgiBTy5LKTihKYdQsnZuLRo",
            "value":4575557000000,
            "n":0,
            "script":"76a914e374a1a4e9cb43b0626dca1c9502cf11f6228eca88ac"
         },
         "script":"483045022100ac6301a4411fef37b5f9f339f43a44969e0ce9dd56eb8f80df5acf77aa2cbca402203618025b9de1d2cf2b550355134be8bdb79695c86b77526f8c1025ef18b2a40d012102de1eb69b40d566ef9eeafa5638386cd4f0c1e27f945185621989c20a9b5a6d85"
      }
   ],
   "relayed_by":"193.204.161.169",
   "out":[
      {
         "spent":true,
         "tx_index":98846254,
         "type":0,
         "addr":"1CxQKogUEKm1ES9eq7zoMh9PtnjHoxG4AH",
         "value":3994873000000,
         "n":0,
         "script":"76a9148323bb4a195d26ac4999fb588cccfaf5f886edb188ac"
      },
      {
         "spent":false,
         "tx_index":98846254,
         "type":0,
         "addr":"1P7MfJt5GLN66ECp3oryQQHRBFGaNt1aWb",
         "value":5755570000000000,
         "xpub":{
            "path":"M\/0\/0",
            "m":"xpub6CwPni6j251X3Ca9cZRuDhCmYNAcLxBb14DAQ6xdPnhfuECsW2KiuQGycsgqkwoQrZKLkL4792RPzsnSGEFkyZ6R1xYMgXDXYtkVKBuUfeh"
         },
         "n":1,
         "script":"76a914f286826fee69abd35a1cd0ace598c8e5e1f195e688ac"
      }
   ],
   "lock_time":370506,
   "result":575557,
   "size":226,
   "balance":575557,
   "double_spend":false,
   "time":1439973556,
   "tx_index":98846254,
   "vin_sz":1,
   "hash":"ca73c16b45d09d930cf3a560beb0a7edb9aa0baf15df9ea8e85a526ba477ba0b",
   "vout_sz":2
}]

}
"""

app.post "/wallet", (request, response) ->
  response.header("Content-Type", "application/json");
  jira = 'http://127.0.0.1:7070' + request.originalUrl
  r.post { url: jira, body: querystring.stringify(request.body) }, (err, httpResponse, body) ->
    if httpResponse.statusCode == 500
      response.send HttpStatus.INTERNAL_SERVER_ERROR,body
    else
      response.send HttpStatus.OK,body


app.get "/wallet/:uuid", (request, response) ->
  response.header("Content-Type", "application/json");
  jira = 'http://127.0.0.1:7070/wallet/' + request.params["uuid"]
  r.get { url: jira }, (err, httpResponse, body) ->
    if httpResponse && httpResponse.statusCode == 500
      response.send HttpStatus.INTERNAL_SERVER_ERROR,body
    else if httpResponse
      response.send HttpStatus.OK,body
    else
      response.send HttpStatus.INTERNAL_SERVER_ERROR,"unknown error"

app.get "/uuid-generator", (request, response) ->
  response.header("Content-Type", "application/json");
  jira = 'http://127.0.0.1:7070/uuid-generator/' + request.query.n
  r.get { url: jira }, (err, httpResponse, body) ->
    response.send HttpStatus.OK,body

app.get "/ticker", (request, response) ->
  response.header("Content-Type", "application/json");
  jira = 'http://127.0.0.1:7070/ticker'
  r.get { url: jira }, (err, httpResponse, body) ->
    response.send HttpStatus.OK,body


# /authorize-approve?token=$token sends a request to ethereumwallet.org and redirects to login
app.get "/authorize-approve", (request, response) ->
  response.send """
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Verifying authorization request</title>
    <script>
      var xmlHttp = new XMLHttpRequest();
      // The redirect should be done in the callback, but currently the callback doesn't get called because the authorize-approve page makes an ajax request to /wallet over http which is blocked
      // xmlHttp.onload = function () {
      //   window.location.replace("/");
      // };
      xmlHttp.open("GET", "https://ethereumwallet.org/wallet#{request.originalUrl}", true);
      xmlHttp.send();

      setTimeout(function() { window.location.replace("/"); }, 500);
    </script>
  </head>
</html>
"""

# /unsubscribe?token=$token sends a request to ethereumwallet.org and redirects to login
app.get "/unsubscribe", (request, response) ->
  r.get 'https://ethereumwallet.org/wallet' + request.originalUrl
  response.redirect '/'

# *.ethereumwallet.org/guid fills in the guid on the login page
app.get /^\/.{8}-.{4}-.{4}-.{4}-.{12}$/, (request, response) ->
  response.cookie 'uid', '"' + request.path.split(path.sep)[1] + '"'
  response.redirect '/'

# *.ethereumwallet.org/key-{key} brings the user to the register page and fills in the key
app.get /^\/key-.{8}$/, (request, response) ->
  response.cookie 'key', '"' + request.path.split(path.sep)[1].split('-')[1] + '"'
  response.redirect '/'

# TODO Better 404 page
app.use (req, res) ->
  res.send '<center><h1>404 Not Found</h1></center>'

#https.createServer({
#      key: fs.readFileSync('ssl/myserver.key'),
#      cert: fs.readFileSync('ssl/ethereumwallet_org.crt')
#    }, app).listen(8080)
#console.log "Listening on " + port
#return

app.listen port, ->
  console.log "Listening on " + port
  return
