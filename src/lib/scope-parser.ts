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
  floorKeywords?: RegExp
  wallKeywords?: RegExp
}

const TRADE_MATCHERS: TradeMatcher[] = [
  {
    service: 'plaat',
    keywords: /\b(plaat\w*|plaad\w*|tile\w*|tiling|ceram\w*|плитк\w*|кафел\w*)/i,
    floorKeywords: /\b(põrand\w*|floor\w*|пол\w*)/i,
    wallKeywords: /\b(sein\w*|wall\w*|стен\w*|duš\w*|shower)/i,
  },
  {
    service: 'mikrotsement',
    keywords: /\b(mikrotsem\w*|microcement\w*|микроцемент\w*)/i,
    floorKeywords: /\b(põrand\w*|floor\w*|пол\w*)/i,
    wallKeywords: /\b(sein\w*|wall\w*|стен\w*|duš\w*|shower)/i,
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

function extractNumber(clause: string): number {
  const m = clause.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|м2|м²|ruutu|sqm|tk|punkt\w*|pcs|шт)?/i)
  if (!m) return 0
  return parseFloat(m[1].replace(',', '.')) || 0
}

/**
 * Tuvastab vabas vormis tekstist tööetapid ja nende mahud (m² / tk).
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

  // Jagame teksti osalauseteks (koma, semikoolon, reavahetus, "ja", "ning", "and", "и")
  const clauses = text
    .split(/[,;\n]+|\s+(?:ja|ning|and|и)\s+/i)
    .map(c => c.trim())
    .filter(Boolean)

  const foundSet = new Set<ServiceType>()

  for (const clause of clauses) {
    const qty = extractNumber(clause)

    for (const matcher of TRADE_MATCHERS) {
      if (!matcher.keywords.test(clause)) continue

      foundSet.add(matcher.service)

      if (matcher.service === 'plaat') {
        const area = qty > 0 ? qty : 12
        if (matcher.floorKeywords?.test(clause) && !matcher.wallKeywords?.test(clause)) {
          result.tileFloorArea += area
        } else if (matcher.wallKeywords?.test(clause) && !matcher.floorKeywords?.test(clause)) {
          result.tileWallArea += area
        } else {
          const fl = Math.round(area * 0.25 * 10) / 10
          result.tileFloorArea += fl
          result.tileWallArea += Math.round((area - fl) * 10) / 10
        }
      } else if (matcher.service === 'mikrotsement') {
        const area = qty > 0 ? qty : 10
        if (matcher.floorKeywords?.test(clause) && !matcher.wallKeywords?.test(clause)) {
          result.microFloorArea += area
        } else if (matcher.wallKeywords?.test(clause) && !matcher.floorKeywords?.test(clause)) {
          result.microWallArea += area
        } else {
          const fl = Math.round(area * 0.25 * 10) / 10
          result.microFloorArea += fl
          result.microWallArea += Math.round((area - fl) * 10) / 10
        }
      } else if (matcher.service === 'maalritood') {
        result.paintArea += qty > 0 ? qty : 25
      } else if (matcher.service === 'kipsitood') {
        result.drywallArea += qty > 0 ? qty : 20
      } else if (matcher.service === 'muuriladumine') {
        result.masonryArea += qty > 0 ? qty : 15
      } else if (matcher.service === 'porandatood') {
        result.flooringArea += qty > 0 ? qty : 25
      } else if (matcher.service === 'santehnika_elekter') {
        result.plumbingPoints += qty > 0 ? Math.round(qty) : 4
      } else if (matcher.service === 'fassaad_uldehitus') {
        result.facadeArea += qty > 0 ? qty : 40
      }
    }
  }

  result.detectedServices = Array.from(foundSet)
  result.matchedCount = result.detectedServices.length
  return result
}
