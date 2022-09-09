import CommandHistory from '@/constant/history'
import axios from 'axios'

const axi = axios.create()

const commands = {
  run: async (input: string, isCommand = true): Promise<string> => {
    if (!input || !isCommand) return ''
    const [command] = input.split(' ')
    if (/^!(\d+)$/.test(command)) {
      const index: number = parseInt(/^!(\d+)$/.exec(command)?.[1] || '')
      const history = JSON.parse(localStorage.getItem('history') || '')
      const result = history.filter(
        (it: CommandHistory) =>
          it.val && !it.output?.includes('not found') && it.val !== 'history'
      )?.[index - 1]
      return result?.val || ''
    }
    if (typeof commands[command as keyof typeof commands] === 'function') {
      const output: string = await commands[command as keyof typeof commands](
        command
      )

      return output
    }
    return commands.notfound(command)
  },
  tabCompletions: (input: string) => {
    return Object.keys(commands).find((command) => command.includes(input))
  },
  notfound: (input: string) => {
    return `Command not found: ${input}
Type <span class="red">help</span> for list commands`
  },
  help: () => {
    return `<span class="red">help</span>\t\tview this document
<span class="red">whoami</span>\t\tabout me
<span class="red">weather</span>\t\ttoday weather
<span class="red">ip-address</span>\t\tshow your ip address
<span class="red">history</span>\t\tcommands history
<span class="red">clear</span>\t\tclear screen
`
  },
  history: () => {
    const history = JSON.parse(localStorage.getItem('history') as string)
    const output = history
      ?.filter(
        (it: CommandHistory) =>
          it.val && !it.output?.includes('not found') && it.val !== 'history'
      )
      .map((it: CommandHistory, idx: number) => idx + 1 + ':  ' + it.val)
      .join('<br />')
    return output
  },
  whoami: () => {
    return `I'm <span class="green">Ha Anh Tuan</span>, Communicator in Viet Nam, also a Front-End developer.`
  },
  weather: async () => {
    const res = await axi.get('https://wttr.in/')
    const el = document.createElement('html')
    el.innerHTML = res.data
    const style = el.querySelector('style[type="text/css"]')
    const pre = el.querySelector('pre')
    return `${style?.outerHTML}${pre?.outerHTML}
<span style="font-size: 0.7rem">source: <a href="https://wttr.in/" target="_blank">https://wttr.in/</a></span>`
  },
  'ip-address': async () => {
    const res = await axi.get('https://api.ipify.org?format=json')
    return `Your IP address is: ${res.data?.ip}`
  }
}

export default commands
