// ============================================
// Plaatija24 & Mikrotsement – Tüüpide definitsioonid
// ============================================

export type ServiceType = 'plaat' | 'mikrotsement' | 'mõlemad'

export type SystemBrand = 'mira' | 'mapei' | 'weber' | 'kiilto' | 'ceresit' | 'none'

export type ClientType = 'private' | 'contractor_b2b'

export type SubscriptionTier = 'free' | 'pro_1290' | 'vip_b2b_2500'

export interface TileSpecs {
  size: 'mosaic' | 'small' | 'standard_30x60' | 'standard_60x60' | 'large_60x120' | 'slab_large' | 'herringbone' | 'custom'
  sizeLabel: string
  material: 'keraamiline' | 'portselan' | 'looduskivi' | 'marmor' | 'muu'
  finish: 'matt' | 'läikiv' | 'poolmatt' | 'struktureeritud'
  colorStyle: string // nt 'Valge Carrara marmor', 'Antratsiithall betoon', 'Beež liivakivi'
  jointType: 'cement' | 'epoxy'
  jointWidthMm?: number
  tileBrand?: string
}

export interface MicrocementSpecs {
  system: 'classic_2layer' | 'shower_waterproof' | 'floor_high_traffic'
  systemLabel: string
  finish: 'matt' | 'siidjas' | 'läikiv'
  colorTone: string // nt 'Helehall betoon', 'Soe liivakarva beež', 'Tume grafiit'
  texture: 'peenike_sile' | 'keskmine_elav' | 'maalähedane'
}

export interface ScopeOfWork {
  // Mahud
  floorArea: number // m²
  wallArea: number // m²
  wallHeight: number // m
  perimeter: number // jm

  // Töölõigud
  levelingRequired: boolean // tasandus / pinna ettevalmistus
  waterproofingArea: number // m²
  corners45degCount: number // 45° jiirid / välisnurgad (jm)
  nichesCount: number // nišid ja riiulid (tk)
  drainsCount: number // trapid ja trapikraed (tk)
  siliconeLength: number // sanitaarsilikoon (jm)
  demolitionRequired: boolean // vana plaadi eemaldus
  extras: string[]
}

export interface EstimateLineItem {
  id: string
  category: 'ettevalmistus' | 'hüdroisolatsioon' | 'paigaldus' | 'viimistlus' | 'materjalid'
  title: string
  description?: string
  quantity: number
  unit: 'm²' | 'jm' | 'tk' | 'kmpl' | 'tund'
  unitPrice: number // letihind (€)
  total: number
}

export interface AIEstimate {
  laborItems: EstimateLineItem[]
  materialItems: EstimateLineItem[]
  laborSubtotal: number
  materialSubtotal: number
  netTotal: number
  vat: number // 22%
  grossTotal: number
  priceRange: {
    min: number
    max: number
  }
  estimatedDays: number
  technicalNotes: string[]
  recommendedMaterials: string[]
  chosenBrandSystem?: string
  generatedAt: string
}

export interface UploadedFile {
  name: string
  size: number
  type: string
  dataUrl?: string
}

export interface ProjectInquiry {
  id: string
  createdAt: string
  status: 'uus' | 'pakkumised_avatud' | 'töös' | 'lõpetatud'

  // Kliendi info ja tüüp
  clientType: ClientType // 'private' (eraisik) või 'contractor_b2b' (peatöövõtja)
  isB2BProject?: boolean // Suurem B2B arendus / kortermaja
  minTierRequired?: SubscriptionTier // Ainult 25€ B2B Pro paketiga ligipääsetav

  clientName: string
  clientEmail: string
  clientPhone: string
  companyName?: string
  city: string
  address?: string

  // Objekti info
  roomType: string
  roomTypeLabel: string
  serviceType: ServiceType

  // Süsteemi eelistus (MIRA, Mapei, Weber jne)
  systemBrand: SystemBrand
  systemBrandLabel: string

  // Mahutabel & mõõdud
  scope: ScopeOfWork

  // Plaatide / mikrotsemendi spetsifikatsioon
  tileSpecs?: TileSpecs
  microcementSpecs?: MicrocementSpecs

  description: string
  files: UploadedFile[]

  // AI pakkumine ja visualiseeringud
  aiEstimate: AIEstimate
  aiVisualizations: string[]

  // Laekunud pakkumised
  quotesCount?: number
}

export interface GalleryItem {
  id: string
  tilerId: string
  title: string
  roomType: string
  serviceType: ServiceType
  imageUrl: string
  beforeImageUrl?: string
  description?: string
  tileDetails?: string
  completedYear?: string
}

export interface TilerProfile {
  id: string
  name: string
  companyName: string
  registryCode?: string
  avatarUrl: string
  city: string
  serviceRegions: string[]
  services: ServiceType[]
  experienceYears: number
  phone: string
  email: string
  rating: number
  reviewsCount: number
  completedJobsCount: number
  bio: string
  badges: string[]
  gallery: GalleryItem[]
  verified: boolean

  // Monetiseerimine & paketid
  subscriptionTier: SubscriptionTier // 'free' (3 päringut/k), 'pro_1290' (piiramatu era), 'vip_b2b_2500' (B2B peatöövõtjad)
  quotesUsedThisMonth: number
  quotesLimit: number // nt 3 või -1 (piiramatu)
  featuredUntil?: string
}

export interface ContractorQuote {
  id: string
  projectId: string
  tilerId: string
  tilerName: string
  tilerCompany: string
  tilerAvatar: string
  tilerRating: number
  tilerCity: string
  tilerTier?: SubscriptionTier

  laborPrice: number
  materialPrice: number
  totalPrice: number
  materialsIncluded: boolean

  estimatedStartDate: string
  estimatedDuration: string
  warrantyYears: number
  comment: string
  status: 'esitatud' | 'aktsepteeritud' | 'tagasi_lükatud'
  createdAt: string
}

export interface ChatMessage {
  id: string
  projectId: string
  conversationId: string
  senderType: 'client' | 'tiler'
  senderName: string
  message: string
  createdAt: string
}

export interface Conversation {
  id: string
  projectId: string
  tilerId: string
  clientEmail: string
  messages: ChatMessage[]
  lastMessageAt: string
}

// Reklaamibännerid
export interface AdBanner {
  id: string
  brand: string // 'MIRA' | 'Mapei' | 'Weber' | 'Kiilto' | 'Ceresit' | 'EhituseABC'
  title: string
  subtitle: string
  tagline: string
  ctaText: string
  targetUrl: string
  imageUrl: string
  position: 'top_header' | 'sidebar' | 'inline'
  active: boolean
  accentColor: string
}

// Administraatori tooted ja letihinnad
export interface AdminProduct {
  id: string
  brand: SystemBrand | 'generic'
  category: 'hüdroisolatsioon' | 'plaadiliim' | 'vuugisegu' | 'mikrotsement' | 'tasandus'
  name: string
  unit: 'm²' | 'kg' | 'kott' | 'tk'
  retailPrice: number
  description: string
  inStock: boolean
}

// Tellimuspaketid
export interface PricingPlan {
  id: SubscriptionTier
  name: string
  priceMonthly: number
  description: string
  badge?: string
  features: string[]
  popular?: boolean
  ctaText: string
}
