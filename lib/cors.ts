/**
 * CORS Same-Origin validation helper.
 * Ensures request origin and referer match the host domain to prevent CSRF.
 */
export function verifySameOrigin(request: Request): boolean {
  const host = request.headers.get('host')
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  const requestUrl = new URL(request.url)
  const expectedHost = host || requestUrl.host

  if (origin) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== expectedHost) {
        return false
      }
    } catch {
      return false
    }
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).host
      if (refererHost !== expectedHost) {
        return false
      }
    } catch {
      return false
    }
  }

  return true
}
