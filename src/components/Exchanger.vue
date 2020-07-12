<template>
  <div class="container mx-auto p-48">
    <h1 class="text-brand-color text-3xl font-bold">Crypto Exchange</h1>
    <h3 class="text-lg">Exchange fast and easy</h3>
    <div class="flex mt-6 mb-4 flex-wrap">
      <CryptoInput
        :currency-data="sendCurrency"
        :currency-list="sendCurrenciesList"
        type="send"
        @currency-changed="changedCurrency"
        @input-updated="calcEstimated"
      />
      <div class="flex items-center justify-center w-16">
        <img
          class="w-6 h-6 cursor-pointer"
          src="~@/assets/arrows.svg"
          @click="swapCurrencies"
        />
      </div>
      <CryptoInput
        :currency-data="getCurrency"
        :currency-list="getCurrenciesList"
        @currency-changed="changedCurrency"
        type="get"
      />
    </div>
    <p class="mb-2">Your {{ getCurrency.fullName }} address</p>
    <div class="flex">
      <WalletInput
        class="flex-grow mr-6"
        :wallet-address.sync="walletAddress"
      />
      <ExchangeButton />
    </div>
  </div>
</template>

<script>
import CryptoInput from "@/components/CryptoInput";
import WalletInput from "@/components/WalletInput";
import ExchangeButton from "@/components/ExchangeButton";
import * as api from "@/api/api";

export default {
  name: "Exchanger",
  components: { ExchangeButton, WalletInput, CryptoInput },
  data() {
    return {
      allCurrencies: [],
      sendCurrency: {
        name: "btc",
        fullName: "Bitcoin",
        value: ""
      },
      getCurrency: {
        name: "eth",
        fullName: "Ethereum",
        value: ""
      },
      walletAddress: ""
    };
  },
  methods: {
    async changedCurrency(newCurrency) {
      if (newCurrency.type === "send") {
        this.getCurrency.value = "";
        this.sendCurrency = { ...newCurrency.data, value: "" };
      } else {
        this.sendCurrency.value = "";
        this.getCurrency = { ...newCurrency.data, value: "" };
      }
      let minResponse = await api.getMinSendValue(
        this.sendCurrency.name,
        this.getCurrency.name
      );
      let estimatedResponse = await api.getEstimatedValue(
        this.sendCurrency.name,
        this.getCurrency.name,
        minResponse.data.min
      );
      if (
        (!estimatedResponse.data && this.sendCurrency.value) ||
        !minResponse.data
      ) {
        confirm("This pair is disabled now.");
      } else {
        this.getCurrency.value = estimatedResponse.data;
        this.sendCurrency.value = minResponse.data.min;
      }
    },
    swapCurrencies() {
      let sendCurrency = { ...this.sendCurrency };
      this.sendCurrency = { ...this.getCurrency, value: "" };
      this.getCurrency = { ...sendCurrency, value: "" };
    },
    calcEstimated(sendCurrencyValue) {
      api
        .getEstimatedValue(
          this.sendCurrency.name,
          this.getCurrency.name,
          sendCurrencyValue
        )
        .then(response => {
          if (
            !response.data &&
            this.sendCurrency.value &&
            !Number.isNaN(Number(this.sendCurrency.value))
          ) {
            this.getCurrency.value = "-";
            confirm("Amount to send is less than min!");
          } else {
            this.getCurrency.value = response.data;
          }
        });
    }
  },
  computed: {
    getCurrenciesList: function() {
      return this.allCurrencies.filter(
        currency => currency.name !== this.sendCurrency.name
      );
    },
    sendCurrenciesList: function() {
      return this.allCurrencies.filter(
        currency => currency.name !== this.getCurrency.name
      );
    }
  },
  created() {
    api.getAllCurrencies().then(response => {
      /*
        Ограничил список валют, оставил только те, для которых скачал иконки
        Я мог бы брать их все с https://simpleswap.io/, но решил так не делать
      */
      let usedCurrencies = ["btc", "etc", "eth", "ltc", "neo", "xmr", "zec"];
      this.allCurrencies = response.data
        .filter(currency => usedCurrencies.includes(currency.symbol))
        .map(currency => {
          return {
            name: currency.symbol,
            fullName: currency.name
          };
        });
    });
  }
};
</script>

<style scoped></style>
