<template>
  <div>
    <input
      type="text"
      inputmode="text"
      class="rounded outline-none p-3 border rounded border-dark-gray w-full"
      placeholder="Enter recipient`s wallet address"
      :value="walletAddress"
      @input="changeWalletAddress"
    />
  </div>
</template>

<script>
export default {
  name: "WalletInput",
  props: {
    walletAddress: String
  },
  methods: {
    changeWalletAddress(event) {
      this.$emit("update:wallet-address", event.target.value);
    }
  }
};
</script>

<style scoped></style>
