export type Category =
  | 'food'
  | 'laundry'
  | 'delivery'
  | 'moving'
  | 'cleaning'
  | 'other'

export type PriceUnit = 'per_hour' | 'per_item' | 'fixed'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface Service {
  serviceId: string
  providerId: string
  providerName: string
  providerAvatar: string
  title: string
  description: string
  category: Category
  price: number
  priceUnit: PriceUnit
  rating: number
  reviewCount: number
  location: string
  city: string
  distanceKm: number
  available: boolean
  createdAt: string
}

export interface Order {
  orderId: string
  customerId: string
  customerName: string
  serviceId: string
  serviceTitle: string
  providerId: string
  providerName: string
  category: Category
  status: OrderStatus
  scheduledDate: string
  scheduledTime: string
  quantity: number
  totalPrice: number
  notes: string
  createdAt: string
}

export interface Review {
  reviewId: string
  serviceId: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

export interface User {
  userId: string
  name: string
  avatar: string
  phone: string
  city: string
  rating: number
  completedOrders: number
  isProvider: boolean
  categories: Category[]
  joinedAt: string
}

export interface PriceSuggestion {
  minPrice: number
  maxPrice: number
  suggested: number
  reasoning: string
}

export interface MatchResult {
  category: Category
  keywords: string[]
  priceRange: { min: number; max: number }
  urgency: 'low' | 'medium' | 'high'
  services: Service[]
}
