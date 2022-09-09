import { env } from '@risecorejs/helpers'

export default function () {
  global.$controller = (controllerPath: string) => (method: string) => controllerPath + '.' + method
  global.$env = env
}

declare global {
  export var $controller: (controllerPath: string) => (method: string) => string
  export var $env: (key: string, defaultValue?: any) => any
}
