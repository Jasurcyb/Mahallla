const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

/**
 * Simple in-memory rate limiting check.
 * Max 10 requests per minute per IP.
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = 10
  const windowMs = 60 * 1000 // 1 minute

  // Periodic cleanup of expired entries to prevent memory leaks
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetTime) {
      rateLimitMap.delete(key)
    }
  }

  const record = rateLimitMap.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}
