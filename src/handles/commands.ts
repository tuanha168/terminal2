import CommandHistory from '@/constant/history'

const commands = {
  run: (input: string): string => {
    if (!input) return ''
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
      const output: string = commands[command as keyof typeof commands](command)

      return output
    }
    return commands.notfound(command)
  },
  help: () => {
    return `<span class="red">help</span>\t\tshow this document
<span class="red">about</span>\t\tabout me
<span class="red">history</span>\t\thistory
<span class="red">ls</span>\t\tlist directory
<span class="red">pwd</span>\t\tcurrent directory
`
  },
  ls: () => {
    return 'Nothing here'
  },
  pwd: () => {
    return '/home'
  },
  notfound: (input: string) => {
    return `Command not found: ${input}
Type <span class="red">help</span> for list commands`
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
  about: () => {
    return `I'm <span class="green">Ha Anh Tuan</span>, Communicator in Viet Nam, also a Front-End developer.`
  }
}

export default commands
