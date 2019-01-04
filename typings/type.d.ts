declare module NodeJS {
  interface Global {
    browser: any
  }
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
