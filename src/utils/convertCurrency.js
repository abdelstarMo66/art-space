const CurrencyConverter = require("currency-converter-lt")

const convertCurrency = async (from, to, amount) => {
    let currencyConverter = new CurrencyConverter()

    return await currencyConverter.from(from).to(to).amount(Number(amount)).convert();
}

module.exports = convertCurrency