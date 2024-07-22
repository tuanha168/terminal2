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
  /* scroll-behavior: smooth; */
}

#app {
  word-break: break-all;
  font-family: monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  font-size: 21px;
  font-weight: 900;
  margin: 10vh 15% 40vh 15%;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media screen and (max-width: 768px) {
  #app {
    font-size: 15px;
  }
}

@media screen and (max-width: 576px) {
  #app {
    font-size: 9px;
  }
}
.red {
  color: red;
}
.blue {
  color: blue;
}
.green {
  color: green;
}
/* @font-face { */
/*   font-family: 'CaskaydiaCove Nerd Font'; */
/*   src: local('CaskaydiaCove Nerd Font'), url('./assets/Caskaydia.ttf'), */
/*     format('truetype'); */
/* } */
pre {
  font-size: 75%;
  font-family: 'Source Code Pro', 'DejaVu Sans Mono', Menlo,
    'Lucida Sans Typewriter', 'Lucida Console', monaco,
    'Bitstream Vera Sans Mono', monospace;
}
</style>
