const cheerio = require("cheerio")
const request = require("request")
const CurrencyConverter = require("currency-converter-lt")

const convertCurrency = async (from, to, amount) => {
    let currencyConverter = new CurrencyConverter()

    // let ratesCacheOptions = {
    //     isRatesCaching: true, // Set this boolean to true to implement rate caching
    //     ratesCacheDuration: 3600 // Set this to a positive number to set the number of seconds you want the rates to be cached. Defaults to 3600 seconds (1 hour)
    // }
    //
    // currencyConverter = currencyConverter.setupRatesCache(ratesCacheOptions)

    return parseInt(await currencyConverter.from(from).to(to).amount(Number(amount)).convert());
}

module.exports = convertCurrency