if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const axios = require("axios");

//REST COUNTRIES API
const restCountriesApi = "https://restcountries.com/v2/currency";

//FIXER API
const fixerApiKey = process.env.FIXER_API_KEY;
const fixerApi = `http://data.fixer.io/api/latest?access_key=${fixerApiKey}`;

//Get exchange rate from Fixer Api
const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const {
      data: { rates },
    } = await axios.get(fixerApi);

    const euro = 1 / rates[fromCurrency];
    const exchangeRate = euro * rates[toCurrency];
    return exchangeRate;
  } catch (error) {
    throw new Error(`Unable to convert ${fromCurrency} and ${toCurrency}`);
  }
};

//Fetch data about countries
const getCountries = async (currencyCode) => {
  try {
    const { data } = await axios.get(`${restCountriesApi}/${currencyCode}`);
    return data.map(({ name }) => name);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};

//Convert currency
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  fromCurrency = fromCurrency.toUpperCase();
  toCurrency = toCurrency.toUpperCase();
  const [exchangeRate, countries] = await Promise.all([
    getExchangeRate(fromCurrency, toCurrency),
    getCountries(toCurrency),
  ]);

  const convertedAmount = (amount * exchangeRate).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.`;
};

convertCurrency("ffg", "pkr", 1)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
