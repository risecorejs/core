export default function (variables: { [key: string]: any }) {
  global.$ = {}

  for (const [key, value] of Object.entries(variables)) {
    $[key] = value
  }
}

declare global {
  export var $: {
    [key: string]: any
  }
}
