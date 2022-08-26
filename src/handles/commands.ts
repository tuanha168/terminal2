import CommandHistory from '@/constant/history'

const commands = {
  run: (input: string): string => {
    if (!input) return ''
    const [command, ...args] = input.split(' ')
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
      const output: string = commands[command as keyof typeof commands](
        command,
        args
      )

      return output
    }
    return commands.notfound(command)
  },
  ls: () => {
    const ls: Record<string, unknown> = JSON.parse(
      localStorage.getItem('dir') || '{}'
    )
    let output = 'làm gì có gì :|'
    if (Object.keys(ls).length > 0) output = Object.keys(ls).join('\t\t')
    return output
  },
  mkdir: (_: string, args: Array<string>) => {
    const ls: Record<string, unknown> = JSON.parse(
      localStorage.getItem('dir') || '{}'
    )
    const pwd: string = commands.pwd()
    args.forEach((dir: string) => {
      ls[dir] = {}
    })
    localStorage.setItem('dir', JSON.stringify(ls))
    console.log({ ls, pwd, args })
  },
  rm: (_: string, args: Array<string>) => {
    const ls: Record<string, unknown> = JSON.parse(
      localStorage.getItem('dir') || '{}'
    )
    const pwd: string = commands.pwd()

    if (args.some((it) => it.includes('-'))) return 'not support'

    for (const dir of args) {
      delete ls[dir]
    }
    localStorage.setItem('dir', JSON.stringify(ls))
  },
  pwd: () => {
    return localStorage.getItem('pwd') || ''
  },
  cd: (_: string, args: Array<string>) => {
    localStorage.setItem('pwd', args[0])
    return ''
  },
  notfound: (input: string) => {
    return `command not found: ${input}`
  },
  help: () => {
    return `ls\t\tlist directory
help\t\thelp`
  },
  history: () => {
    const history = JSON.parse(localStorage.getItem('history') || '')
    const output = history
      .filter(
        (it: CommandHistory) =>
          it.val && !it.output?.includes('not found') && it.val !== 'history'
      )
      .map((it: CommandHistory, idx: number) => idx + 1 + ':  ' + it.val)
      .join('<br />')
    return output
  }
}

export default commands
