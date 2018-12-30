function noop(msg: string) {}

export let warn = noop
export let debug = noop

if (process.env.NODE_ENV !== 'production') {
  warn = msg => console.warn(`[gitree]: ${msg}`)
  debug = msg => console.warn(`[gitree]: ${msg}`)
}
