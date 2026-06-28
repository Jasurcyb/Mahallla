import { listServices } from './dynamodb'
import type { Category, PriceSuggestion, Service } from '@/types'

/**
 * AI helpers for Mahalla, powered by Google Gemini (`gemini-2.0-flash`).
 *
 * `suggestPrice` recommends a fair price in UZS for the Uzbekistan market, and
 * `analyzeRequest` parses free-text requests (Russian or Uzbek) into a service
 * category, keywords, price range, and urgency. Both call the Gemini REST API
 * via `fetch` and fall back to local keyword heuristics if `GEMINI_API_KEY` is
 * missing or the request fails, so the public return shapes never change.
 */

const GEMINI_MODEL = 'gemma-4-31b-it'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const ALL_CATEGORIES: Category[] = [
  'food',
  'laundry',
  'delivery',
  'moving',
  'cleaning',
  'other',
]

interface CategoryPricing {
  category: Category
  min: number
  max: number
  suggested: number
  note: string
}

const PRICING: Record<Category, CategoryPricing> = {
  food: {
    category: 'food',
    min: 15000,
    max: 45000,
    suggested: 25000,
    note: 'Home-cooked meals in this area typically range per portion, depending on ingredients like meat.',
  },
  laundry: {
    category: 'laundry',
    min: 10000,
    max: 25000,
    suggested: 15000,
    note: 'Laundry is usually priced per kilogram or per item with same-day service.',
  },
  delivery: {
    category: 'delivery',
    min: 5000,
    max: 20000,
    suggested: 10000,
    note: 'Short neighborhood courier runs are inexpensive; longer cross-city trips cost more.',
  },
  moving: {
    category: 'moving',
    min: 40000,
    max: 90000,
    suggested: 50000,
    note: 'Moving help is charged hourly and depends on the number of helpers and vehicle size.',
  },
  cleaning: {
    category: 'cleaning',
    min: 50000,
    max: 120000,
    suggested: 80000,
    note: 'Home cleaning is priced by apartment size; deep cleans and windows cost extra.',
  },
  other: {
    category: 'other',
    min: 10000,
    max: 60000,
    suggested: 30000,
    note: 'General neighborhood help varies widely with task complexity and time required.',
  },
}

// Multipliers reflecting relative cost of living between cities.
const CITY_FACTOR: Record<string, number> = {
  tashkent: 1.25,
  samarkand: 1.05,
  fergana: 1,
  bukhara: 1,
  andijan: 0.95,
}

const KEYWORDS: Record<Category, string[]> = {
  food: [
    'plov',
    'palov',
    'палов',
    'osh',
    'taom',
    'food',
    'еда',
    'samsa',
    'самса',
    'non',
    'нон',
    'bread',
    'cook',
    'пиш',
    'lagman',
    'manti',
    'манты',
    'dinner',
    'lunch',
    'meal',
    'обед',
    'ужин',
  ],
  laundry: [
    'laundry',
    'wash',
    'ювиш',
    'кир',
    'стир',
    'iron',
    'дазмол',
    'clothes',
    'кийим',
    'одежд',
  ],
  delivery: [
    'delivery',
    'courier',
    'курьер',
    'доставка',
    'yetkaz',
    'deliver',
    'parcel',
    'посылк',
    'pick up',
    'pickup',
  ],
  moving: [
    'moving',
    'move',
    'кўчиш',
    'ko‘chish',
    'kochish',
    'переезд',
    'грузч',
    'furniture',
    'мебель',
    'lift',
    'truck',
    'van',
    'юк',
  ],
  cleaning: [
    'clean',
    'тозалаш',
    'уборк',
    'cleaning',
    'tozala',
    'mop',
    'house clean',
    'квартир',
    'window',
    'окн',
  ],
  other: [],
}

const URGENCY_WORDS: { high: string[]; low: string[] } = {
  high: [
    'now',
    'today',
    'urgent',
    'asap',
    'срочно',
    'сейчас',
    'hozir',
    'tezda',
    'immediately',
    'бугун',
  ],
  low: ['someday', 'next week', 'no rush', 'не срочно', 'когда удобно', 'keyin'],
}

/* --------------------------- Gemini transport --------------------------- */

/**
 * Calls Gemini and returns the first candidate's text, or `null` on any
 * failure (missing key, network error, non-OK response, empty body).
 */
async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!res.ok) {
      console.warn('AI request failed')
      return null
    }

    const data = await res.json()
    // Reasoning models (e.g. gemma-4) return multiple parts: a thought
    // block (thought: true) followed by the actual response. We must
    // skip the thought part and extract the real answer.
    const parts: Array<{ text?: string; thought?: boolean }> =
      data?.candidates?.[0]?.content?.parts ?? []
    const responsePart = parts.find((p) => !p.thought)
    const text = responsePart?.text ?? parts[0]?.text
    return text ?? null
  } catch (err) {
    console.warn('AI request encountered an error')
    return null
  }
}

/** Parse a JSON object out of a model response, tolerating code fences. */
function parseJson<T>(text: string | null): T | null {
  if (!text) return null
  try {
    return JSON.parse(text) as T
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0]) as T
      } catch {
        return null
      }
    }
    return null
  }
}

/* ------------------------------ Price ------------------------------ */

export async function suggestPrice(
  serviceType: string,
  city: string,
): Promise<PriceSuggestion> {
  const cityName = city.trim() || 'Fergana'
  const prompt = `You are a pricing assistant for "Mahalla", a hyperlocal neighborhood services marketplace in Uzbekistan. All prices are in Uzbekistani so'm (UZS).

A provider wants to offer this service: "${serviceType}"
City: ${cityName}

Suggest a fair market price in UZS for a single unit/portion of this service, reflecting realistic ${cityName} prices and local cost of living. Consider that home-cooked meals are ~15,000-45,000 UZS, laundry ~10,000-25,000 UZS, courier runs ~5,000-20,000 UZS, cleaning ~50,000-120,000 UZS, and moving help ~40,000-90,000 UZS per hour.

Respond with ONLY a JSON object in exactly this shape (numbers are integers in UZS, no separators):
{
  "minPrice": <integer>,
  "maxPrice": <integer>,
  "suggested": <integer>,
  "reasoning": "<one or two sentences explaining the price, written for the provider>"
}`

  const parsed = parseJson<Partial<PriceSuggestion>>(await callGemini(prompt))

  if (
    parsed &&
    typeof parsed.minPrice === 'number' &&
    typeof parsed.maxPrice === 'number' &&
    typeof parsed.suggested === 'number' &&
    typeof parsed.reasoning === 'string'
  ) {
    const round = (n: number) => Math.max(0, Math.round(n / 100) * 100)
    return {
      minPrice: round(parsed.minPrice),
      maxPrice: round(parsed.maxPrice),
      suggested: round(parsed.suggested),
      reasoning: parsed.reasoning,
    }
  }

  return heuristicPrice(serviceType, cityName)
}

function heuristicPrice(serviceType: string, city: string): PriceSuggestion {
  const category = detectCategory(serviceType)
  const base = PRICING[category]
  const factor = CITY_FACTOR[city.trim().toLowerCase()] ?? 1
  const round = (n: number) => Math.round(n / 1000) * 1000
  const suggested = round(base.suggested * factor)
  const cityName = city.trim() || 'your area'
  return {
    minPrice: round(base.min * factor),
    maxPrice: round(base.max * factor),
    suggested,
    reasoning: `${base.note} Based on typical ${category} rates in ${cityName}, a fair price is around ${new Intl.NumberFormat('en-US').format(suggested)} UZS.`,
  }
}

/* ------------------------------ Matching ------------------------------ */

export async function analyzeRequest(text: string): Promise<{
  category: Category
  keywords: string[]
  priceRange: { min: number; max: number }
  urgency: 'low' | 'medium' | 'high'
}> {
  const prompt = `You are a request parser for "Mahalla", a hyperlocal neighborhood services marketplace in Uzbekistan. Users describe what help they need in Russian, Uzbek, or English.

User request: "${text}"

Classify the request and respond with ONLY a JSON object in exactly this shape:
{
  "category": one of ["food","laundry","delivery","moving","cleaning","other"],
  "keywords": [up to 6 short lowercase keywords extracted from the request, in their original language],
  "urgency": one of ["low","medium","high"]
}

Category meanings: food = home-cooked meals / baking; laundry = washing & ironing clothes; delivery = courier / picking up & dropping off items; moving = relocation & heavy lifting; cleaning = house cleaning; other = anything else. Urgency: high if they need it today/now/urgently, low if there is no rush, otherwise medium.`

  const parsed = parseJson<{
    category?: string
    keywords?: unknown
    urgency?: string
  }>(await callGemini(prompt))

  if (parsed) {
    const category: Category = ALL_CATEGORIES.includes(
      parsed.category as Category,
    )
      ? (parsed.category as Category)
      : detectCategory(text)

    const keywords = Array.isArray(parsed.keywords)
      ? (parsed.keywords as unknown[])
          .filter((k): k is string => typeof k === 'string')
          .map((k) => k.toLowerCase().trim())
          .filter(Boolean)
          .slice(0, 6)
      : extractKeywords(text)

    const urgency: 'low' | 'medium' | 'high' =
      parsed.urgency === 'low' ||
      parsed.urgency === 'medium' ||
      parsed.urgency === 'high'
        ? parsed.urgency
        : detectUrgency(text)

    const base = PRICING[category]
    return {
      category,
      keywords: keywords.length > 0 ? keywords : extractKeywords(text),
      priceRange: { min: base.min, max: base.max },
      urgency,
    }
  }

  // Fallback: local heuristics.
  const category = detectCategory(text)
  const base = PRICING[category]
  return {
    category,
    keywords: extractKeywords(text),
    priceRange: { min: base.min, max: base.max },
    urgency: detectUrgency(text),
  }
}

/* -------------------- Local heuristics (fallback) -------------------- */

export function detectCategory(text: string): Category {
  const lower = text.toLowerCase()
  let best: Category = 'other'
  let bestScore = 0
  for (const cat of Object.keys(KEYWORDS) as Category[]) {
    const score = KEYWORDS[cat].reduce(
      (acc, kw) => (lower.includes(kw.toLowerCase()) ? acc + 1 : acc),
      0,
    )
    if (score > bestScore) {
      bestScore = score
      best = cat
    }
  }
  return best
}

export function extractKeywords(text: string): string[] {
  const stop = new Set([
    'the',
    'and',
    'for',
    'with',
    'need',
    'want',
    'мне',
    'нужно',
    'надо',
    'menga',
    'kerak',
    'please',
    'some',
    'a',
    'an',
    'to',
  ])
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stop.has(w)),
    ),
  ).slice(0, 6)
}

export function detectUrgency(text: string): 'low' | 'medium' | 'high' {
  const lower = text.toLowerCase()
  if (URGENCY_WORDS.high.some((w) => lower.includes(w))) return 'high'
  if (URGENCY_WORDS.low.some((w) => lower.includes(w))) return 'low'
  return 'medium'
}

export async function smartMatch(text: string): Promise<Service[]> {
  const analysis = await analyzeRequest(text)
  const services = await listServices()
  
  const lower = text.toLowerCase()
  const ranked = services
    .map((s) => {
      let score = 0
      if (s.category === analysis.category) score += 5
      for (const kw of analysis.keywords) {
        if (
          s.title.toLowerCase().includes(kw) ||
          s.description.toLowerCase().includes(kw)
        ) {
          score += 2
        }
      }
      if (lower.includes(s.title.toLowerCase())) score += 3
      score += s.rating / 2
      score -= s.distanceKm / 10
      return { service: s, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.service)

  return ranked
}
