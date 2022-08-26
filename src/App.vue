<template>
  <Terminal />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Terminal from './components/TerminalComponent.vue'

export default defineComponent({
  name: 'App',
  components: {
    Terminal
  }
})
</script>

<style>
html {
  background-color: #222;
}
#app {
  font-family: CaskadiaCode Nerd Font, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  font-size: 1.5em;
  font-weight: 900;
  margin: 10vh 15% 40vh 15%;
}
</style>
