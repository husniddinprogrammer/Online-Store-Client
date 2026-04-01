export type Locale = 'uz-cyrl' | 'uz-latn' | 'ru' | 'en'

export const locales: Locale[] = ['uz-cyrl', 'uz-latn', 'ru', 'en']

export const defaultLocale: Locale = 'uz-cyrl'

export const localeNames: Record<Locale, string> = {
  'uz-cyrl': 'Ўзбекча',
  'uz-latn': "O'zbekcha",
  'ru': 'Русский',
  'en': 'English',
}

export function hasLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

const dictionaries: Record<Locale, () => Promise<unknown>> = {
  'uz-cyrl': () =>
    import('./uz-cyrl.json').then((m) => m.default),
  'uz-latn': () =>
    import('./uz-latn.json').then((m) => m.default),
  'ru': () =>
    import('./ru.json').then((m) => m.default),
  'en': () =>
    import('./en.json').then((m) => m.default),
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]() as Promise<Dictionary>
}

export type Dictionary = {
  nav: {
    catalog: string
    search: string
    cart: string
    favorites: string
    login: string
    profile: string
    darkMode: string
    language: string
  }
  home: {
    heroTitle: string
    heroSubtitle: string
    categories: string
    latestProducts: string
    bestSellingProducts: string
    viewAll: string
  }
  product: {
    addToCart: string
    addedToCart: string
    inCart: string
    outOfStock: string
    discount: string
    rating: string
    reviews: string
    noReviews: string
    description: string
    similarProducts: string
    addToFavorites: string
    removeFromFavorites: string
    inStockCount: string
  }
  category: {
    filters: string
    priceRange: string
    minPrice: string
    maxPrice: string
    companies: string
    apply: string
    sortBy: string
    popular: string
    newest: string
    newestFirst: string
    byRating: string
    cheapest: string
    expensive: string
    priceHighToLow: string
    priceLowToHigh: string
    biggestDiscount: string
    smallestDiscount: string
    noProducts: string
    productsCount: string
  }
  cart: {
    title: string
    empty: string
    emptyDesc: string
    continueShopping: string
    total: string
    checkout: string
    remove: string
    quantity: string
  }
  favorites: {
    title: string
    empty: string
    emptyDesc: string
  }
  auth: {
    login: string
    register: string
    email: string
    password: string
    name: string
    surname: string
    phone: string
    birthday: string
    confirmPassword: string
    forgotPassword: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    loginBtn: string
    registerBtn: string
    resetPassword: string
    backToLogin: string
  }
  footer: {
    support: string
    address: string
    pages: string
    home: string
    categories: string
    cart: string
    favorites: string
    followUs: string
    rights: string
  }
  common: {
    loading: string
    error: string
    retry: string
    close: string
    save: string
    cancel: string
    searchResults: string
  }
  profile: {
    title: string
    personalData: string
    myOrders: string
    favorites: string
    myReviews: string
    notifications: string
    logout: string
    balance: string
    topUp: string
    topUpTitle: string
    editProfile: string
    saveChanges: string
    changePassword: string
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
    addresses: string
    addAddress: string
    editAddress: string
    deleteAddress: string
    region: string
    city: string
    homeNumber: string
    roomNumber: string
    orderStatus_PENDING: string
    orderStatus_PAID: string
    orderStatus_SHIPPED: string
    orderStatus_DELIVERED: string
    orderStatus_CANCELLED: string
    orderId: string
    orderDate: string
    orderStatusCol: string
    orderTotal: string
    cancelOrder: string
    noOrders: string
    noReviews: string
    noPendingReviews: string
    noNotifications: string
    markAllRead: string
    profileUpdated: string
    passwordChanged: string
    addressSaved: string
    addressDeleted: string
    wrongPassword: string
    writeReview: string
    pendingReviews: string
    onlyBuyersReview: string
    reviewSubmitted: string
    yourRating: string
    yourComment: string
    role: string
    roleCustomer: string
    roleAdmin: string
    roleDelivery: string
    roleSuperAdmin: string
    emailStatus: string
    verified: string
    unverified: string
    memberSince: string
    currentBalance: string
    quickSelect: string
    amount: string
    amountPlaceholder: string
    minimum: string
    maximum: string
    balanceAfterTopUp: string
    topUpSuccess: string
    topUpError: string
  }
}
