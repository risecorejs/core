import { IFields } from '../interfaces'

export default function (configGlobalVariables: IFields) {
  global.$ = {}

  for (const [key, value] of Object.entries(configGlobalVariables)) {
    $[key] = value
  }
}

declare global {
  export var $: {
    [key: string]: any
  }
}
