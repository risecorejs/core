export default function (configGlobalVariables: { [key: string]: any }) {
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
