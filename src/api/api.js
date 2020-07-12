import axios from "axios";

const AXIOS_CONFIG = {
  baseURL: process.env.VUE_APP_API_URL,
  params: {
    api_key: process.env.VUE_APP_API_KEY
  },
  headers: {
    "Content-Type": "application/json"
  }
};

const httpClient = axios.create(AXIOS_CONFIG);

const getEstimatedValue = (currencyFrom, currencyTo, amount) =>
  httpClient.get("get_estimated", {
    params: {
      currency_from: currencyFrom,
      currency_to: currencyTo,
      amount: amount
    }
  });

const getMinSendValue = (currencyFrom, currencyTo) =>
  httpClient.get("get_ranges", {
    params: {
      currency_from: currencyFrom,
      currency_to: currencyTo
    }
  });

const getAllCurrencies = () => httpClient.get("get_all_currencies");

export { getEstimatedValue, getMinSendValue, getAllCurrencies };
