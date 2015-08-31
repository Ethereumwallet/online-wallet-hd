# bc-qr-reader

QR Code reader directive for AngularJS. 

It uses [webcam-directive](https://github.com/jonashartmann/webcam-directive) to access the camera and [Lazarsoft QR reader](https://github.com/LazarSoft/jsqrcode) to process the QR code.

## Install

    bower install --save blockchain/bc-qr-reader

## Usage

Include `dist/bc-qr-reader.js` as well as `bower_components/webcam-directive/app/scripts/webcam.js`. Add the `webcam` module to your application.

    bc-qr-reader(active="cameraRequested", on-result="processURLfromQR" on-error="onError" camera-status="cameraIsOn")

## Development

    npm install
    cd src && git clone https://github.com/Sjors/jsqrcode

## Update bower package

    npm install
    grunt dist
