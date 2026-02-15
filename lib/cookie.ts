export interface CookieOptions {
  path?: string
  maxAge?: number
  expires?: Date
  secure?: boolean
  sameSite?: "lax" | "strict" | "none"
}

export const cookie = {
  get(name: string): string | null {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
    return null
  },

  set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === "undefined") return

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (options.path) {
      cookieString += `; path=${options.path}`
    } else {
      cookieString += "; path=/"
    }

    if (options.maxAge !== undefined) {
      cookieString += `; max-age=${options.maxAge}`
    }

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`
    }

    if (options.secure !== false) {
      cookieString += "; secure"
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`
    } else {
      cookieString += "; samesite=lax"
    }

    // biome-ignore lint/suspicious/noDocumentCookie: This is the centralized cookie utility
    document.cookie = cookieString
  },

  remove(name: string, options: CookieOptions = {}): void {
    this.set(name, "", {
      ...options,
      maxAge: -1,
      expires: new Date(0),
    })
  },
}
