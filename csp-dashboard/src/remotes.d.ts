import { type Plugin } from './csp-plugin'

declare module 'csp-ciam-plugins/customer-search' {
  export default Plugin
}

declare module 'csp-ciam-plugins/customer-timeline' {
  export default Plugin
}

declare global {
  interface Window {
    plugins?: Record<string, Plugin>
  }
}

export {}
