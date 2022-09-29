import { env } from '@risecorejs/helpers'

export default function () {
  global.$getController = (controllerPath: string) => (method: string) => controllerPath + '.' + method
  global.$env = env
}

declare global {
  export var $getController: (controllerPath: string) => (method: string) => string
  export var $env: (key: string, defaultValue?: any) => any
}
