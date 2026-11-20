import { ServiceType } from '@/types'

export interface ParsedScopeResult {
  detectedServices: ServiceType[]
  tileFloorArea: number
  tileWallArea: number
  microFloorArea: number
  microWallArea: number
  paintArea: number
  drywallArea: number
  masonryArea: number
  flooringArea: number
  plumbingPoints: number
  facadeArea: number
  matchedCount: number
}

interface TradeMatcher {
  service: ServiceType
  keywords: RegExp
}

const FLOOR_RE = /\b(põrand\w*|floor\w*|пол\w*)/i
const WALL_RE = /\b(sein\w*|wall\w*|стен\w*|duš\w*|shower)/i

const TRADE_MATCHERS: TradeMatcher[] = [
  {
    service: 'plaat',
    keywords: /\b(plaat\w*|plaad\w*|tile\w*|tiling|ceram\w*|плитк\w*|кафел\w*)/i,
  },
  {
    service: 'mikrotsement',
    keywords: /\b(mikrotsem\w*|microcement\w*|микроцемент\w*)/i,
  },
  {
    service: 'maalritood',
    keywords: /\b(maalr\w*|krohv\w*|pahtel\w*|värv\w*|tapeet\w*|paint\w*|plaster\w*|skim\w*|маляр\w*|штукатур\w*|шпакл\w*|покрас\w*|краск\w*)/i,
  },
  {
    service: 'kipsitood',
    keywords: /\b(kips\w*|karkass\w*|vahesein\w*|drywall|gypsum|гипсокартон\w*|гкл)/i,
  },
  {
    service: 'muuriladumine',
    keywords: /\b(müür\w*|fibo|bauroc|columbia|plokk\w*|tellis\w*|betoon\w*|masonry|brick\w*|block\w*|кладк\w*|кирпич\w*|блок\w*)/i,
  },
  {
    service: 'porandatood',
    keywords: /\b(parkett\w*|lvt|laminaat\w*|tasandus\w*|põrandakate\w*|parquet|flooring|laminate|screed|паркет\w*|ламинат\w*|стяжк\w*)/i,
  },
  {
    service: 'santehnika_elekter',
    keywords: /\b(santeh\w*|toru\w*|wc|trapp\w*|segisti\w*|elektr\w*|kaabel\w*|pistik\w*|valgust\w*|plumb\w*|electr\w*|сантех\w*|электр\w*|труб\w*)/i,
  },
  {
    service: 'fassaad_uldehitus',
    keywords: /\b(fassaad\w*|soojust\w*|terrass\w*|üldehitus\w*|kapitaalremont\w*|facade|insulation|terrace|фасад\w*|утеплен\w*|террас\w*)/i,
  },
]

function extractNumbers(clause: string): number[] {
  const matches = clause.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|м2|м²|ruutu|sqm|tk|punkt\w*|pcs|шт)?/gi)
  const nums: number[] = []
  for (const m of matches) {
    const val = parseFloat(m[1].replace(',', '.'))
    if (!Number.isNaN(val) && val > 0) nums.push(val)
  }
  return nums
}

/**
 * Tuvastab vabas vormis tekstist tööetapid ja nende mahud (m² / tk).
 * Toetab lausete vahel konteksti pärimist (nt "soovin plaatida vannitoa, põrand 6 m2, sein 22 m2").
 */
export function parseFreeTextToScope(text: string): ParsedScopeResult {
  const result: ParsedScopeResult = {
    detectedServices: [],
    tileFloorArea: 0,
    tileWallArea: 0,
    microFloorArea: 0,
    microWallArea: 0,
    paintArea: 0,
    drywallArea: 0,
    masonryArea: 0,
    flooringArea: 0,
    plumbingPoints: 0,
    facadeArea: 0,
    matchedCount: 0,
  }

  if (!text || !text.trim()) return result

  // Jagame teksti osalauseteks (punkt, koma, semikoolon, reavahetus, "ja", "ning", "and", "и")
  const clauses = text
    .split(/[.,;\n]+|\s+(?:ja|ning|and|и)\s+/i)
    .map(c => c.trim())
    .filter(Boolean)

  const foundSet = new Set<ServiceType>()
  let activeTrade: ServiceType | null = null

  for (const clause of clauses) {
    const matchedTrades = TRADE_MATCHERS
      .filter(m => m.keywords.test(clause))
      .map(m => m.service)

    if (matchedTrades.length > 0) {
      for (const tr of matchedTrades) foundSet.add(tr)
      activeTrade = matchedTrades[matchedTrades.length - 1]
    }

    const nums = extractNumbers(clause)
    if (nums.length === 0) continue

    const targetTrade = matchedTrades[0] || activeTrade
    if (!targetTrade) continue

    const qty = nums[nums.length - 1]
    const isFloor = FLOOR_RE.test(clause)
    const isWall = WALL_RE.test(clause)

    if (targetTrade === 'plaat') {
      if (isFloor && !isWall) {
        result.tileFloorArea += qty
      } else if (isWall && !isFloor) {
        result.tileWallArea += qty
      } else {
        const fl = Math.round(qty * 0.25 * 10) / 10
        result.tileFloorArea += fl
        result.tileWallArea += Math.round((qty - fl) * 10) / 10
      }
    } else if (targetTrade === 'mikrotsement') {
      if (isFloor && !isWall) {
        result.microFloorArea += qty
      } else if (isWall && !isFloor) {
        result.microWallArea += qty
      } else {
        const fl = Math.round(qty * 0.25 * 10) / 10
        result.microFloorArea += fl
        result.microWallArea += Math.round((qty - fl) * 10) / 10
      }
    } else if (targetTrade === 'maalritood') {
      result.paintArea += qty
    } else if (targetTrade === 'kipsitood') {
      result.drywallArea += qty
    } else if (targetTrade === 'muuriladumine') {
      result.masonryArea += qty
    } else if (targetTrade === 'porandatood') {
      result.flooringArea += qty
    } else if (targetTrade === 'santehnika_elekter') {
      result.plumbingPoints += Math.round(qty)
    } else if (targetTrade === 'fassaad_uldehitus') {
      result.facadeArea += qty
    }
  }

  // Vaikeväärtused ainult siis, kui tööliik tuvastati, aga ühtegi numbrit ei antud
  if (foundSet.has('plaat') && result.tileFloorArea === 0 && result.tileWallArea === 0) {
    result.tileFloorArea = 3
    result.tileWallArea = 9
  }
  if (foundSet.has('mikrotsement') && result.microFloorArea === 0 && result.microWallArea === 0) {
    result.microFloorArea = 2
    result.microWallArea = 8
  }
  if (foundSet.has('maalritood') && result.paintArea === 0) result.paintArea = 25
  if (foundSet.has('kipsitood') && result.drywallArea === 0) result.drywallArea = 20
  if (foundSet.has('muuriladumine') && result.masonryArea === 0) result.masonryArea = 15
  if (foundSet.has('porandatood') && result.flooringArea === 0) result.flooringArea = 25
  if (foundSet.has('santehnika_elekter') && result.plumbingPoints === 0) result.plumbingPoints = 4
  if (foundSet.has('fassaad_uldehitus') && result.facadeArea === 0) result.facadeArea = 40

  result.detectedServices = Array.from(foundSet)
  result.matchedCount = result.detectedServices.length
  return result
}
