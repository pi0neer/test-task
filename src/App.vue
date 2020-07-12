<template>
  <div id="app">
    <Exchanger />
  </div>
</template>

<script>
import Exchanger from "./components/Exchanger.vue";

export default {
  name: "App",
  components: {
    Exchanger
  }
};
</script>

<style>
#app {
  font-family: Arial, serif;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom right, #f4f4f4 50%, white 50%);
}
</style>
