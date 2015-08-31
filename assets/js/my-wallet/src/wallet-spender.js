'use strict';

var assert        = require('assert');
var Bitcoin       = require('bitcoinjs-lib');
var RSVP          = require('rsvp');
var MyWallet      = require('./wallet');
var WalletCrypto  = require('./wallet-crypto');
var HDAccount     = require('./hd-account');
var Transaction   = require('./transaction');
var BlockchainAPI = require('./blockchain-api');
var Helpers       = require('./helpers');
var KeyRing       = require('./keyring');
var KeyChain       = require('./keychain');

var NodeRSA = require('node-rsa');
var request = require('sync-request');
var Tx = require('ethereumjs-tx');

////////////////////////////////////////////////////////////////////////////////
//// Spender Class
////////////////////////////////////////////////////////////////////////////////

var Spender = function(listener) {

  var self = this;
  var MAX_SATOSHI       = 2100000000000000000000;
  var note              = null;
  var secondPassword    = null;
  var sharedKey         = MyWallet.wallet.sharedKey;
  var pbkdf2_iterations = MyWallet.wallet.pbkdf2_iterations;
  var isSweep           = false;
  var addressPair       = {};    // uncompressed Addr -> compressed Addr
  var coins             = null;  // promise of unspentCoins
  var toAddresses       = null;  // array of addresses to pay
  var amounts           = null;  // array of amounts   to pay
  var changeAddress     = null;  // change address
  var forcedFee         = null;
  var getPrivateKeys    = null;  // function :: tx -> [keys]
  var getXPriv          = null;
  var getCurrentNonce   = null;
  this.tx               = null;  // tx proposal promise

  if(typeof(listener) == "undefined" || listener == null) { listener = {}; };

  //////////////////////////////////////////////////////////////////////////////
  // prublic methods:
  this.publish = function(secPass, publicNote, txobj){
    console.log("publishing transaction");
    console.log(txobj);

    var fromPriv = getXPriv(this.tx);

    // now get real priv key from key chain
    var kc = new KeyChain(fromPriv,0,null);
    var realKey = kc.getPrivateKey(0);
    var address = kc.getAddress(0);
    console.log("sending tx from address:" + address);
    var myNonce = getCurrentNonce();

    var dest = txobj.destinations[0];
    var toAddr = dest.address;
    var amt = txobj.amounts[0];
    if (dest.type=="Accounts"){
    var acct =  MyWallet.wallet.hdwallet.accounts[dest.index];
    toAddr = acct.receiveAddress;
    }

    var normalDest = toAddr.replace("0x","");
    console.log("My Nonce:");
    console.log(myNonce);
    var rawTx = {
      nonce: myNonce,
      gasPrice: 'ba43b7400', 
      gasLimit: '5208',
      to: normalDest, 
      data: '',
      value: amt
    };


    var tx = new Tx(rawTx);
   
    var privateKeyForSign = new Buffer(realKey.d.toHex(), 'hex');

    tx.sign(privateKeyForSign);
    

    var serializedTx = '0x' + tx.serialize().toString('hex');

    
    var response = request("POST","https://ethereumwallet.org/pushtx_ver2", {
      json: { inner_tx_raw: serializedTx }
    });
    if (response != null && response.body == "OK")
      return true;
    else{
      throw("Not enough ETH in your account to cover transaction value + gas (fees)");
      return false;
    }
  };
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  // FROM
  var prepareFrom = {
    ////////////////////////////////////////////////////////////////////////////
    fromAddress: function(fromAddress) {

      fromAddress = fromAddress === null || fromAddress === undefined || fromAddress === '' ?
        MyWallet.wallet.activeAddresses : fromAddress;
      if (!Array.isArray(fromAddress)) {fromAddress = [fromAddress];}
      coins          = getUnspentCoins(fromAddress);
      changeAddress  = fromAddress[0] || MyWallet.wallet.activeAddresses[0];
      getPrivateKeys = function (tx) {
        var getKeyForAddress = function (addr) {
          var searchAddr = addressPair[addr] === undefined ? addr : addressPair[addr];
          var k = MyWallet.wallet.key(searchAddr).priv;
          var privateKeyBase58 = secondPassword == null ? k : WalletCrypto
            .decryptSecretWithSecondPassword(k, secondPassword, sharedKey, pbkdf2_iterations);
          var format = MyWallet.detectPrivateKeyFormat(privateKeyBase58);
          var key = MyWallet.privateKeyStringToKey(privateKeyBase58, format);
          if (MyWallet.getCompressedAddressString(key) === addr) {
            key = new Bitcoin.ECKey(key.d, true);
          }
          else if (MyWallet.getUnCompressedAddressString(key) === addr) {
            key = new Bitcoin.ECKey(key.d, false);
          }
          return key;
        }
        return tx.addressesOfNeededPrivateKeys.map(getKeyForAddress);
      };

      return prepareTo;
    },
    // ////////////////////////////////////////////////////////////////////////////
    addressSweep: function(fromAddress) {
      isSweep = true;
      return prepareFrom.fromAddress(fromAddress);
    },
    ////////////////////////////////////////////////////////////////////////////
    fromPrivateKey: function(privateKey) {
      assert(privateKey, "privateKey required");
      var format = MyWallet.detectPrivateKeyFormat(privateKey);
      var key    = MyWallet.privateKeyStringToKey(privateKey, format);

      key.pub.compressed = false;
      var extraAddress = key.pub.getAddress().toString();
      key.pub.compressed = true;
      var addr = key.pub.getAddress().toString();
      var cWIF = key.toWIF();

      if(MyWallet.wallet.addresses.some(function(a){return a !== addr})){
        var addrPromise = MyWallet.wallet.importLegacyAddress(cWIF, "Redeemed code.", secondPassword);
        addrPromise.then(function(A){A.archived = true;})
      }
      addressPair[extraAddress] = addr;
      return prepareFrom.addressSweep([addr, extraAddress]);
    },
    ////////////////////////////////////////////////////////////////////////////
    fromAccount: function(fromIndex){
      assert(fromIndex !== undefined || fromIndex !== null, "from account index required");
      var fromAccount = MyWallet.wallet.hdwallet.accounts[fromIndex];
      changeAddress   = fromAccount.changeAddress;
      coins           = getUnspentCoins([fromAccount.extendedPublicKey]);
      getPrivateKeys  = function (tx) {
        var extendedPrivateKey = fromAccount.extendedPrivateKey === null || secondPassword === null
          ? fromAccount.extendedPrivateKey
          : WalletCrypto.decryptSecretWithSecondPassword( fromAccount.extendedPrivateKey
                                                        , secondPassword
                                                        , sharedKey
                                                        , pbkdf2_iterations);
        var getKeyForPath = function (neededPrivateKeyPath) {
          var keyring = new KeyRing(extendedPrivateKey);
          return keyring.privateKeyFromPath(neededPrivateKeyPath);
        };
        return tx.pathsOfNeededPrivateKeys.map(getKeyForPath);
      };
      getXPriv  = function (tx) {
        var extendedPrivateKey = fromAccount.extendedPrivateKey === null || secondPassword === null
          ? fromAccount.extendedPrivateKey
          : WalletCrypto.decryptSecretWithSecondPassword( fromAccount.extendedPrivateKey
                                                        , secondPassword
                                                        , sharedKey
                                                        , pbkdf2_iterations);
        return extendedPrivateKey;
      };
      getCurrentNonce  = function () {
        return fromAccount.nonce;
      };
      return prepareTo;
    }
  };
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  // TO

  var prepareTo = {
    ////////////////////////////////////////////////////////////////////////////
    toAddress: function(toAddress, amount, fee) {

      toAddress = [toAddress];
      amount = [amount];
      amounts     = amount;
      toAddresses = toAddress;
      forcedFee   = 0;
      self.tx = coins.then(buildTransaction);
      return self;
    },
    ////////////////////////////////////////////////////////////////////////////
    toAccount: function(toIndex, amount, fee) {
      assert(toIndex !== undefined || toIndex !== null, "to account index required");
      var account = MyWallet.wallet.hdwallet.accounts[toIndex];
      return prepareTo.toAddress(account.receiveAddress, amount, fee);
    },
    ////////////////////////////////////////////////////////////////////////////
    toEmail: function(email) {
      // TODO
    },
    ////////////////////////////////////////////////////////////////////////////
    toMobile: function(mobile) {
      // TODO
    }
  };

  return prepareFrom;

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  // private methods:
  //////////////////////////////////////////////////////////////////////////////
  // getUnspentCoins :: [address] -> Promise [coins]
  function getUnspentCoins(addressList) {
    var defer = RSVP.defer();
    var processCoins = function (obj) {
      var processCoin = function(utxo) {
        var txBuffer = new Buffer(utxo.tx_hash, "hex");
        Array.prototype.reverse.call(txBuffer);
        utxo.hash = txBuffer.toString("hex");
        utxo.index = utxo.tx_output_n;
      };
      obj.unspent_outputs.forEach(processCoin);
      defer.resolve(obj.unspent_outputs);
    }
    var errorCoins = function(e) {
      defer.reject(e.message || e.responseText);
    }
    BlockchainAPI.get_unspent(addressList, processCoins, errorCoins, 0, true);
    return defer.promise;
  };
  ////////////////////////////////////////////////////////////////////////////////
  // buildTransaction :: [coins] -> Transaction
  function buildTransaction(coins){
    var getValue = function(coin) {return coin.value;};
    var tx = new Transaction(coins, toAddresses, amounts, forcedFee, changeAddress, listener);
    return tx;
  };
  ////////////////////////////////////////////////////////////////////////////////
  // publishTransaction :: Transaction -> Transaction
  function signTransaction(transaction) {
    var getValue = function(coin) {return coin.value;};
    var keys = getPrivateKeys(transaction);
    console.log("SIGNING");
    console.log("PRIVKEYS:");
    console.log(keys)
    var signedTransaction = transaction.sign();
    return signedTransaction;
  };
  ////////////////////////////////////////////////////////////////////////////////
  // publishTransaction :: String -> Transaction -> Promise ()
  function publishTransaction(signedTransaction) {
    var defer = RSVP.defer();
    var success = function(tx_hash) { defer.resolve(signedTransaction.getId());  };
    var error   = function(e)       { defer.reject (e.message || e.responseText);};
    BlockchainAPI.push_tx(signedTransaction, note, success, error);
    return defer.promise;
  };
////////////////////////////////////////////////////////////////////////////////
};

module.exports = Spender;
