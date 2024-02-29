// const CurrencyConverter = require("currency-converter-lt")

const cheerio = require("cheerio");
const request = require("request");

class CurrencyConverter {
    currencyCode = [
        "AFN",
        "ALL",
        "DZD",
        "AOA",
        "ARS",
        "AMD",
        "AWG",
        "AUD",
        "AZN",
        "BSD",
        "BHD",
        "BBD",
        "BDT",
        "BYN",
        "BZD",
        "BMD",
        "BTN",
        "XBT",
        "BOB",
        "BAM",
        "BWP",
        "BRL",
        "BND",
        "BGN",
        "BIF",
        "XPF",
        "KHR",
        "CAD",
        "CVE",
        "KYD",
        "FCFA",
        "CLP",
        "CLF",
        "CNY",
        "CNY",
        "COP",
        "CF",
        "CHF",
        "CDF",
        "CRC",
        "HRK",
        "CUC",
        "CZK",
        "DKK",
        "DJF",
        "DOP",
        "XCD",
        "EGP",
        "ETB",
        "FJD",
        "GMD",
        "GBP",
        "GEL",
        "GHS",
        "GTQ",
        "GNF",
        "GYD",
        "HTG",
        "HNL",
        "HKD",
        "HUF",
        "ISK",
        "INR",
        "IDR",
        "IRR",
        "IQD",
        "ILS",
        "JMD",
        "JPY",
        "JOD",
        "KMF",
        "KZT",
        "KES",
        "KWD",
        "KGS",
        "LAK",
        "LBP",
        "LSL",
        "LRD",
        "LYD",
        "MOP",
        "MKD",
        "MGA",
        "MWK",
        "MYR",
        "MVR",
        "MRO",
        "MUR",
        "MXN",
        "MDL",
        "MAD",
        "MZN",
        "MMK",
        "NAD",
        "NPR",
        "ANG",
        "NZD",
        "NIO",
        "NGN",
        "NOK",
        "OMR",
        "PKR",
        "PAB",
        "PGK",
        "PYG",
        "PHP",
        "PLN",
        "QAR",
        "RON",
        "RUB",
        "RWF",
        "SVC",
        "SAR",
        "RSD",
        "SCR",
        "SLL",
        "SGD",
        "SBD",
        "SOS",
        "ZAR",
        "KRW",
        "VES",
        "LKR",
        "SDG",
        "SRD",
        "SZL",
        "SEK",
        "CHF",
        "TJS",
        "TZS",
        "THB",
        "TOP",
        "TTD",
        "TND",
        "TRY",
        "TMT",
        "UGX",
        "UAH",
        "AED",
        "USD",
        "UYU",
        "UZS",
        "VND",
        "XOF",
        "YER",
        "ZMW",
        "ETH",
        "EUR",
        "LTC",
        "TWD",
        "PEN",
    ];

    constructor(params) {
        this.currencyFrom = "";
        this.currencyTo = "";
        this.currencyAmount = 1;
        this.convertedValue = 0;
        this.isDecimalComma = false;
        this.isRatesCaching = false;
        this.ratesCacheDuration = 0;
        this.ratesCache = {};

        if (params !== undefined) {
            if (params["from"] !== undefined) this.from(params["from"]);

            if (params["to"] !== undefined) this.to(params["to"]);

            if (params["amount"] !== undefined) this.amount(params["amount"]);

            if (params["isDecimalComma"] !== undefined)
                this.setDecimalComma(params["isDecimalComma"]);
        }
    }

    from(currencyFrom) {
        if (typeof currencyFrom !== "string")
            throw new TypeError("currency code should be a string");

        if (!this.currencyCode.includes(currencyFrom.toUpperCase()))
            throw new Error(`${currencyFrom} is not a valid currency code`);

        this.currencyFrom = currencyFrom.toUpperCase();
        return this;
    }

    to(currencyTo) {
        if (typeof currencyTo !== "string")
            throw new TypeError("currency code should be a string");

        if (!this.currencyCode.includes(currencyTo.toUpperCase()))
            throw new Error(`${currencyTo} is not a valid currency code`);

        this.currencyTo = currencyTo;
        return this;
    }

    amount(currencyAmount) {
        if (typeof currencyAmount !== "number")
            throw new TypeError("amount should be a number");

        if (currencyAmount <= 0)
            throw new Error("amount should be a positive number");

        this.currencyAmount = currencyAmount;
        return this;
    }

    setDecimalComma(isDecimalComma) {
        if (typeof isDecimalComma !== "boolean")
            throw new TypeError("isDecimalComma should be a boolean");

        this.isDecimalComma = isDecimalComma;
        return this;
    }

    replaceAll(text, queryString, replaceString) {
        let text_ = "";
        for (let i = 0; i < text.length; i++) {
            if (text[i] === queryString) {
                text_ += replaceString;
            } else {
                text_ += text[i];
            }
        }
        return text_;
    }

    rates() {
        if (this.currencyFrom === this.currencyTo) {
            return new Promise((resolve, _) => {
                resolve(1);
            });
        } else {
            let currencyPair =
                this.currencyFrom.toUpperCase() + this.currencyTo.toUpperCase();
            let now = new Date();
            if (
                currencyPair in this.ratesCache &&
                now < this.ratesCache[currencyPair].expiryDate
            ) {
                return new Promise((resolve, _) => {
                    resolve(this.ratesCache[currencyPair].rate);
                });
            } else {
                return new Promise((resolve, reject) => {
                    request(
                        `https://www.google.com/search?q=${this.currencyAmount}+${this.currencyFrom}+to+${this.currencyTo}+&hl=en`,
                        function (error, response, body) {
                            if (error) {
                                return reject(error);
                            } else {
                                resolve(body);
                            }
                        }
                    );
                })
                    .then((body) => {
                        return cheerio.load(body);
                    })
                    .then(($) => {
                        return $(".iBp4i").text().split(" ")[0];
                    })
                    .then((rates) => {
                        if (this.isDecimalComma) {
                            if (rates.includes(".")) rates = this.replaceAll(rates, ".", "");
                            if (rates.includes(",")) rates = this.replaceAll(rates, ",", ".");
                            console.log(rates);
                        } else {
                            if (rates.includes(",")) rates = this.replaceAll(rates, ",", "");
                            console.log(rates);
                        }
                        console.log(rates);
                        return rates;
                    });
            }
        }
    }

    convert(currencyAmount) {
        if (currencyAmount !== undefined) {
            this.amount(currencyAmount);
        }

        if (this.currencyFrom === "")
            throw new Error("currency code cannot be an empty string");

        if (this.currencyTo === "")
            throw new Error("currency code cannot be an empty string");

        if (this.currencyAmount === 0)
            throw new Error("currency amount should be a positive value");

        return this.rates().then((rates) => {
            this.convertedValue = rates;
            return this.convertedValue;
        });
    }
}

const convertCurrency = async (from, to, amount) => {
    let currencyConverter = new CurrencyConverter()

    return await currencyConverter.from(from).to(to).amount(Number(amount)).convert();
}

module.exports = convertCurrency