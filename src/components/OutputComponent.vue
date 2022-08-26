<template>
  <div v-for="(item, idx) in history" :key="idx">
    ~ {{ item.val }} <br />
    {{ item.output }}
  </div>
</template>

<script setup lang="ts">
import CommandHistory from '../constant/history'
import {
  defineProps,
  defineExpose,
  // toRef,
  onMounted,
  PropType
  // reactive,
} from 'vue'

const props = defineProps({
  history: {
    type: Array as PropType<Array<CommandHistory>>
  }
})

onMounted(() => {
  console.log('mounted')
})

defineExpose({
  history: props.history
})
</script>

<style scoped></style>
