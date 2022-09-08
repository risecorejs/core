export default function (globalVariables: { [key: string]: any }) {
  global.$ = {}

  for (const [key, value] of Object.entries(globalVariables)) {
    $[key] = value
  }
}

declare global {
  export var $: {
    [key: string]: any
  }
}
