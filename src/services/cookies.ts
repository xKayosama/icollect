import Cookies from 'js-cookie'

export type CookieOptions = Pick<
  Cookies.CookieAttributes,
  'expires' | 'path' | 'domain' | 'secure' | 'sameSite'
>

const preferenceCookies = Cookies.withAttributes({
  path: '/',
  sameSite: 'lax',
  secure: import.meta.env.PROD,
})

/** For non-sensitive preferences only. HttpOnly auth cookies belong to the server. */
export const cookies = {
  get(name: string): string | undefined {
    return preferenceCookies.get(name)
  },
  set(name: string, value: string, options?: CookieOptions): void {
    preferenceCookies.set(name, value, options)
  },
  // Use the same path/domain options used when setting the cookie.
  remove(name: string, options?: CookieOptions): void {
    preferenceCookies.remove(name, options)
  },
}
