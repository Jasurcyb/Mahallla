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

export interface CategoryMeta {
  id: Category
  label: string
  labelUz: string
  icon: LucideIcon
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'food', label: 'Food', labelUz: 'Taom', icon: ChefHat },
  { id: 'laundry', label: 'Laundry', labelUz: 'Kir yuvish', icon: Shirt },
  { id: 'delivery', label: 'Delivery', labelUz: 'Yetkazib berish', icon: Bike },
  { id: 'moving', label: 'Moving', labelUz: "Ko'chish", icon: Truck },
  { id: 'cleaning', label: 'Cleaning', labelUz: 'Tozalash', icon: Sparkles },
  { id: 'other', label: 'Other', labelUz: 'Boshqa', icon: Boxes },
]

export function getCategory(id: Category): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]
}

export function formatUZS(amount: number): string {
  return `${new Intl.NumberFormat('en-US').format(amount)} UZS`
}

export function priceUnitLabel(unit: PriceUnit): string {
  switch (unit) {
    case 'per_hour':
      return '/ hour'
    case 'per_item':
      return '/ item'
    default:
      return ''
  }
}

export function formatPrice(amount: number, unit: PriceUnit): string {
  return `${formatUZS(amount)} ${priceUnitLabel(unit)}`.trim()
}
