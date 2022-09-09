<template>
  <div class="terminal">
    <OutputComponent :pwd="pwd" :history="history" />
    <div class="input-area">
      {{ pwd?.replace('/home', '~') }}
      <span
        class="characters"
        v-if="userInput.length === 0"
        style="color: transparent"
      >
        1
        <div class="cursor default-cursor"></div>
      </span>
      <span
        :class="{
          'cursor-on': currentPos === idx || (idx === 0 && currentPos === 0)
        }"
        class="characters"
        v-for="(character, idx) in userInput"
        :key="idx"
      >
        {{ character.replace(/\s/g, '&nbsp;') }}
        <div
          :class="{ 'first-cursor': currentPos === 0 }"
          class="cursor"
          v-show="currentPos - 1 === idx || (idx === 0 && currentPos === 0)"
        ></div>
      </span>
      <p style="font-weight: normal; margin: 0" v-if="loading">loading...</p>
    </div>
    <input
      ref="input"
      type="text"
      v-model="userInput"
      :disabled="loading"
      @keydown="pressedEvent"
    />
  </div>
</template>

<script setup lang="ts">
import OutputComponent from '@/components/OutputComponent.vue'
import commands from '@/handles/commands'
import CommandHistory from '@/constant/history'
import INIT_MESSAGE from '@/constant/initMessage'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const userInput = ref<string>('')
const currrentInput = ref<string>('')
const currentPos = ref<number>(0)
const currentHistory = ref<number>(1)
const loopThroughHistory = ref<boolean>(false)
const flagHistory = ref<boolean>(false)
const flagCompletion = ref<boolean>(false)
const loading = ref<boolean>(false)
const input = ref<HTMLInputElement>()
const history = ref<Array<CommandHistory>>([INIT_MESSAGE])
const pwd = ref<string>('/home')

const submit = async (isCommand = true) => {
  if (/^!(\d+)$/.test(userInput.value)) {
    flagHistory.value = true
    userInput.value = await commands.run(userInput.value, isCommand)
    return
  }
  let output = ''
  if (userInput.value === 'clear') {
    history.value = [INIT_MESSAGE]
  } else {
    loading.value = true
    output = await commands.run(userInput.value, isCommand)
    loading.value = false
    setTimeout(() => {
      input.value?.scrollIntoView({ behavior: 'smooth' })
    })
  }
  const val: CommandHistory = {
    id: history.value.length,
    val: userInput.value.trimStart().replace(/\s/g, '&nbsp;'),
    output
  }
  if (userInput.value !== 'clear') history.value.push(val)
  const localHistory = [
    ...JSON.parse(localStorage.getItem('history') || '[]'),
    val
  ]
  localStorage.setItem('history', JSON.stringify(localHistory))
  userInput.value = ''
  if (flagHistory.value) return
  flagHistory.value = false
}

const moveCursor = (key: string) => {
  switch (true) {
    case /^Enter$/g.test(key):
      currentPos.value = userInput.value.length
      flagCompletion.value = false
      break
    case /^ArrowUp$/g.test(key):
      if (userInput.value.length === 0 || loopThroughHistory.value) {
        loopThroughHistory.value = true
        getHistory()
      } else {
        currentPos.value = 0
      }
      flagCompletion.value = false
      break
    case /^Backspace$/g.test(key):
      if (currentPos.value > 0) {
        currentPos.value--
      }
      loopThroughHistory.value = false
      flagCompletion.value = false
      break
    case /^ArrowLeft$/g.test(key):
      if (currentPos.value <= userInput.value.length && currentPos.value > 0) {
        currentPos.value--
      }
      loopThroughHistory.value = false
      flagCompletion.value = false
      break
    case /^ArrowDown$/g.test(key):
      currentPos.value = userInput.value.length
      loopThroughHistory.value = false
      flagCompletion.value = false
      break
    case /^ArrowRight$/g.test(key):
    case /^.$/g.test(key):
      if (currentPos.value < userInput.value.length && currentPos.value >= 0) {
        currentPos.value++
      }
      loopThroughHistory.value = false
      flagCompletion.value = false
      break
    default:
      break
  }
}

const getHistory = () => {
  let lastHistory = history.value[currentHistory.value - 1]
  while (!lastHistory.val) {
    currentHistory.value--
    lastHistory = history.value[currentHistory.value - 1]
    if (currentHistory.value < 1) {
      lastHistory = history.value[0]
      currentHistory.value = history.value.length
      break
    }
  }
  userInput.value = lastHistory.val
  currentPos.value = userInput.value.length
  currentHistory.value--
  if (currentHistory.value < 1) {
    currentHistory.value = history.value.length
  }
}

const pressedEvent = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    if (!flagCompletion.value) {
      currrentInput.value = userInput.value
      flagCompletion.value = true
    }
    userInput.value = commands.tabCompletions(currrentInput.value) || ''
  }
  if (e.ctrlKey && e.key === 'c') {
    return breakCommand()
  }
  if (
    e.metaKey ||
    e.altKey ||
    e.ctrlKey ||
    (e.shiftKey && e.key.length !== 1)
  ) {
    return
  }
  if (e.key === 'Enter') {
    submit()
    currentHistory.value = history.value.length
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
  }

  if ((e.key === 'a' || e.key === 'v') && (e.ctrlKey || e.metaKey)) {
    setTimeout(() => {
      currentPos.value = userInput.value.length
    })
  }

  setTimeout(() => {
    moveCursor(e.key)
  })
}

const breakCommand = () => {
  submit(false)
}

const focusInput = (e?: KeyboardEvent) => {
  if (document.activeElement !== input.value) {
    input.value?.focus({
      preventScroll: true
    })
    setTimeout(() => {
      moveCursor(e?.key || '')
    })
  }
}

onMounted(() => {
  focusInput()
  localStorage.setItem('pwd', '/home')
  const html = document.querySelector('html')
  html?.addEventListener('keydown', focusInput, true)
})

onBeforeUnmount(() => {
  const html = document.querySelector('html')
  html?.removeEventListener('keydown', focusInput, true)
})
</script>

<style scoped>
.input-area {
  position: relative;
}
.characters,
.default-characters {
  width: fit-content;
  display: inline-block;
  position: relative;
}
.cursor {
  position: absolute;
  content: '';
  width: 100%;
  height: 90%;
  background-color: #ddd;
  opacity: 0.5;
  top: 0;
  left: 100%;
  animation: blinking 1.5s infinite;
}
.cursor-on {
  filter: invert(100%);
}
.cursor-on > .cursor {
  filter: invert(100%);
}
.default-cursor,
.first-cursor {
  left: 0;
}
input {
  opacity: 0;
  width: 0;
  height: 0;
}

@keyframes blinking {
  0% {
    opacity: 0.8;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 0.8;
  }
}
</style>
