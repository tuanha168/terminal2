<template>
  <div
    v-for="(item, idx) in history"
    :key="idx"
    :class="{ 'has-output': item.output, 'first-output': idx === 0 }"
  >
    <span v-if="idx !== 0" :innerHTML="`${pwd} ${item.val}`"></span>
    <br />
    <span :innerHTML="`${item.output || ''}`"></span>
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
.first-output {
  margin-bottom: 50px;
}
</style>
