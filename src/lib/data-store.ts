// ============================================
// Plaatija24 & Mikrotsement – Andmehaldus ja äriloogika
// ============================================

import {
  TilerProfile,
  ProjectInquiry,
  ContractorQuote,
  ChatMessage,
  Conversation,
  GalleryItem,
  AdBanner,
  AdminProduct,
  PricingPlan,
  SubscriptionTier,
  SystemBrand,
  WorkPricingRule,
  PlatformFeedback
} from '@/types'
import { supabase } from '@/lib/supabase'

// EESTI TURU PIIRKONNAD (maakonnad ja tõmbekeskused)
export const ESTONIAN_REGIONS = [
  'Tallinn ja Harjumaa',
  'Tartu ja Tartumaa',
  'Pärnumaa',
  'Ida-Virumaa',
  'Lääne-Virumaa',
  'Viljandimaa',
  'Kogu Eesti / Objekt väljaspool suuremaid linnu'
] as const

// HINNAKIRJA PAKETID PLAATIJATELE
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Alustav Meister',
    priceMonthly: 0,
    description: 'Tutvu platvormiga ja vasta esimestele klientidele tasuta',
    features: [
      'Kõik eraklientide päringud on nähtaval (24h viivitusega)',
      'Maksimaalselt 3 pakkumist kuus',
      'Avalik meistriprofiil ja fotogalerii',
      'Otsesuhtlus kiirsõnumitega',
      'AI turuhindade kalkulatsiooni nägemine'
    ],
    ctaText: 'Hetkel aktiivne (Tasuta)'
  },
  {
    id: 'pro_1290',
    name: 'Aktiivne Meister PRO',
    priceMonthly: 12.90,
    description: 'Varajase liituja erihind! Ideaalne igapäevasele plaatijale ja mikrotsemendi paigaldajale',
    badge: 'Kõige populaarsem',
    popular: true,
    features: [
      'Piiramatu arv pakkumiste esitamist erapäringutele',
      'Kohesed e-posti teavitused uutest objektidest (ilma viivituseta)',
      'Esiletõstetud profiil ja märge "Kinnitatud Meister PRO"',
      '🛡️ Esimese objekti garantii: kui 60 päevaga tööd ei võida, pikendame tasuta',
      'Aastapaketiga -20% soodsam (124 € / aasta)',
      'Prioriteetne klienditugi'
    ],
    ctaText: 'Vali PRO pakett (12.90 € / kuu)'
  },
  {
    id: 'vip_b2b_2500',
    name: 'Peatöövõtjad & Äri PRO',
    priceMonthly: 49.00,
    description: 'Suuremahulised B2B objektid, kortermajad, arendused ja peatöövõtjate hanked',
    badge: 'Maksimaalne tulu',
    features: [
      '💎 Eksklusiivne ligipääs PEATÖÖVÕTJATE ja arendajate B2B hangetele',
      'Piiramatu pakkumiste esitamine KÕIGILE objektidele',
      'VIP positsioon avalikus kataloogis esilehel',
      'Otsene kontakt peatöövõtjate projektijuhtidega',
      'Ettevõtte logo ja sertifikaatide esiletõst',
      'Isiklik kliendihaldur'
    ],
    ctaText: 'Vali B2B Äripakett (49.00 € / kuu)'
  }
]

// TURU HINNAKIRJA REEGLID (Ehitus Art Design Topciment 2026 + Remondisemu + Remonditurg)
export const DEFAULT_PRICING_RULES: WorkPricingRule[] = [
  // 1. MIKROTSEMENT (Topciment süsteem)
  {
    id: 'microcement_wall',
    category: 'mikrotsement',
    title: 'Mikrotsement seintele (Topciment süsteem)',
    description: 'Nakkekrunt, 2x aluskiht (Base), 2x viimistlus (Fino), vahelihvimised ja 2-komponentne PU kaitsekiht',
    unit: 'm²',
    laborPrice: 75.0,
    materialPrice: 48.0,
    enabled: true
  },
  {
    id: 'microcement_floor',
    category: 'mikrotsement',
    title: 'Mikrotsement põrandale (tugevdatud kulumiskiht)',
    description: 'Kõrgendatud koormustaluvusega mikrotsement, mehaaniline ettevalmistus ja kriimustuskindel 2K PU siidlakk',
    unit: 'm²',
    laborPrice: 85.0,
    materialPrice: 52.0,
    enabled: true
  },
  {
    id: 'microcement_min_project',
    category: 'mikrotsement',
    title: 'Mikrotsemendi väikeobjekti baastasu (< 10 m²)',
    description: 'Miinimumtasu väikestele pindadele, mis tagab meistri 4–5 päeva visiitide ja kuivamisaegade katmise',
    unit: 'projekt',
    laborPrice: 950.0,
    materialPrice: 0.0,
    minArea: 10,
    minProjectFee: 950.0,
    enabled: true
  },
  {
    id: 'microcement_over_tile_prep',
    category: 'mikrotsement',
    title: 'Vanade plaatide katmine mikrotsemendiga (armeerimine)',
    description: 'Plaatide karestus, vuukide tasandamine, leelisekindel klaaskiudvõrk ja epoksünakkekrunt',
    unit: 'm²',
    laborPrice: 18.0,
    materialPrice: 14.0,
    enabled: true
  },

  // 2. PLAATIMISTÖÖD (Remondisemu 2026 turg)
  {
    id: 'tile_floor_standard',
    category: 'plaat',
    title: 'Põrandaplaatimine (standard 30x30 kuni 60x60)',
    description: 'Põrandaplaatide rihtimine, liimimine kammlabidaga, tasandussüsteem ja pesu',
    unit: 'm²',
    laborPrice: 36.0,
    materialPrice: 8.5,
    enabled: true
  },
  {
    id: 'tile_wall_standard',
    category: 'plaat',
    title: 'Seinaplaatimine (standard kuni 60x60)',
    description: 'Seinte laseri järgi rihtimine, vertikaalpaigaldus, täppislõiked servades',
    unit: 'm²',
    laborPrice: 38.0,
    materialPrice: 8.5,
    enabled: true
  },
  {
    id: 'tile_large_60x120',
    category: 'plaat',
    title: 'Suurformaatplaadid (60x120cm+)',
    description: 'Kahe mehe tõstmine, spetsiaalne iminapasüsteem, elastne C2TE S1 deformeeruv liim',
    unit: 'm²',
    laborPrice: 58.0,
    materialPrice: 11.5,
    enabled: true
  },
  {
    id: 'tile_slab_xxl',
    category: 'plaat',
    title: 'XXL keraamilised tahvlid / slabid (120x240cm+)',
    description: 'Tippklassi gigantplaatide paigaldus raamiga, täppislõikusmärgis ja S2 klassi liimisäng',
    unit: 'm²',
    laborPrice: 75.0,
    materialPrice: 16.0,
    enabled: true
  },
  {
    id: 'tile_herringbone',
    category: 'plaat',
    title: 'Kalasaba (herringbone) paigaldusmuster',
    description: 'V-kujuline muster, 45° nurkades tihe lõikamistöö ja joondamine',
    unit: 'm²',
    laborPrice: 50.0,
    materialPrice: 9.5,
    enabled: true
  },
  {
    id: 'tile_mosaic',
    category: 'plaat',
    title: 'Mosaiikplaadid (võrgul või paberil)',
    description: 'Ülitäpne sile aluspind, peenhambaga kammlabidas ja detailne vuugipuhastus',
    unit: 'm²',
    laborPrice: 75.0,
    materialPrice: 12.0,
    enabled: true
  },

  // 3. MÄRGRUUMI HÜDROISOLATSIOON & ETTEVALMISTUS
  {
    id: 'waterproofing',
    category: 'ettevalmistus',
    title: 'Märgruumi hüdroisolatsioon (2 kihti + tugevdused)',
    description: 'Nurgatugevduslindid, toruläbiviigud, trapikrae ning 2x ristikihti elastset hüdroisolatsioonimastiksit',
    unit: 'm²',
    laborPrice: 22.0,
    materialPrice: 14.0,
    enabled: true
  },
  {
    id: 'demolition',
    category: 'ettevalmistus',
    title: 'Vana plaadi / katte eemaldamine ja utiliseerimine',
    description: 'Plaatide ja liimijääkide mehaaniline eemaldamine, ehitusprahi kottidesse kogumine',
    unit: 'm²',
    laborPrice: 14.0,
    materialPrice: 0.0,
    enabled: true
  },
  {
    id: 'leveling',
    category: 'ettevalmistus',
    title: 'Aluspinna tasandamine ja kruntimine',
    description: 'Süvanakkekrunt ja kiirkõvenev tasandusvalu või seinakrohvimine',
    unit: 'm²',
    laborPrice: 16.0,
    materialPrice: 11.0,
    enabled: true
  },

  // 4. ERITÖÖD JA DETAILID
  {
    id: 'corners_45deg_jiir',
    category: 'viimistlus',
    title: 'Plaatide 45° välisnurkade lihvimine (jiirid)',
    description: 'Kivilõige 45 kraadi alla ilma plast- või metall-liistuta, puhas esteetiline välisnurk',
    unit: 'jm',
    laborPrice: 28.0,
    materialPrice: 0.0,
    enabled: true
  },
  {
    id: 'tile_epoxy_grout',
    category: 'viimistlus',
    title: 'Epoksiidvuukimine ja eripesu emulsiooniga',
    description: '2-komponentne 100% vee- ja kemikaalikindel ning hallitusevaba vuugisüsteem',
    unit: 'm²',
    laborPrice: 15.0,
    materialPrice: 15.0,
    enabled: true
  },
  {
    id: 'silicone',
    category: 'viimistlus',
    title: 'Sanitaarsilikoon perimeetrile ja sisenurkadesse',
    description: 'Hallitusvastane elastomeerne sanitaarsilikoon vuugitooniga sobivas värvis',
    unit: 'jm',
    laborPrice: 4.5,
    materialPrice: 1.0,
    enabled: true
  },
  {
    id: 'niche',
    category: 'eritoo',
    title: 'Seinaniššide ja riiulite plaatimine / vormistus',
    description: 'Kalded, täppislõiked, veetiheduse ja sisenurkade detailne vormistus',
    unit: 'tk',
    laborPrice: 65.0,
    materialPrice: 15.0,
    enabled: true
  },
  {
    id: 'drain',
    category: 'eritoo',
    title: 'Trapikraede ja kallete vormistamine',
    description: 'Ümarlõiked või renntrapi kallete ühildamine põrandapinna ja plaadimustriga',
    unit: 'tk',
    laborPrice: 55.0,
    materialPrice: 15.0,
    enabled: true
  }
]

// PUHAS TÜHI ALGOLEK (Empty State – valmis reaalsete andmete jaoks)
export const SEED_ADS: AdBanner[] = []
export const SEED_ADMIN_PRODUCTS: AdminProduct[] = []
export const SEED_TILERS: TilerProfile[] = []
export const SEED_PROJECTS: ProjectInquiry[] = []
export const SEED_QUOTES: ContractorQuote[] = []
export const SEED_MESSAGES: Record<string, ChatMessage[]> = {}

// STORAGE KEYS
const STORAGE_KEYS = {
  PROJECTS: 'plaatija24_projects_v3',
  TILERS: 'plaatija24_tilers_v3',
  QUOTES: 'plaatija24_quotes_v3',
  MESSAGES: 'plaatija24_messages_v3',
  ADS: 'plaatija24_ads_v3',
  PRODUCTS: 'plaatija24_products_v3',
  PRICING: 'plaatija24_pricing_v4',
  PRICING_RULES: 'plaatija24_pricing_rules_v2',
  FEEDBACK: 'plaatija24_feedback_v1'
}

// HINNAKIRJA REEGLITE HALDUS (2026 turg: Topciment & Remondisemu)
export function getPricingRules(): WorkPricingRule[] {
  if (typeof window === 'undefined') return DEFAULT_PRICING_RULES
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING_RULES)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRICING_RULES, JSON.stringify(DEFAULT_PRICING_RULES))
      return DEFAULT_PRICING_RULES
    }
    const parsed = JSON.parse(raw)
    // Kui salvestatud reeglites on puudu mõni uus reegel, lisame puuduvad vaikereeglid
    if (Array.isArray(parsed)) {
      const existingIds = new Set(parsed.map(r => r.id))
      const missing = DEFAULT_PRICING_RULES.filter(r => !existingIds.has(r.id))
      if (missing.length > 0) {
        const merged = [...parsed, ...missing]
        localStorage.setItem(STORAGE_KEYS.PRICING_RULES, JSON.stringify(merged))
        return merged
      }
      return parsed
    }
    return DEFAULT_PRICING_RULES
  } catch {
    return DEFAULT_PRICING_RULES
  }
}

export function savePricingRules(rules: WorkPricingRule[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.PRICING_RULES, JSON.stringify(rules))

  // Taustasünkroonimine Supabase'i
  try {
    const rows = rules.map(r => ({
      id: r.id,
      category: r.category,
      title: r.title,
      description: r.description,
      unit: r.unit,
      labor_price: r.laborPrice,
      material_price: r.materialPrice,
      min_area: r.minArea || null,
      min_project_fee: r.minProjectFee || null,
      enabled: r.enabled,
      updated_at: new Date().toISOString()
    }))
    supabase.from('pricing_rules').upsert(rows).then(() => {})
  } catch (err) {
    console.debug('Supabase pricing_rules sync skipped:', err)
  }
}

export function resetPricingRules(): WorkPricingRule[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PRICING_RULES, JSON.stringify(DEFAULT_PRICING_RULES))
  }
  return DEFAULT_PRICING_RULES
}

// HELPERS
export function getPricingPlans(): PricingPlan[] {
  if (typeof window === 'undefined') return PRICING_PLANS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING)
    return raw ? JSON.parse(raw) : PRICING_PLANS
  } catch {
    return PRICING_PLANS
  }
}

export function savePricingPlans(plans: PricingPlan[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(plans))
}

export function getAds(): AdBanner[] {
  if (typeof window === 'undefined') return SEED_ADS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADS)
    return raw ? JSON.parse(raw) : SEED_ADS
  } catch {
    return SEED_ADS
  }
}

export function saveAds(ads: AdBanner[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads))
}

export function getAdminProducts(): AdminProduct[] {
  if (typeof window === 'undefined') return SEED_ADMIN_PRODUCTS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    return raw ? JSON.parse(raw) : SEED_ADMIN_PRODUCTS
  } catch {
    return SEED_ADMIN_PRODUCTS
  }
}

export function saveAdminProducts(prods: AdminProduct[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods))
}

export function getTilers(): TilerProfile[] {
  if (typeof window === 'undefined') return SEED_TILERS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TILERS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TILERS, JSON.stringify(SEED_TILERS))
      return SEED_TILERS
    }
    return JSON.parse(raw)
  } catch {
    return SEED_TILERS
  }
}

export function getTilerById(id: string): TilerProfile | undefined {
  return getTilers().find(t => t.id === id)
}

export function updateTilerProfile(updated: TilerProfile): void {
  if (typeof window === 'undefined') return
  const existing = getTilers()
  const exists = existing.some(t => t.id === updated.id)
  const tilers = exists ? existing.map(t => t.id === updated.id ? updated : t) : [updated, ...existing]
  localStorage.setItem(STORAGE_KEYS.TILERS, JSON.stringify(tilers))

  // Taustasünkroonimine Supabase'i
  try {
    supabase.from('tiler_profiles').upsert({
      id: updated.id,
      name: updated.name,
      company_name: updated.companyName,
      registry_code: updated.registryCode,
      avatar_url: updated.avatarUrl,
      city: updated.city,
      service_regions: updated.serviceRegions,
      services: updated.services,
      experience_years: updated.experienceYears,
      phone: updated.phone,
      email: updated.email,
      rating: updated.rating,
      reviews_count: updated.reviewsCount,
      completed_jobs_count: updated.completedJobsCount,
      bio: updated.bio,
      badges: updated.badges,
      verified: updated.verified,
      subscription_tier: updated.subscriptionTier,
      quotes_used_this_month: updated.quotesUsedThisMonth,
      quotes_limit: updated.quotesLimit
    }).then(() => {})
  } catch (err) {
    console.debug('Supabase sync skipped:', err)
  }
}

export function addGalleryItem(tilerId: string, item: GalleryItem): void {
  if (typeof window === 'undefined') return
  const tilers = getTilers().map(t => {
    if (t.id === tilerId) {
      return { ...t, gallery: [item, ...t.gallery] }
    }
    return t
  })
  localStorage.setItem(STORAGE_KEYS.TILERS, JSON.stringify(tilers))

  try {
    supabase.from('gallery_items').insert({
      id: item.id,
      tiler_id: tilerId,
      title: item.title,
      room_type: item.roomType,
      service_type: item.serviceType,
      image_url: item.imageUrl,
      before_image_url: item.beforeImageUrl,
      description: item.description,
      tile_details: item.tileDetails,
      completed_year: item.completedYear
    }).then(() => {})
  } catch (err) {
    console.debug('Supabase sync skipped:', err)
  }
}

export function getProjects(): ProjectInquiry[] {
  if (typeof window === 'undefined') return SEED_PROJECTS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS))
      return SEED_PROJECTS
    }
    return JSON.parse(raw)
  } catch {
    return SEED_PROJECTS
  }
}

export function getProjectById(id: string): ProjectInquiry | undefined {
  return getProjects().find(p => p.id === id)
}

export async function fetchProjectsFromSupabase(): Promise<ProjectInquiry[]> {
  try {
    const { data, error } = await supabase
      .from('project_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return getProjects()

    const mapped: ProjectInquiry[] = data.map(row => ({
      id: row.id,
      createdAt: row.created_at,
      status: row.status,
      clientType: row.client_type || 'private',
      isB2BProject: row.is_b2b_project || false,
      minTierRequired: row.min_tier_required || 'free',
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone || '',
      companyName: row.company_name || undefined,
      city: row.city,
      address: row.address || undefined,
      roomType: row.room_type || 'Vannituba',
      roomTypeLabel: row.room_type_label || 'Vannituba',
      serviceType: row.service_type || 'plaat',
      systemBrand: row.system_brand || 'mira',
      systemBrandLabel: row.system_brand_label || 'MIRA',
      scope: row.scope || { floorArea: 0, wallArea: 0, wallHeight: 2.5, perimeter: 10, levelingRequired: false, waterproofingArea: 0, corners45degCount: 0, nichesCount: 0, drainsCount: 0, siliconeLength: 0, demolitionRequired: false, extras: [] },
      tileSpecs: row.tile_specs || undefined,
      microcementSpecs: row.microcement_specs || undefined,
      description: row.description || '',
      files: row.files || [],
      aiEstimate: row.ai_estimate || {},
      aiVisualizations: row.ai_visualizations || []
    }))

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(mapped))
    }
    return mapped
  } catch (err) {
    console.debug('Failed to fetch projects from Supabase:', err)
    return getProjects()
  }
}

export async function fetchProjectFromSupabase(id: string): Promise<ProjectInquiry | undefined> {
  try {
    const { data, error } = await supabase
      .from('project_inquiries')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) return getProjectById(id)

    const row = data
    const project: ProjectInquiry = {
      id: row.id,
      createdAt: row.created_at,
      status: row.status,
      clientType: row.client_type || 'private',
      isB2BProject: row.is_b2b_project || false,
      minTierRequired: row.min_tier_required || 'free',
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone || '',
      companyName: row.company_name || undefined,
      city: row.city,
      address: row.address || undefined,
      roomType: row.room_type || 'Vannituba',
      roomTypeLabel: row.room_type_label || 'Vannituba',
      serviceType: row.service_type || 'plaat',
      systemBrand: row.system_brand || 'mira',
      systemBrandLabel: row.system_brand_label || 'MIRA',
      scope: row.scope,
      tileSpecs: row.tile_specs || undefined,
      microcementSpecs: row.microcement_specs || undefined,
      description: row.description || '',
      files: row.files || [],
      aiEstimate: row.ai_estimate,
      aiVisualizations: row.ai_visualizations || []
    }

    if (typeof window !== 'undefined') {
      saveProject(project)
    }
    return project
  } catch {
    return getProjectById(id)
  }
}

export function saveProject(project: ProjectInquiry): void {
  if (typeof window === 'undefined') return
  const list = getProjects()
  const filtered = list.filter(p => p.id !== project.id)
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([project, ...filtered]))

  // Taustasünkroonimine Supabase'i
  try {
    supabase.from('project_inquiries').upsert({
      id: project.id,
      client_type: project.clientType,
      is_b2b_project: project.isB2BProject || false,
      min_tier_required: project.minTierRequired || 'free',
      client_name: project.clientName,
      client_email: project.clientEmail,
      client_phone: project.clientPhone,
      company_name: project.companyName,
      city: project.city,
      address: project.address,
      room_type: project.roomType,
      room_type_label: project.roomTypeLabel,
      service_type: project.serviceType,
      system_brand: project.systemBrand,
      system_brand_label: project.systemBrandLabel,
      scope: project.scope,
      tile_specs: project.tileSpecs,
      microcement_specs: project.microcementSpecs,
      description: project.description,
      files: project.files,
      ai_estimate: project.aiEstimate,
      ai_visualizations: project.aiVisualizations,
      status: project.status
    }).then(() => {})
  } catch (err) {
    console.debug('Supabase sync skipped:', err)
  }
}

export function getQuotesForProject(projectId: string): ContractorQuote[] {
  if (typeof window === 'undefined') {
    return SEED_QUOTES.filter(q => q.projectId === projectId)
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTES)
    const list: ContractorQuote[] = raw ? JSON.parse(raw) : SEED_QUOTES
    return list.filter(q => q.projectId === projectId)
  } catch {
    return SEED_QUOTES.filter(q => q.projectId === projectId)
  }
}

export function addQuote(quote: ContractorQuote): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: true }

  // Kontrollime plaatija limiiti
  const tilers = getTilers()
  const currentTiler = tilers.find(t => t.id === quote.tilerId)

  if (currentTiler) {
    // Kui on tasuta konto (free) ja limiit 3 on täis
    if (currentTiler.subscriptionTier === 'free' && currentTiler.quotesUsedThisMonth >= 3) {
      return {
        success: false,
        error: 'LIMIT_EXCEEDED: Tasuta konto 3 pakkumise kuumäär on täis. Vali PRO pakett (12.90 €/kuu), et vastata piiramatult!'
      }
    }

    // Suurendame kasutatud pakkumiste arvu
    currentTiler.quotesUsedThisMonth += 1
    updateTilerProfile(currentTiler)
  }

  const raw = localStorage.getItem(STORAGE_KEYS.QUOTES)
  const list: ContractorQuote[] = raw ? JSON.parse(raw) : SEED_QUOTES
  const updated = [quote, ...list.filter(q => q.id !== quote.id)]
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(updated))

  // Taustasünkroonimine Supabase'i
  try {
    supabase.from('contractor_quotes').upsert({
      id: quote.id,
      project_id: quote.projectId,
      tiler_id: quote.tilerId,
      tiler_name: quote.tilerName,
      tiler_company: quote.tilerCompany,
      tiler_avatar: quote.tilerAvatar,
      tiler_rating: quote.tilerRating,
      tiler_city: quote.tilerCity,
      labor_price: quote.laborPrice,
      material_price: quote.materialPrice,
      total_price: quote.totalPrice,
      materials_included: quote.materialsIncluded,
      estimated_start_date: quote.estimatedStartDate,
      estimated_duration: quote.estimatedDuration,
      warranty_years: quote.warrantyYears,
      comment: quote.comment,
      status: quote.status
    }).then(() => {})
  } catch (err) {
    console.debug('Supabase sync skipped:', err)
  }

  return { success: true }
}

export function getMessagesForProject(projectId: string): ChatMessage[] {
  if (typeof window === 'undefined') {
    return SEED_MESSAGES[projectId] || []
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES)
    const all: Record<string, ChatMessage[]> = raw ? JSON.parse(raw) : SEED_MESSAGES
    return all[projectId] || []
  } catch {
    return SEED_MESSAGES[projectId] || []
  }
}

export function sendChatMessage(message: ChatMessage): void {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES)
  const all: Record<string, ChatMessage[]> = raw ? JSON.parse(raw) : { ...SEED_MESSAGES }
  const current = all[message.projectId] || []
  all[message.projectId] = [...current, message]
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all))

  // Taustasünkroonimine Supabase'i
  try {
    supabase.from('project_messages').insert({
      id: message.id,
      project_id: message.projectId,
      conversation_id: message.conversationId,
      sender_type: message.senderType,
      sender_name: message.senderName,
      message: message.message
    }).then(() => {})
  } catch (err) {
    console.debug('Supabase sync skipped:', err)
  }
}

// TAGASISIDE JA RAPORTID (kliendid & paigaldajad)
export function getFeedbacks(): PlatformFeedback[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addFeedback(fb: PlatformFeedback): void {
  if (typeof window === 'undefined') return
  const list = getFeedbacks()
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify([fb, ...list]))
}

export function resolveFeedback(id: string): void {
  if (typeof window === 'undefined') return
  const updated = getFeedbacks().map(f => f.id === id ? { ...f, status: 'lahendatud' as const } : f)
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(updated))
}
