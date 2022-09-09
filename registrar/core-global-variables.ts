import { env } from '@risecorejs/helpers'

export default function () {
  global.$controller = (filename: string) => (method: string) => filename + '.' + method
  global.$env = env
}

declare global {
  export var $controller: (filename: string) => (method: string) => string
  export var $env: (key: string, defaultValue?: any) => any
}
