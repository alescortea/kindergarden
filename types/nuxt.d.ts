// Type declarations for Nuxt 3
declare global {
  interface ImportMeta {
    readonly client: boolean
    readonly server: boolean
    readonly dev: boolean
    readonly prod: boolean
    readonly test: boolean
  }

  // Auto-imported Nuxt composables and utilities (available globally)
  const navigateTo: (to: string | { path: string; query?: Record<string, any> }, options?: { replace?: boolean; external?: boolean }) => Promise<void> | void
  const useRouter: () => any
  const useRoute: () => any
  const useRuntimeConfig: () => any
  const ref: <T>(value: T) => { value: T }
  const computed: <T>(fn: () => T) => { value: T }
  const reactive: <T extends object>(obj: T) => T
  const watch: (source: any, callback: (newValue: any, oldValue: any) => void, options?: any) => () => void
  const onMounted: (hook: () => void) => void
  const onUnmounted: (hook: () => void) => void
  const $fetch: <T = any>(url: string, options?: any) => Promise<T>

  // Nitro/Server-side utilities
  const defineEventHandler: <T = any>(handler: (event: any) => T | Promise<T>) => (event: any) => T | Promise<T>
  const readMultipartFormData: (event: any) => Promise<Array<{ name?: string; filename?: string; type?: string; data: Buffer }> | undefined>
  const createError: (error: { statusCode: number; statusMessage?: string; data?: any }) => Error
  const readBody: <T = any>(event: any) => Promise<T>
  const getRouterParam: (event: any, name: string) => string | undefined
  const getQueryParam: (event: any, name: string) => string | undefined
}

export {}

