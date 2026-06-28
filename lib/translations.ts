export type Locale = 'en' | 'ru' | 'uz'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  uz: "O'zbek",
}

const translations = {
  // ─── Header / Nav ───
  'nav.browse': { en: 'Browse', ru: 'Каталог', uz: "Ko'rish" },
  'nav.myOrders': { en: 'My Orders', ru: 'Мои заказы', uz: 'Buyurtmalarim' },
  'nav.profile': { en: 'Profile', ru: 'Профиль', uz: 'Profil' },
  'nav.postService': { en: 'Post a service', ru: 'Предложить услугу', uz: "Xizmat e'lon qilish" },
  'nav.postShort': { en: 'Post', ru: 'Добавить', uz: 'Qo\'shish' },

  // ─── Hero ───
  'hero.badge': { en: 'Hyperlocal neighborhood marketplace', ru: 'Маркетплейс вашей махалли', uz: 'Mahalla marketplace' },
  'hero.title': { en: 'Your neighborhood, your community', ru: 'Ваша махалля, ваше сообщество', uz: "Sizning mahallangiz, sizning jamoangiz" },
  'hero.subtitle': {
    en: 'Order home-cooked plov from your neighbor. Get laundry done. Find help nearby.',
    ru: 'Закажите домашний плов у соседа. Отдайте стирку. Найдите помощь рядом.',
    uz: "Qo'shningizdan uy plovini buyurtma qiling. Kir yuvishni topshiring. Yaqin atrofdan yordam toping.",
  },

  // ─── How it works ───
  'howItWorks.title': { en: 'How it works', ru: 'Как это работает', uz: 'Qanday ishlaydi' },
  'howItWorks.subtitle': {
    en: 'Three simple steps to get help from people right around the corner.',
    ru: 'Три простых шага, чтобы получить помощь от соседей.',
    uz: "Qo'shnilardan yordam olish uchun uchta oddiy qadam.",
  },
  'step.findNeighbor.title': { en: 'Find a neighbor', ru: 'Найдите соседа', uz: "Qo'shni toping" },
  'step.findNeighbor.text': {
    en: 'Search by category or describe your need. Smart matching connects you with trusted neighbors nearby.',
    ru: 'Ищите по категории или опишите свою потребность. Умный подбор соединит вас с проверенными соседями рядом.',
    uz: "Kategoriya bo'yicha qidiring yoki ehtiyojingizni tasvirlab bering. Aqlli qidiruv sizni ishonchli qo'shnilarga ulaydi.",
  },
  'step.placeOrder.title': { en: 'Place your order', ru: 'Оформите заказ', uz: 'Buyurtma bering' },
  'step.placeOrder.text': {
    en: 'Pick a date and time, add notes, and confirm. See a fair price before you commit.',
    ru: 'Выберите дату и время, добавьте заметку и подтвердите. Увидите справедливую цену заранее.',
    uz: "Sana va vaqtni tanlang, izoh qo'shing va tasdiqlang. Narxni oldindan ko'ring.",
  },
  'step.enjoyRate.title': { en: 'Enjoy & rate', ru: 'Пользуйтесь и оцените', uz: "Foydalaning va baholang" },
  'step.enjoyRate.text': {
    en: 'Receive your service, then leave a review to keep the mahalla strong and trustworthy.',
    ru: 'Получите услугу и оставьте отзыв, чтобы махалля оставалась крепкой и надёжной.',
    uz: "Xizmatni oling, so'ng mahallani mustahkam va ishonchli saqlash uchun izoh qoldiring.",
  },

  // ─── Featured ───
  'featured.title': { en: 'Featured in your mahalla', ru: 'Популярное в вашей махалле', uz: 'Mahallangizda ommabop' },
  'featured.subtitle': { en: 'Popular services from trusted neighbors.', ru: 'Популярные услуги от проверенных соседей.', uz: "Ishonchli qo'shnilardan mashhur xizmatlar." },
  'featured.browseAll': { en: 'Browse all', ru: 'Смотреть все', uz: 'Hammasini ko\'rish' },

  // ─── Stats ───
  'stats.neighbors': { en: 'neighbors', ru: 'соседей', uz: "qo'shnilar" },
  'stats.cities': { en: 'cities', ru: 'городов', uz: 'shaharlar' },
  'stats.tasksCompleted': { en: 'tasks completed', ru: 'задач выполнено', uz: 'vazifa bajarildi' },

  // ─── Search ───
  'search.placeholder': {
    en: 'Describe what you need... e.g. "I need a hot lunch today"',
    ru: 'Опишите, что вам нужно... напр. "мне нужен горячий обед сегодня"',
    uz: "Nima kerakligini yozing... masalan, \"bugun issiq tushlik kerak\"",
  },
  'search.button': { en: 'Smart match', ru: 'Умный подбор', uz: 'Aqlli qidiruv' },
  'search.understood': { en: 'We understood:', ru: 'Мы поняли:', uz: 'Biz tushundik:' },
  'search.urgency': { en: 'Urgency', ru: 'Срочность', uz: 'Shoshilinchlik' },
  'search.noMatches': {
    en: 'No close matches found. Try browsing all services.',
    ru: 'Точных совпадений не найдено. Попробуйте посмотреть все услуги.',
    uz: "Aniq moslik topilmadi. Barcha xizmatlarni ko'rib chiqing.",
  },
  'search.error': {
    en: 'Sorry, smart matching is unavailable right now. Please try Browse.',
    ru: 'Извините, умный подбор сейчас недоступен. Попробуйте каталог.',
    uz: "Kechirasiz, aqlli qidiruv hozir ishlamayapti. Katalogni ko'ring.",
  },

  // ─── Browse ───
  'browse.title': { en: 'Browse services', ru: 'Каталог услуг', uz: 'Xizmatlar katalogi' },
  'browse.subtitle': { en: 'Find trusted neighbors offering what you need.', ru: 'Найдите проверенных соседей, предлагающих то, что вам нужно.', uz: "Sizga kerak narsani taklif qilayotgan ishonchli qo'shnilarni toping." },
  'browse.searchPlaceholder': { en: 'Search services or providers...', ru: 'Поиск услуг или исполнителей...', uz: 'Xizmat yoki xizmat ko\'rsat...' },
  'browse.filters': { en: 'Filters', ru: 'Фильтры', uz: 'Filterlar' },
  'browse.category': { en: 'Category', ru: 'Категория', uz: 'Kategoriya' },
  'browse.allCategories': { en: 'All categories', ru: 'Все категории', uz: 'Barcha kategoriyalar' },
  'browse.maxPrice': { en: 'Max price', ru: 'Макс. цена', uz: 'Maks. narx' },
  'browse.minRating': { en: 'Minimum rating', ru: 'Мин. рейтинг', uz: 'Min. reyting' },
  'browse.anyRating': { en: 'Any rating', ru: 'Любой рейтинг', uz: 'Istalgan reyting' },
  'browse.distance': { en: 'Distance', ru: 'Расстояние', uz: 'Masofa' },
  'browse.anyDistance': { en: 'Any distance', ru: 'Любое расстояние', uz: 'Istalgan masofa' },
  'browse.within': { en: 'Within', ru: 'В пределах', uz: 'Ichida' },
  'browse.resetFilters': { en: 'Reset filters', ru: 'Сбросить фильтры', uz: 'Filtrlarni tozalash' },
  'browse.services': { en: 'services', ru: 'услуг', uz: 'xizmatlar' },
  'browse.service': { en: 'service', ru: 'услуга', uz: 'xizmat' },
  'browse.topRated': { en: 'Top rated', ru: 'Лучший рейтинг', uz: 'Eng yuqori' },
  'browse.priceLow': { en: 'Price: low to high', ru: 'Цена: по возрастанию', uz: 'Narx: arzondan qimmatga' },
  'browse.priceHigh': { en: 'Price: high to low', ru: 'Цена: по убыванию', uz: 'Narx: qimmatdan arzon' },
  'browse.nearest': { en: 'Nearest', ru: 'Ближайшие', uz: 'Eng yaqin' },
  'browse.noServices': { en: 'No services match your filters.', ru: 'Нет услуг, соответствующих фильтрам.', uz: 'Filtrlarga mos xizmat topilmadi.' },

  // ─── Service Card ───
  'card.available': { en: 'Available', ru: 'Доступно', uz: 'Mavjud' },
  'card.busy': { en: 'Busy', ru: 'Занят', uz: 'Band' },
  'card.by': { en: 'by', ru: 'от', uz: '' },
  'card.orderNow': { en: 'Order Now', ru: 'Заказать', uz: 'Buyurtma berish' },

  // ─── Service Detail ───
  'detail.backToBrowse': { en: 'Back to browse', ru: 'Назад в каталог', uz: 'Katalogga qaytish' },
  'detail.aboutService': { en: 'About this service', ru: 'Об услуге', uz: 'Xizmat haqida' },
  'detail.ordersCompleted': { en: 'orders completed', ru: 'заказов выполнено', uz: 'buyurtma bajarildi' },
  'detail.rating': { en: 'rating', ru: 'рейтинг', uz: 'reyting' },
  'detail.verifiedNeighbor': { en: 'Verified neighbor', ru: 'Проверенный сосед', uz: "Tasdiqlangan qo'shni" },
  'detail.aiPriceInsight': { en: 'AI Price Insight', ru: 'ИИ-анализ цены', uz: 'AI narx tahlili' },
  'detail.priceFair': {
    en: 'This price is fair for your area.',
    ru: 'Эта цена справедлива для вашего района.',
    uz: "Bu narx sizning hududingiz uchun to'g'ri.",
  },
  'detail.priceHeadsUp': {
    en: 'Heads up: this price may differ from the typical range.',
    ru: 'Внимание: эта цена может отличаться от типичного диапазона.',
    uz: "Diqqat: bu narx odatiy oraliqdan farq qilishi mumkin.",
  },
  'detail.similarServices': { en: 'Similar services in', ru: 'Похожие услуги в', uz: "O'xshash xizmatlar" },
  'detail.range': { en: 'range', ru: 'стоят', uz: "narxlari" },
  'detail.reviews': { en: 'Reviews', ru: 'Отзывы', uz: 'Izohlar' },
  'detail.noReviews': { en: 'No reviews yet. Be the first to order!', ru: 'Отзывов пока нет. Будьте первым!', uz: "Hali izoh yo'q. Birinchi bo'ling!" },
  'detail.currentlyBusy': { en: 'Currently busy', ru: 'Сейчас занят', uz: 'Hozir band' },

  // ─── Order Form ───
  'order.date': { en: 'Date', ru: 'Дата', uz: 'Sana' },
  'order.time': { en: 'Time', ru: 'Время', uz: 'Vaqt' },
  'order.quantity': { en: 'Quantity', ru: 'Количество', uz: 'Miqdor' },
  'order.notes': { en: 'Notes for the provider', ru: 'Заметка для исполнителя', uz: 'Xizmatkor uchun izoh' },
  'order.notesPlaceholder': { en: 'Any special requests...', ru: 'Особые пожелания...', uz: 'Maxsus talablar...' },
  'order.total': { en: 'Total', ru: 'Итого', uz: 'Jami' },
  'order.orderNow': { en: 'Order Now', ru: 'Заказать', uz: 'Buyurtma berish' },
  'order.pickDateTime': { en: 'Please choose a date and time.', ru: 'Пожалуйста, выберите дату и время.', uz: 'Iltimos, sana va vaqtni tanlang.' },
  'order.success': { en: 'Order placed! Track it in My Orders.', ru: 'Заказ оформлен! Отслеживайте в Мои заказы.', uz: 'Buyurtma berildi! Buyurtmalarimda kuzating.' },
  'order.error': { en: 'Could not place the order. Please try again.', ru: 'Не удалось оформить заказ. Попробуйте ещё раз.', uz: 'Buyurtma berib bo\'lmadi. Qayta urinib ko\'ring.' },

  // ─── Orders Page ───
  'orders.title': { en: 'Your orders', ru: 'Ваши заказы', uz: 'Buyurtmalaringiz' },
  'orders.subtitle': {
    en: "Track everything you've booked from neighbors across your mahalla.",
    ru: 'Отслеживайте всё, что заказали у соседей в вашей махалле.',
    uz: "Mahallangizda qo'shnilardan buyurtma qilgan hamma narsani kuzating.",
  },
  'orders.noOrders': { en: 'No orders yet', ru: 'Заказов пока нет', uz: 'Hali buyurtma yo\'q' },
  'orders.noOrdersSubtitle': {
    en: 'Browse your mahalla and place your first order.',
    ru: 'Посмотрите каталог и оформите первый заказ.',
    uz: "Mahallangizni ko'rib chiqing va birinchi buyurtmangizni bering.",
  },
  'orders.browseServices': { en: 'Browse services', ru: 'Смотреть услуги', uz: "Xizmatlarni ko'rish" },
  'orders.provider': { en: 'Provider', ru: 'Исполнитель', uz: 'Xizmatkor' },
  'orders.qty': { en: 'Qty', ru: 'Кол-во', uz: 'Soni' },
  'orders.mark': { en: 'Mark', ru: 'Отметить', uz: 'Belgilash' },

  // ─── Order Statuses ───
  'status.pending': { en: 'Pending', ru: 'Ожидание', uz: 'Kutilmoqda' },
  'status.confirmed': { en: 'Confirmed', ru: 'Подтверждён', uz: 'Tasdiqlangan' },
  'status.in_progress': { en: 'In progress', ru: 'В процессе', uz: 'Jarayonda' },
  'status.completed': { en: 'Completed', ru: 'Завершён', uz: 'Bajarilgan' },
  'status.cancelled': { en: 'Cancelled', ru: 'Отменён', uz: 'Bekor qilingan' },

  // ─── Post Service ───
  'post.title': { en: 'Offer a service to your mahalla', ru: 'Предложите услугу вашей махалле', uz: 'Mahallangizga xizmat taklif qiling' },
  'post.subtitle': {
    en: 'Share your skills with neighbors. Our AI helps you set a fair price for your area in seconds.',
    ru: 'Поделитесь навыками с соседями. ИИ поможет установить справедливую цену за считанные секунды.',
    uz: "Mahoratingizni qo'shnilar bilan bo'lishing. AI sizga bir necha soniya ichida to'g'ri narx belgilashga yordam beradi.",
  },
  'post.serviceTitle': { en: 'Service title', ru: 'Название услуги', uz: 'Xizmat nomi' },
  'post.serviceTitlePlaceholder': { en: 'e.g. Home-cooked plov, delivered warm', ru: 'напр. Домашний плов, доставка в тёплом виде', uz: "masalan, Uyda pishirilgan palov, issiq holda yetkazib berish" },
  'post.category': { en: 'Category', ru: 'Категория', uz: 'Kategoriya' },
  'post.description': { en: 'Description', ru: 'Описание', uz: 'Tavsif' },
  'post.descriptionPlaceholder': {
    en: 'Describe what you offer, portion sizes, what makes it special...',
    ru: 'Опишите, что предлагаете, размер порций, чем это особенно...',
    uz: "Nima taklif qilayotganingizni, porsiya o'lchamini, nimasi alohida ekanligini yozing...",
  },
  'post.city': { en: 'City', ru: 'Город', uz: 'Shahar' },
  'post.neighborhood': { en: 'Neighborhood (mahalla)', ru: 'Район (махалля)', uz: 'Mahalla' },
  'post.neighborhoodPlaceholder': { en: 'e.g. Chilonzor 9-kvartal', ru: 'напр. Чиланзар 9-квартал', uz: 'masalan, Chilonzor 9-kvartal' },
  'post.price': { en: 'Price (UZS)', ru: 'Цена (сум)', uz: "Narx (so'm)" },
  'post.priceUnit': { en: 'Price unit', ru: 'Единица цены', uz: 'Narx birligi' },
  'post.fixedPrice': { en: 'Fixed price', ru: 'Фиксированная', uz: "Belgilangan narx" },
  'post.perItem': { en: 'Per item', ru: 'За штуку', uz: 'Dona uchun' },
  'post.perHour': { en: 'Per hour', ru: 'За час', uz: 'Soat uchun' },
  'post.publish': { en: 'Publish service', ru: 'Опубликовать услугу', uz: "Xizmatni e'lon qilish" },
  'post.success.title': { en: 'Your service is live!', ru: 'Ваша услуга опубликована!', uz: 'Xizmatingiz chop etildi!' },
  'post.success.subtitle': {
    en: 'Your neighbors can now find and book it. Taking you there...',
    ru: 'Теперь соседи могут найти и заказать её. Переходим...',
    uz: "Endi qo'shnilar uni topib, buyurtma qilishlari mumkin. O'tkazilmoqda...",
  },

  // ─── AI Price Suggester ───
  'aiPrice.title': { en: 'AI Price Suggester', ru: 'ИИ-подсказка цены', uz: 'AI narx taklifi' },
  'aiPrice.subtitle': { en: 'Get a fair price for your area', ru: 'Узнайте справедливую цену для вашего района', uz: "Hududingiz uchun to'g'ri narxni bilib oling" },
  'aiPrice.suggest': { en: 'Suggest', ru: 'Предложить', uz: 'Taklif qilish' },
  'aiPrice.useSuggested': { en: 'Use suggested', ru: 'Использовать', uz: 'Taklif qilinganini ishlatish' },
  'aiPrice.enterFirst': { en: 'Enter a service type first to get a price suggestion.', ru: 'Сначала введите тип услуги, чтобы получить подсказку.', uz: 'Avval xizmat turini kiriting.' },
  'aiPrice.unavailable': { en: 'Price suggestion is unavailable right now.', ru: 'Подсказка цены сейчас недоступна.', uz: 'Narx taklifi hozir mavjud emas.' },

  // ─── Profile ───
  'profile.verifiedNeighbor': { en: 'Verified neighbor', ru: 'Проверенный сосед', uz: "Tasdiqlangan qo'shni" },
  'profile.memberSince': { en: 'Member since', ru: 'Участник с', uz: "A'zo bo'lgan sana" },
  'profile.becomeProvider': { en: 'Become a provider', ru: 'Стать исполнителем', uz: 'Xizmatkor bo\'lish' },
  'profile.completedOrders': { en: 'Completed orders', ru: 'Завершённые заказы', uz: 'Bajarilgan buyurtmalar' },
  'profile.activeOrders': { en: 'Active orders', ru: 'Активные заказы', uz: 'Faol buyurtmalar' },
  'profile.totalSpent': { en: 'Total spent', ru: 'Всего потрачено', uz: 'Jami sarflangan' },
  'profile.neighborRating': { en: 'Neighbor rating', ru: 'Рейтинг соседа', uz: "Qo'shni reytingi" },
  'profile.recommended': { en: 'Recommended for you', ru: 'Рекомендуем вам', uz: 'Siz uchun tavsiya' },
  'profile.seeAll': { en: 'See all', ru: 'Все', uz: 'Hammasini ko\'rish' },

  // ─── Footer ───
  'footer.tagline': { en: 'Your neighborhood, your community.', ru: 'Ваша махалля, ваше сообщество.', uz: "Sizning mahallangiz, sizning jamoangiz." },
  'footer.copyright': { en: 'Built for neighbors, by neighbors.', ru: 'Создано соседями для соседей.', uz: "Qo'shnilar uchun, qo'shnilar tomonidan yaratilgan." },

  // ─── Price formatting ───
  'price.perHour': { en: '/ hour', ru: '/ час', uz: '/ soat' },
  'price.perItem': { en: '/ item', ru: '/ шт.', uz: '/ dona' },

  // ─── Language ───
  'lang.label': { en: 'Language', ru: 'Язык', uz: 'Til' },
} as const

export type TranslationKey = keyof typeof translations

export function t(key: TranslationKey, locale: Locale = 'en'): string {
  const entry = translations[key]
  if (!entry) return key
  return (entry as Record<Locale, string>)[locale] ?? entry.en
}

/** Server-side helper: returns a bound translator for the given locale. */
export function getTranslator(locale: Locale) {
  return (key: TranslationKey) => t(key, locale)
}
