import CommandHistory from './history'

const output = [
  '           _                         ',
  '  _____   (_)  _____   ____     ____ ',
  ' / ___/  / /  / ___/  / __ \\   / __ \\',
  '/ /__   / /  / /     / / / /  / /_/ /',
  '\\___/  /_/  /_/     /_/ /_/   \\____/ '
]
  .join('<br/>')
  .replace(/\s/g, '&nbsp;')

const INIT_MESSAGE: CommandHistory = {
  id: 0,
  val: '',
  output
}

export default INIT_MESSAGE
