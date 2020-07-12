<template>
  <div
    class="relative flex flex-grow content-center border rounded border-dark-gray"
  >
    <input
      :disabled="type === 'get'"
      inputmode="decimal"
      class="flex-grow rounded outline-none p-3 bg-white"
      :placeholder="`You ${type}`"
      v-model="currencyData.value"
      @paste.prevent
      @keypress="checkInput"
      @input="updateInput"
    />
    <div
      class="cursor-pointer flex items-center justify-center rounded-r border-l border-dark-gray px-6 bg-white"
      @click="openSearch = !openSearch"
    >
      <img
        :alt="currencyData.name"
        class="w-4 h-4 mr-2"
        :src="require(`@/assets/CryptoIcons/${currencyData.name}.svg`)"
      />
      <p>{{ currencyData.name.toUpperCase() }}</p>
    </div>
    <div class="rounded absolute z-10 w-full bg-white" v-if="openSearch">
      <div class="flex items-center">
        <input
          type="text"
          inputmode="text"
          class="rounded outline-none p-3"
          placeholder="Search"
          v-model="searchValue"
        />
        <img
          class="ml-auto mr-4 w-4 h-4 cursor-pointer"
          src="~@/assets/close.svg"
          @click="openSearch = !openSearch"
        />
      </div>
      <div
        class="selector bg-white border border-dark-gray rounded-b overflow-y-scroll"
      >
        <p class="p-3" v-if="!searchedCurrenciesList.length">
          Cryptocurrency was not found.
        </p>
        <div
          class="flex items-center p-3 cursor-pointer"
          v-for="currency in searchedCurrenciesList"
          :key="currency.name"
          @click="changeSelectedCurrency(currency)"
        >
          <img
            alt=""
            class="w-4 h-4 mr-2"
            :src="require(`@/assets/CryptoIcons/${currency.name}.svg`)"
          />
          <p>{{ currency.name.toUpperCase() }}</p>
          <p class="ml-8 text-light-gray text-sm">{{ currency.fullName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CryptoInput",
  props: {
    currencyData: Object,
    type: String,
    currencyList: Array
  },
  data() {
    return {
      openSearch: false,
      searchValue: ""
    };
  },
  methods: {
    changeSelectedCurrency(newCurrency) {
      if (this.$props.currencyData.name !== newCurrency.name) {
        this.$emit("currency-changed", {
          data: newCurrency,
          type: this.$props.type
        });
      }
      this.openSearch = !this.openSearch;
    },
    checkInput(event) {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if (
        (keyCode < 48 || keyCode > 57) &&
        (keyCode !== 46 || this.$props.currencyData.value.indexOf(".") != -1)
      ) {
        event.preventDefault();
      }
    },
    updateInput(event) {
      this.$emit("input-updated", event.target.value);
    }
  },
  computed: {
    searchedCurrenciesList: function() {
      return this.$props.currencyList.filter(
        currency =>
          currency.name.includes(this.searchValue) ||
          currency.fullName.includes(this.searchValue)
      );
    }
  }
};
</script>

<style scoped lang="scss">
.selector {
  max-height: 200px;
  margin: 0 -1px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
