describe "toBitCurrencyFilter", ->

  $filter = null
  Wallet = null
  btcCurrencies = null

  beforeEach angular.mock.module("walletApp")

  beforeEach ->
    module('walletFilters')
    inject (_$filter_) ->
      $filter = _$filter_

  beforeEach ->
    angular.mock.inject ($injector) ->
      Wallet = $injector.get("Wallet")
      btcCurrencies = Wallet.btcCurrencies

  it "should convert from satoshi to BTC", () ->
    toBitCurrency = $filter('toBitCurrency')
    BTC = btcCurrencies.filter((i) -> i.code == 'ETH')[0]
    expect(toBitCurrency(1000000000000000000, ETH)).toBe('1 ETH')

  it "should hide the currency name", () ->
    toBitCurrency = $filter('toBitCurrency')
    expect(toBitCurrency(100000000, btcCurrencies[0], true)).toBe('1')

  it "should not convert if amount is null", () ->
    toBitCurrency = $filter('toBitCurrency')
    expect(toBitCurrency(null, btcCurrencies[0])).toBe('')

  it "should not convert if currency is null", () ->
    toBitCurrency = $filter('toBitCurrency')
    expect(toBitCurrency(100000000)).toBe('')