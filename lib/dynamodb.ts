import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb'
import { awsCredentialsProvider } from '@vercel/functions/oidc'
import type { Order, Review, Service, User } from '@/types'

/**
 * Data access layer for Mahalla, backed by Amazon DynamoDB.
 *
 * A single-table design is used: every item shares one partition key
 * (`DYNAMODB_TABLE_PARTITION_KEY`, default `id`) holding its natural id, plus an
 * `entityType` attribute (`service` | `order` | `user` | `review`) used to scan
 * for a given collection. The seed data below is written to the table once, on
 * first access, if the table is empty — so the app works out of the box without
 * a separate seeding script.
 */

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME
const PK = process.env.DYNAMODB_TABLE_PARTITION_KEY || 'id'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : awsCredentialsProvider({
          roleArn: process.env.AWS_ROLE_ARN as string,
          clientConfig: { region: process.env.AWS_REGION },
        }),
})

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
})

type EntityType = 'service' | 'order' | 'user' | 'review'

const CURRENT_USER_ID = 'user-customer'

const seedUsers: User[] = [
  {
    userId: 'user-customer',
    name: 'Aziza Karimova',
    avatar: '/avatars/aziza.png',
    phone: '+998 90 123 45 67',
    city: 'Fergana',
    rating: 4.9,
    completedOrders: 23,
    isProvider: false,
    categories: [],
    joinedAt: '2024-03-12',
  },
  {
    userId: 'provider-nilufar',
    name: 'Nilufar',
    avatar: '/avatars/nilufar.png',
    phone: '+998 91 222 33 44',
    city: 'Fergana',
    rating: 4.9,
    completedOrders: 312,
    isProvider: true,
    categories: ['food'],
    joinedAt: '2023-01-08',
  },
  {
    userId: 'provider-sardor',
    name: 'Sardor',
    avatar: '/avatars/sardor.png',
    phone: '+998 93 555 66 77',
    city: 'Fergana',
    rating: 4.7,
    completedOrders: 198,
    isProvider: true,
    categories: ['laundry'],
    joinedAt: '2023-05-21',
  },
  {
    userId: 'provider-malohat',
    name: 'Malohat',
    avatar: '/avatars/malohat.png',
    phone: '+998 94 111 22 33',
    city: 'Fergana',
    rating: 5.0,
    completedOrders: 421,
    isProvider: true,
    categories: ['food'],
    joinedAt: '2022-11-02',
  },
  {
    userId: 'provider-jasurbek',
    name: 'Jasurbek',
    avatar: '/avatars/jasurbek.png',
    phone: '+998 90 777 88 99',
    city: 'Fergana',
    rating: 4.8,
    completedOrders: 156,
    isProvider: true,
    categories: ['moving'],
    joinedAt: '2023-08-15',
  },
  {
    userId: 'provider-zulfiya',
    name: 'Zulfiya',
    avatar: '/avatars/zulfiya.png',
    phone: '+998 91 444 55 66',
    city: 'Fergana',
    rating: 4.6,
    completedOrders: 89,
    isProvider: true,
    categories: ['cleaning'],
    joinedAt: '2024-01-30',
  },
  {
    userId: 'provider-otabek',
    name: 'Otabek',
    avatar: '/avatars/otabek.png',
    phone: '+998 93 999 00 11',
    city: 'Fergana',
    rating: 4.8,
    completedOrders: 540,
    isProvider: true,
    categories: ['delivery'],
    joinedAt: '2022-09-19',
  },
]

const seedServices: Service[] = [
  {
    serviceId: 'svc-plov',
    providerId: 'provider-nilufar',
    providerName: 'Nilufar',
    providerAvatar: '/avatars/nilufar.png',
    title: 'Уйда пиширилган палов',
    description:
      'Homemade Fergana plov cooked fresh to order with grass-fed beef, golden carrots, and chickpeas. Family recipe passed down for three generations. Serves 2-3 people per portion.',
    category: 'food',
    price: 25000,
    priceUnit: 'fixed',
    rating: 4.9,
    reviewCount: 142,
    location: 'Yangi Hayot mahalla',
    city: 'Fergana',
    distanceKm: 0.8,
    available: true,
    createdAt: '2024-06-01',
  },
  {
    serviceId: 'svc-laundry',
    providerId: 'provider-sardor',
    providerName: 'Sardor',
    providerAvatar: '/avatars/sardor.png',
    title: 'Кийимларни ювиш',
    description:
      'Reliable laundry and ironing service. Wash, dry, fold, and press. Same-day turnaround for orders before noon. Gentle eco-friendly detergent available on request.',
    category: 'laundry',
    price: 15000,
    priceUnit: 'per_item',
    rating: 4.7,
    reviewCount: 96,
    location: 'Do‘stlik mahalla',
    city: 'Fergana',
    distanceKm: 1.5,
    available: true,
    createdAt: '2024-06-03',
  },
  {
    serviceId: 'svc-samsa',
    providerId: 'provider-malohat',
    providerName: 'Malohat',
    providerAvatar: '/avatars/malohat.png',
    title: 'Самса ва нон',
    description:
      'Fresh tandoor samsa and non baked every morning. Beef, pumpkin, and greens fillings. Crispy flaky pastry straight from the clay oven. Minimum order 5 pieces.',
    category: 'food',
    price: 3000,
    priceUnit: 'per_item',
    rating: 5.0,
    reviewCount: 210,
    location: 'Markaz mahalla',
    city: 'Fergana',
    distanceKm: 2.1,
    available: true,
    createdAt: '2024-06-05',
  },
  {
    serviceId: 'svc-moving',
    providerId: 'provider-jasurbek',
    providerName: 'Jasurbek',
    providerAvatar: '/avatars/jasurbek.png',
    title: 'Кўчиш ёрдами',
    description:
      'Moving help with a team of two and a covered van. Careful packing, heavy lifting, and furniture assembly. Honest hourly pricing with no hidden fees.',
    category: 'moving',
    price: 50000,
    priceUnit: 'per_hour',
    rating: 4.8,
    reviewCount: 64,
    location: 'Bog‘ishamol mahalla',
    city: 'Fergana',
    distanceKm: 3.4,
    available: true,
    createdAt: '2024-06-07',
  },
  {
    serviceId: 'svc-cleaning',
    providerId: 'provider-zulfiya',
    providerName: 'Zulfiya',
    providerAvatar: '/avatars/zulfiya.png',
    title: 'Уй тозалаш',
    description:
      'Thorough home cleaning: floors, kitchen, bathrooms, windows, and dusting. Bring my own supplies. Flat rate for apartments up to 3 rooms.',
    category: 'cleaning',
    price: 80000,
    priceUnit: 'fixed',
    rating: 4.6,
    reviewCount: 47,
    location: 'Navbahor mahalla',
    city: 'Fergana',
    distanceKm: 1.9,
    available: true,
    createdAt: '2024-06-09',
  },
  {
    serviceId: 'svc-delivery',
    providerId: 'provider-otabek',
    providerName: 'Otabek',
    providerAvatar: '/avatars/otabek.png',
    title: 'Доставка курьер',
    description:
      'Fast neighborhood courier on a motorbike. Pick up groceries, documents, parcels, or food and deliver within the mahalla in under 30 minutes.',
    category: 'delivery',
    price: 10000,
    priceUnit: 'fixed',
    rating: 4.8,
    reviewCount: 178,
    location: 'Markaz mahalla',
    city: 'Fergana',
    distanceKm: 0.5,
    available: true,
    createdAt: '2024-06-11',
  },
]

const seedReviews: Review[] = [
  {
    reviewId: 'rev-1',
    serviceId: 'svc-plov',
    authorName: 'Dilnoza',
    rating: 5,
    comment:
      'The best plov in the mahalla! Tastes just like my grandmother used to make. Always warm and on time.',
    createdAt: '2024-06-20',
  },
  {
    reviewId: 'rev-2',
    serviceId: 'svc-plov',
    authorName: 'Bekzod',
    rating: 5,
    comment: 'Generous portions and the meat is so tender. Highly recommend for guests.',
    createdAt: '2024-06-18',
  },
  {
    reviewId: 'rev-3',
    serviceId: 'svc-plov',
    authorName: 'Kamola',
    rating: 4,
    comment: 'Delicious as always. Would love a slightly spicier option.',
    createdAt: '2024-06-12',
  },
  {
    reviewId: 'rev-4',
    serviceId: 'svc-laundry',
    authorName: 'Shahnoza',
    rating: 5,
    comment: 'Clothes came back fresh and perfectly ironed. Very reliable neighbor.',
    createdAt: '2024-06-15',
  },
  {
    reviewId: 'rev-5',
    serviceId: 'svc-samsa',
    authorName: 'Rustam',
    rating: 5,
    comment: 'Crispy, flaky, and still hot when delivered. The pumpkin samsa is incredible.',
    createdAt: '2024-06-19',
  },
]

const seedOrders: Order[] = [
  {
    orderId: 'ord-1',
    customerId: CURRENT_USER_ID,
    customerName: 'Aziza Karimova',
    serviceId: 'svc-plov',
    serviceTitle: 'Уйда пиширилган палов',
    providerId: 'provider-nilufar',
    providerName: 'Nilufar',
    category: 'food',
    status: 'in_progress',
    scheduledDate: '2024-06-28',
    scheduledTime: '13:00',
    quantity: 2,
    totalPrice: 50000,
    notes: 'Less salt please, for two portions.',
    createdAt: '2024-06-26',
  },
  {
    orderId: 'ord-2',
    customerId: CURRENT_USER_ID,
    customerName: 'Aziza Karimova',
    serviceId: 'svc-delivery',
    serviceTitle: 'Доставка курьер',
    providerId: 'provider-otabek',
    providerName: 'Otabek',
    category: 'delivery',
    status: 'confirmed',
    scheduledDate: '2024-06-27',
    scheduledTime: '10:30',
    quantity: 1,
    totalPrice: 10000,
    notes: 'Pick up documents from the pharmacy.',
    createdAt: '2024-06-26',
  },
  {
    orderId: 'ord-3',
    customerId: CURRENT_USER_ID,
    customerName: 'Aziza Karimova',
    serviceId: 'svc-samsa',
    serviceTitle: 'Самса ва нон',
    providerId: 'provider-malohat',
    providerName: 'Malohat',
    category: 'food',
    status: 'completed',
    scheduledDate: '2024-06-20',
    scheduledTime: '08:00',
    quantity: 10,
    totalPrice: 30000,
    notes: 'Mix of beef and pumpkin.',
    createdAt: '2024-06-19',
  },
  {
    orderId: 'ord-4',
    customerId: CURRENT_USER_ID,
    customerName: 'Aziza Karimova',
    serviceId: 'svc-cleaning',
    serviceTitle: 'Уй тозалаш',
    providerId: 'provider-zulfiya',
    providerName: 'Zulfiya',
    category: 'cleaning',
    status: 'cancelled',
    scheduledDate: '2024-06-22',
    scheduledTime: '15:00',
    quantity: 1,
    totalPrice: 80000,
    notes: 'Had to reschedule.',
    createdAt: '2024-06-18',
  },
]

/* --------------------------- Internal helpers --------------------------- */

function assertConfigured() {
  if (!TABLE_NAME) {
    throw new Error(
      'DYNAMODB_TABLE_NAME is not set. Add the DynamoDB integration / environment variables to use the data layer.',
    )
  }
}

/** Strip the partition key + entityType so callers get clean domain objects. */
function clean<T>(item: Record<string, unknown>): T {
  const copy = { ...item }
  delete copy[PK]
  delete copy.entityType
  return copy as T
}

function toItem(entityType: EntityType, id: string, data: object) {
  return { [PK]: id, entityType, ...data }
}

async function scanByType<T>(entityType: EntityType): Promise<T[]> {
  assertConfigured()
  try {
    const items: Record<string, unknown>[] = []
    let ExclusiveStartKey: Record<string, unknown> | undefined
    do {
      const result = await docClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: '#et = :et',
          ExpressionAttributeNames: { '#et': 'entityType' },
          ExpressionAttributeValues: { ':et': entityType },
          ExclusiveStartKey,
        }),
      )
      items.push(...((result.Items as Record<string, unknown>[]) || []))
      ExclusiveStartKey = result.LastEvaluatedKey as
        | Record<string, unknown>
        | undefined
    } while (ExclusiveStartKey)
    return items.map((i) => clean<T>(i))
  } catch (err) {
    throw new Error('Database operation failed')
  }
}

async function getById<T>(id: string): Promise<T | null> {
  assertConfigured()
  try {
    const result = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { [PK]: id } }),
    )
    return result.Item ? clean<T>(result.Item) : null
  } catch (err) {
    throw new Error('Database operation failed')
  }
}

/* ------------------------------ Seeding ------------------------------ */

let seedPromise: Promise<void> | null = null

async function doSeed() {
  assertConfigured()
  try {
    // Only seed when the table has no services yet.
    const existing = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: '#et = :et',
        ExpressionAttributeNames: { '#et': 'entityType' },
        ExpressionAttributeValues: { ':et': 'service' },
        Limit: 1,
      }),
    )
    if (existing.Items && existing.Items.length > 0) return

    const requests = [
      ...seedUsers.map((u) => ({
        PutRequest: { Item: toItem('user', u.userId, u) },
      })),
      ...seedServices.map((s) => ({
        PutRequest: { Item: toItem('service', s.serviceId, s) },
      })),
      ...seedReviews.map((r) => ({
        PutRequest: { Item: toItem('review', r.reviewId, r) },
      })),
      ...seedOrders.map((o) => ({
        PutRequest: { Item: toItem('order', o.orderId, o) },
      })),
    ]

    // BatchWrite handles at most 25 items per request.
    for (let i = 0; i < requests.length; i += 25) {
      const batch = requests.slice(i, i + 25)
      await docClient.send(
        new BatchWriteCommand({ RequestItems: { [TABLE_NAME as string]: batch } }),
      )
    }
  } catch (err) {
    throw new Error('Database seeding failed')
  }
}

async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = doSeed().catch((err) => {
      // Reset so a later request can retry seeding.
      seedPromise = null
      throw err
    })
  }
  return seedPromise
}

export const CURRENT_USER = CURRENT_USER_ID

/* ----------------------------- Services ----------------------------- */

export async function listServices(): Promise<Service[]> {
  await ensureSeeded()
  return scanByType<Service>('service')
}

export async function getService(serviceId: string): Promise<Service | null> {
  await ensureSeeded()
  return getById<Service>(serviceId)
}

export async function createService(
  input: Omit<
    Service,
    'serviceId' | 'rating' | 'reviewCount' | 'createdAt' | 'distanceKm'
  > & { distanceKm?: number },
): Promise<Service> {
  assertConfigured()
  const service: Service = {
    ...input,
    serviceId: `svc-${Date.now()}`,
    rating: 0,
    reviewCount: 0,
    distanceKm: input.distanceKm ?? Number((Math.random() * 4 + 0.3).toFixed(1)),
    createdAt: new Date().toISOString().slice(0, 10),
  }
  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: toItem('service', service.serviceId, service),
      }),
    )
    return service
  } catch (err) {
    throw new Error('Database operation failed')
  }
}

export async function updateService(
  serviceId: string,
  patch: Partial<Service>,
): Promise<Service | null> {
  assertConfigured()
  const existing = await getById<Service>(serviceId)
  if (!existing) return null

  const fields = Object.entries(patch).filter(
    ([key]) => key !== 'serviceId' && key !== 'entityType',
  )
  if (fields.length === 0) return existing

  const names: Record<string, string> = {}
  const values: Record<string, unknown> = {}
  const sets: string[] = []
  fields.forEach(([key, value], idx) => {
    names[`#k${idx}`] = key
    values[`:v${idx}`] = value
    sets.push(`#k${idx} = :v${idx}`)
  })

  try {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { [PK]: serviceId },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      }),
    )
    return result.Attributes ? clean<Service>(result.Attributes) : null
  } catch (err) {
    throw new Error('Database operation failed')
  }
}

export async function deleteService(serviceId: string): Promise<boolean> {
  assertConfigured()
  const existing = await getById<Service>(serviceId)
  if (!existing) return false
  try {
    await docClient.send(
      new DeleteCommand({ TableName: TABLE_NAME, Key: { [PK]: serviceId } }),
    )
    return true
  } catch (err) {
    throw new Error('Database operation failed')
  }
}

/* ------------------------------ Reviews ------------------------------ */

export async function listReviews(serviceId: string): Promise<Review[]> {
  await ensureSeeded()
  const reviews = await scanByType<Review>('review')
  return reviews.filter((r) => r.serviceId === serviceId)
}

/* ------------------------------ Orders ------------------------------- */

export async function listOrders(
  customerId = CURRENT_USER_ID,
): Promise<Order[]> {
  await ensureSeeded()
  const orders = await scanByType<Order>('order')
  return orders
    .filter((o) => o.customerId === customerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createOrder(
  input: Omit<
    Order,
    'orderId' | 'createdAt' | 'status' | 'customerId' | 'customerName'
  >,
): Promise<Order> {
  assertConfigured()
  const order: Order = {
    ...input,
    orderId: `ord-${Date.now()}`,
    customerId: CURRENT_USER_ID,
    customerName: 'Aziza Karimova',
    status: 'pending',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: toItem('order', order.orderId, order),
      }),
    )
    return order
  } catch (err) {
    throw new Error('Database operation failed')
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
): Promise<Order | null> {
  assertConfigured()
  const existing = await getById<Order>(orderId)
  if (!existing) return null
  try {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { [PK]: orderId },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': status },
        ReturnValues: 'ALL_NEW',
      }),
    )
    return result.Attributes ? clean<Order>(result.Attributes) : null
  } catch (err) {
    throw new Error('Database operation failed')
  }
}

/* ------------------------------- Users ------------------------------- */

export async function getUser(userId = CURRENT_USER_ID): Promise<User | null> {
  await ensureSeeded()
  return getById<User>(userId)
}
