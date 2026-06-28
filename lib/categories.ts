import {
  Boxes,
  Bike,
  ChefHat,
  Shirt,
  Sparkles,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import type { Category, PriceUnit } from '@/types'
import type { Locale } from './translations'

export interface CategoryMeta {
  id: Category
  label: string
  labelRu: string
  labelUz: string
  icon: LucideIcon
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'food', label: 'Food', labelRu: 'Еда', labelUz: 'Taom', icon: ChefHat },
  { id: 'laundry', label: 'Laundry', labelRu: 'Стирка', labelUz: 'Kir yuvish', icon: Shirt },
  { id: 'delivery', label: 'Delivery', labelRu: 'Доставка', labelUz: 'Yetkazib berish', icon: Bike },
  { id: 'moving', label: 'Moving', labelRu: 'Переезд', labelUz: "Ko'chish", icon: Truck },
  { id: 'cleaning', label: 'Cleaning', labelRu: 'Уборка', labelUz: 'Tozalash', icon: Sparkles },
  { id: 'other', label: 'Other', labelRu: 'Другое', labelUz: 'Boshqa', icon: Boxes },
]

export function getCategory(id: Category): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]
}

export function getCategoryLabel(meta: CategoryMeta, locale: Locale = 'en'): string {
  if (locale === 'ru') return meta.labelRu
  if (locale === 'uz') return meta.labelUz
  return meta.label
}

export function formatUZS(amount: number): string {
  return `${new Intl.NumberFormat('en-US').format(amount)} UZS`
}

export function priceUnitLabel(unit: PriceUnit, locale: Locale = 'en'): string {
  const labels: Record<PriceUnit, Record<Locale, string>> = {
    per_hour: { en: '/ hour', ru: '/ час', uz: '/ soat' },
    per_item: { en: '/ item', ru: '/ шт.', uz: '/ dona' },
    fixed: { en: '', ru: '', uz: '' },
  }
  return labels[unit]?.[locale] ?? labels[unit]?.en ?? ''
}

export function formatPrice(amount: number, unit: PriceUnit, locale: Locale = 'en'): string {
  return `${formatUZS(amount)} ${priceUnitLabel(unit, locale)}`.trim()
}
