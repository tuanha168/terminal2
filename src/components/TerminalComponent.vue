<template>
  <div class="terminal">
    <OutputComponent :history="history" />
    <div class="input-area">
      ~ {{ userInput.replace(/\s/g, '&nbsp;') }}
      <div class="cursor" ref="cursor"></div>
    </div>
    <input ref="input" type="text" v-model="userInput" maxlength="50" />
  </div>
</template>

<script setup lang="ts">
import OutputComponent from './OutputComponent.vue'
import CommandHistory from '../constant/history'
import { ref, defineExpose, onMounted } from 'vue'

const userInput = ref<string>('')
const history = ref<Array<CommandHistory>>([
  {
    id: 0,
    val: 'haha'
  }
])
const input = ref<HTMLInputElement>()
const cursor = ref<HTMLInputElement>()

const submit = () => {
  const val: CommandHistory = {
    id: history.value.length,
    val: userInput.value,
    output: ''
  }
  history.value.push(val)
  userInput.value = ''
}

const moveCursor = (key: string) => {
  const cur = cursor.value
  if (!cur) return
  switch (true) {
    case /^Enter$/g.test(key):
    case /^ArrowUp$/g.test(key):
      cur.style.left = '23px'
      break
    case /^[\w\s]$/g.test(key):
      if (userInput.value.length < 50) {
        console.log(userInput.value.length)
      }
      break
    default:
      break
  }
}

const pressedEvent = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    submit()
    focusInput()
  }
  if (e.altKey || e.ctrlKey || e.metaKey) {
    return
  }
  moveCursor(e.key)
  console.log(e.key)
}

const focusInput = () => {
  input.value?.focus()
  input.value?.scrollIntoView()
}

onMounted(() => {
  focusInput()
  input.value?.addEventListener('keydown', pressedEvent)
  const html = document.querySelector('html')
  html?.addEventListener('click', focusInput)
})

defineExpose({
  userInput,
  history
})
</script>

<style scoped>
.input-area {
  word-break: break-all;
  position: relative;
}
.cursor {
  position: absolute;
  content: '';
  width: 0.7rem;
  height: 90%;
  background-color: #ddd;
  opacity: 0.5;
  top: 0;
  left: 1.5rem;
  animation: blinking 1.5s infinite;
}
input {
  opacity: 0;
  width: 0;
  height: 0;
}

@keyframes blinking {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 0.5;
  }
}
</style>
