// ============================================
// Plaatija24 & Mikrotsement – AI Visualiseerimise mootor
// ============================================

import { TileSpecs, MicrocementSpecs, ServiceType } from '@/types'

// Realistlikud arhitektuursed näidisvisualisatsioonid erinevate stiilide ja materjalide jaoks
const CURATED_VISUALIZATIONS: Record<string, { title: string; url: string; tags: string[] }[]> = {
  marble_light: [
    {
      title: 'Valge Carrara marmorplaat 60x120cm luksuslikus vannitoas integreeritud LED-valgusega',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      tags: ['Carrara marmor', '60x120cm', 'Vannituba', 'LED-nišš']
    },
    {
      title: 'Calacatta Gold plaat duširuumis koos messingist sanitaartehnikaga ja 45° jiiridega',
      url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
      tags: ['Calacatta', 'Kuldne veen', 'Jiirid', 'Dušiala']
    }
  ],
  concrete_dark: [
    {
      title: 'Antratsiithall betooni-imitatsiooniga suurplaat 60x120cm minimalistlikus stiilis',
      url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
      tags: ['Antratsiit', '60x120cm', 'Tume betoon', 'Minimalism']
    },
    {
      title: 'Tume kiltkivi ja epoksiidvuuk esikus ning avatud eluruumis',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      tags: ['Kiltkivi', 'Epoksiidvuuk', 'Esik', 'Vastupidav']
    }
  ],
  microcement_warm: [
    {
      title: 'Sujuv vuugivaba mikrotsement soojas beežis liivatoonis siidja mattlakiga',
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      tags: ['Mikrotsement', 'Soe beež', 'Vuugivaba', 'Siidjasmatt']
    },
    {
      title: 'Mikrotsemendist dušinurk ja monoliitne valamulaud Forcrete süsteemiga',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      tags: ['Mikrotsement dušš', 'Monoliitne', 'Veekindel']
    }
  ],
  microcement_grey: [
    {
      title: 'Industriaalne helehall mikrotsement vannitoa seintel ja põrandal',
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      tags: ['Mikrobetoon', 'Helehall', 'Matt viimistlus']
    }
  ],
  herringbone_wood: [
    {
      title: 'Kalasabamustris puiduimitatsiooniga keraamiline plaat soojas tammetoonis',
      url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80',
      tags: ['Kalasaba', 'Puuimitatsioon', 'Vannituba / Köök']
    }
  ],
  mosaic_luxury: [
    {
      title: 'Täppistööna paigaldatud heksagon ja mosaiikplaat dušipõrandal ja aktsentseinal',
      url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
      tags: ['Mosaiik', 'Heksagon', 'Detailitöö']
    }
  ]
}

export function generateVisualizationPrompt(
  roomType: string,
  serviceType: ServiceType,
  tileSpecs?: TileSpecs,
  microcementSpecs?: MicrocementSpecs
): string {
  const parts: string[] = []

  // Ruum
  const roomNames: Record<string, string> = {
    vannituba: 'luxury modern bathroom with warm architectural lighting',
    duss: 'walk-in shower space with frameless glass and recessed LED niche',
    kook: 'contemporary kitchen with tiled backsplash and premium countertops',
    esik: 'spacious entryway with tiled flooring',
    elutuba: 'modern open living area',
    muu: 'interior living space with designer finishes'
  }
  parts.push(roomNames[roomType] || 'modern interior space')

  // Materjalid
  if (serviceType === 'plaat' || serviceType === 'mõlemad') {
    if (tileSpecs) {
      parts.push(`${tileSpecs.sizeLabel || tileSpecs.size} tiles in ${tileSpecs.colorStyle || 'neutral tones'}`)
      parts.push(`${tileSpecs.finish} surface finish, razor sharp 45 degree mitered edges`)
      if (tileSpecs.jointType === 'epoxy') {
        parts.push('seamless tone-on-tone epoxy grout joints')
      }
    } else {
      parts.push('large format porcelain tiles, minimalist grout lines')
    }
  }

  if (serviceType === 'mikrotsement' || serviceType === 'mõlemad') {
    if (microcementSpecs) {
      parts.push(`seamless continuous ${microcementSpecs.colorTone} microcement on walls and floor`)
      parts.push(`${microcementSpecs.finish} polyurethane protective coat, delicate artisan trowel texture`)
    } else {
      parts.push('seamless continuous microcement finish with subtle hand-troweled texture')
    }
  }

  parts.push('architectural digest photography, 8k resolution, ultra photorealistic, interior design portfolio')

  return parts.join(', ')
}

export function getAIVisualizations(
  serviceType: ServiceType,
  tileSpecs?: TileSpecs,
  microcementSpecs?: MicrocementSpecs
): string[] {
  const results: string[] = []

  // Kui valitud on mikrotsement
  if (serviceType === 'mikrotsement') {
    const tone = (microcementSpecs?.colorTone || '').toLowerCase()
    if (tone.includes('soe') || tone.includes('beež') || tone.includes('liiv')) {
      results.push(...CURATED_VISUALIZATIONS.microcement_warm.map(v => v.url))
    } else {
      results.push(...CURATED_VISUALIZATIONS.microcement_grey.map(v => v.url))
      results.push(CURATED_VISUALIZATIONS.microcement_warm[0].url)
    }
    return results
  }

  // Kui mõlemad
  if (serviceType === 'mõlemad') {
    results.push(CURATED_VISUALIZATIONS.marble_light[0].url)
    results.push(CURATED_VISUALIZATIONS.microcement_warm[0].url)
    results.push(CURATED_VISUALIZATIONS.concrete_dark[0].url)
    return results
  }

  // Kui plaat
  if (tileSpecs) {
    if (tileSpecs.size === 'herringbone') {
      results.push(...CURATED_VISUALIZATIONS.herringbone_wood.map(v => v.url))
    } else if (tileSpecs.size === 'mosaic') {
      results.push(...CURATED_VISUALIZATIONS.mosaic_luxury.map(v => v.url))
    } else {
      const color = (tileSpecs.colorStyle || '').toLowerCase()
      if (color.includes('antratsiit') || color.includes('hall') || color.includes('must') || color.includes('betoon')) {
        results.push(...CURATED_VISUALIZATIONS.concrete_dark.map(v => v.url))
      } else {
        results.push(...CURATED_VISUALIZATIONS.marble_light.map(v => v.url))
      }
    }
  }

  // Fallback kui pole veel tulemusi
  if (results.length === 0) {
    results.push(CURATED_VISUALIZATIONS.marble_light[0].url)
    results.push(CURATED_VISUALIZATIONS.concrete_dark[0].url)
  }

  return results
}
