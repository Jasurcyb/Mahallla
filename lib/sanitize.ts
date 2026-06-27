import type { Category, PriceUnit, OrderStatus } from '@/types'

/**
 * Sanitizes input string to prevent XSS/injection by removing HTML tags.
 */
export function sanitizeString(val: unknown, maxLength = 1000): string {
  if (typeof val !== 'string') return ''
  const clean = val.replace(/<[^>]*>/g, '').trim()
  return clean.slice(0, maxLength)
}

/**
 * Validates alphanumeric ID strings (with optional hyphens).
 */
export function isValidId(id: unknown): boolean {
  if (typeof id !== 'string') return false
  return /^[a-zA-Z0-9\-]{1,50}$/.test(id)
}

/**
 * Validates Category enum.
 */
export function isValidCategory(val: unknown): val is Category {
  const allowed: Category[] = ['food', 'laundry', 'delivery', 'moving', 'cleaning', 'other']
  return typeof val === 'string' && allowed.includes(val as Category)
}

/**
 * Validates PriceUnit enum.
 */
export function isValidPriceUnit(val: unknown): val is PriceUnit {
  const allowed: PriceUnit[] = ['per_hour', 'per_item', 'fixed']
  return typeof val === 'string' && allowed.includes(val as PriceUnit)
}

/**
 * Validates OrderStatus enum.
 */
export function isValidOrderStatus(val: unknown): val is OrderStatus {
  const allowed: OrderStatus[] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
  return typeof val === 'string' && allowed.includes(val as OrderStatus)
}

/**
 * Validates positive integers.
 */
export function isValidPositiveInteger(val: unknown, maxVal = 100000000): boolean {
  const num = Number(val)
  return Number.isInteger(num) && num > 0 && num <= maxVal
}
