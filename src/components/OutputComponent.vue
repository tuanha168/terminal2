<template>
  <div
    v-for="(item, idx) in history"
    :key="idx"
    :class="{ 'has-output': item.output, 'first-output': idx === 0 }"
  >
    <span
      v-if="idx !== 0"
      :innerHTML="`${pwd?.replace('/home', '~')} ${item.val}`"
    ></span>
    <br />
    <span class="output" :innerHTML="`${item.output || ''}`"></span>
  </div>
</template>

<script setup lang="ts">
import CommandHistory from '../constant/history'
import { defineProps, defineExpose, PropType } from 'vue'

const props = defineProps({
  history: {
    type: Array as PropType<Array<CommandHistory>>
  },
  pwd: String || null
})

defineExpose({
  history: props.history
})
</script>

<style scoped>
.has-output {
  white-space: pre-wrap;
  word-break: break-word;
}
.output {
  font-weight: normal !important;
}
.first-output {
  margin-bottom: 50px;
}
</style>
