# Ethereum Wallet HD Frontend 

An AngularJS ethereum web wallet which runs entirely in the browser eliminating any risk.
As the cryptographic operations are run entirely local (inside your webbrowser) there is no chance an attacker could siphon your password or your private keys. Your secret data is at no point transmitted to our webserver. The only communication that takes place with our server is to push an already signed transaction and to store an encrypted version of your wallet (that again can only be decoded using your password).

To sum up, you can say that this wallet provides the same amount of security as a local full node.

## Quick Pointers

Many people want to check out, what is really happening behind the scenes before they actually start using a software. Here, we will point out the most important files to quickly verify the security of our software.

- Signing transaction and pushing it to the server

```assets/js/my-wallet/src/wallet-spender.js
```	

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed. You also need to install the [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) (not to be confused with SDK).

Some NodeJS components need to be installed system wide:

```sh
npm install -g grunt-cli coffee-script http-server bower
```	

You also need Sass (use `sudo` if you're not using a [Ruby version manager](https://rvm.io)):

```sh
gem install sass
```

```sh
git clone https://github.com/Ethereumwallet/online-wallet-hd 
cd online-wallet-hd 
grunt dist
```

Run the server:
```sh 
npm start
```

Visit [beta.ethereumwallet.org:8443](http://beta.ethereumwallet.org:8443/).  Do not use `localhost:8443`. You will need to modify your "hosts" file (`/etc/hosts` on OSX and most UNIX systems) because this is no longer registered at the DNS level for application security reasons. Add this line to `/etc/hosts`:

    127.0.0.1   beta.ethereumwallet.org

## Testnet

Not supported by the server yet.


