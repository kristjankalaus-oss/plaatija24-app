// ============================================
// Plaatija24 & Mikrotsement – Letihindade AI kalkulaator
// ============================================

import {
  AIEstimate,
  EstimateLineItem,
  ScopeOfWork,
  TileSpecs,
  MicrocementSpecs,
  SystemBrand,
  ServiceType
} from '@/types'

export const SYSTEM_BRAND_INFO: Record<SystemBrand, { name: string; hydro: string; glue: string; grout: string; premiumFactor: number }> = {
  mira: {
    name: 'MIRA Byggeprodukter',
    hydro: 'Mira 4400 multicoat elastne mastiks + safecoat tugevduslindid',
    glue: 'Mira 3130 superfix / 3110 unifix elastne plaadiliim (C2TE S1)',
    grout: 'Mira profug vetthülgav vuugimass ja supersil silikoon',
    premiumFactor: 1.02
  },
  mapei: {
    name: 'MAPEI SpA Itaalia',
    hydro: 'Mapelastic AquaDefense kiirkuivav süsteem + Mapeband nurgalindid',
    glue: 'Mapei Keraflex Maxi S1 deformeeruv tsemendipõhine liim',
    grout: 'Mapei Ultracolor Plus vetthülgav BioBlock vuuk ja Mapesil AC',
    premiumFactor: 1.05
  },
  weber: {
    name: 'Saint-Gobain Weber',
    hydro: 'Weber.tec 822 hüdroisolatsioonimastiks ja mansetid',
    glue: 'Weber vetonit RF / Rex Fix elastne plaadiliim',
    grout: 'Weber classic grout hallitusvastane vuuk',
    premiumFactor: 1.00
  },
  kiilto: {
    name: 'Kiilto Pro Soome',
    hydro: 'Kiilto Kerafiber kiudtugevdatud hüdroisolatsioon ja KeraSafe lindid',
    glue: 'Kiilto Superfix DF / Floorfix plaadiliim',
    grout: 'Kiilto Saumalaasti ja Sanitaarsilikoon',
    premiumFactor: 1.03
  },
  ceresit: {
    name: 'Ceresit (Henkel)',
    hydro: 'Ceresit CL 51 Express 1-K hüdroisolatsioon',
    glue: 'Ceresit CM 17 Super Flex kõrgdeformeeruv liim',
    grout: 'Ceresit CE 40 Aquastatic vuugisegu',
    premiumFactor: 0.98
  },
  none: {
    name: 'Meistri soovitus (Sertifitseeritud ehitussüsteem)',
    hydro: 'Sertifitseeritud 2-kihiline elastne hüdroisolatsioonimastiks',
    glue: 'Kõrgtugev deformeeruv C2TE S1 plaadiliim',
    grout: 'Elastne vetthülgav vuugisegu ja sanitaarsilikoon',
    premiumFactor: 1.00
  }
}

export function calculateAIEstimate(
  serviceType: ServiceType,
  scope: ScopeOfWork,
  tileSpecs?: TileSpecs,
  microcementSpecs?: MicrocementSpecs,
  systemBrand: SystemBrand = 'none'
): AIEstimate {
  const laborItems: EstimateLineItem[] = []
  const materialItems: EstimateLineItem[] = []
  const technicalNotes: string[] = []
  const recommendedMaterials: string[] = []

  const brandInfo = SYSTEM_BRAND_INFO[systemBrand] || SYSTEM_BRAND_INFO.none
  const brandFactor = brandInfo.premiumFactor

  const totalArea = Number(scope.floorArea || 0) + Number(scope.wallArea || 0)
  const floorArea = Number(scope.floorArea || 0)
  const wallArea = Number(scope.wallArea || 0)

  // 1. PINNA ETTEVALMISTUS JA LAMMUTUS
  if (scope.demolitionRequired && totalArea > 0) {
    laborItems.push({
      id: 'demo-1',
      category: 'ettevalmistus',
      title: 'Vana plaadi/katte eemaldus ja utiliseerimine',
      description: 'Olemasoleva pinnakatte lahtivõtmine, prahi kogumine kottidesse',
      quantity: totalArea,
      unit: 'm²',
      unitPrice: 15,
      total: totalArea * 15
    })
    technicalNotes.push('Vana katte eemaldamisel kontrollida aluspinna kandevõimet enne uute kihtide pealekandmist.')
  }

  if (scope.levelingRequired && totalArea > 0) {
    laborItems.push({
      id: 'prep-1',
      category: 'ettevalmistus',
      title: 'Aluspinna tasandamine ja ettevalmistus',
      description: `Kruntimine süvanakkega, aluspinna tasanduskihi paigaldus (${brandInfo.name})`,
      quantity: totalArea,
      unit: 'm²',
      unitPrice: 14,
      total: totalArea * 14
    })
    materialItems.push({
      id: 'mat-prep-1',
      category: 'materjalid',
      title: `Nakkekrunt ja tasandussegu (${brandInfo.name})`,
      description: 'Sertifitseeritud nakkedispersioon ja kiirkõvenev tasandussegu',
      quantity: totalArea,
      unit: 'm²',
      unitPrice: Math.round(11 * brandFactor * 10) / 10,
      total: Math.round(totalArea * 11 * brandFactor)
    })
    recommendedMaterials.push(`${brandInfo.name} aluspinnatooted ja tasandussegud`)
  }

  // 2. HÜDROISOLATSIOON
  const hydroArea = Number(scope.waterproofingArea || 0)
  if (hydroArea > 0) {
    laborItems.push({
      id: 'hydro-labor',
      category: 'hüdroisolatsioon',
      title: 'Hüdroisolatsiooni paigaldus (2 kihti)',
      description: 'Kanga/nurgatugevduste paigaldus, trapikrae tihendamine, 2x hüdroisolatsioonimastiks',
      quantity: hydroArea,
      unit: 'm²',
      unitPrice: 16,
      total: hydroArea * 16
    })
    materialItems.push({
      id: 'mat-hydro',
      category: 'materjalid',
      title: `Hüdroisolatsioonikomplekt: ${brandInfo.hydro}`,
      description: 'Elastne hüdroisolatsioonimastiks, nurgalindid, toruläbiviigud ja trapikrae',
      quantity: hydroArea,
      unit: 'm²',
      unitPrice: Math.round(14 * brandFactor * 10) / 10,
      total: Math.round(hydroArea * 14 * brandFactor)
    })
    recommendedMaterials.push(brandInfo.hydro)
    technicalNotes.push(`Valitud süsteem: ${brandInfo.name}. Tagab ehitusjärelevalve nõuetele vastava veetiheduse ja süsteemigarantii.`)
  }

  // 3. PLAATIMISTÖÖD (kui teenus on 'plaat' või 'mõlemad')
  if (serviceType === 'plaat' || serviceType === 'mõlemad') {
    const tileArea = serviceType === 'mõlemad' ? Math.round(totalArea * 0.6) : totalArea

    let tileUnitPrice = 32
    let tileUnitDesc = 'Standardformaat (nt 30x60 / 60x60)'
    let adhesivePrice = 8.5 * brandFactor

    if (tileSpecs) {
      if (tileSpecs.size === 'mosaic') {
        tileUnitPrice = 58
        tileUnitDesc = 'Mosaiikplaadid (nõuab ülitäpset aluspinda ja siledat liimisängi)'
        adhesivePrice = 11 * brandFactor
      } else if (tileSpecs.size === 'herringbone') {
        tileUnitPrice = 48
        tileUnitDesc = 'Kalasaba paigaldusmuster (suurem lõikamis- ja rihtimistöö)'
        adhesivePrice = 9.5 * brandFactor
      } else if (tileSpecs.size === 'large_60x120') {
        tileUnitPrice = 42
        tileUnitDesc = 'Suurformaat 60x120cm (nõuab spetsiaalseid plaadikandureid ja kiilsüsteemi)'
        adhesivePrice = 10 * brandFactor
      } else if (tileSpecs.size === 'slab_large') {
        tileUnitPrice = 72
        tileUnitDesc = 'XL keraamiline plaat / slab (120x240cm+ kahemehe paigaldus)'
        adhesivePrice = 16 * brandFactor
      }
    }

    if (tileArea > 0) {
      laborItems.push({
        id: 'tile-labor',
        category: 'paigaldus',
        title: `Plaatimistööd (${tileUnitDesc})`,
        description: 'Plaatide lõikamine, rihtimine, liimimine kiilsüsteemiga ja puhastamine',
        quantity: tileArea,
        unit: 'm²',
        unitPrice: tileUnitPrice,
        total: tileArea * tileUnitPrice
      })

      materialItems.push({
        id: 'mat-tile-glue',
        category: 'materjalid',
        title: `Plaadiliim: ${brandInfo.glue}`,
        description: 'Kõrgtugev deformeeruv plaadiliim, kiilsüsteemi klambrid ja kiilud',
        quantity: tileArea,
        unit: 'm²',
        unitPrice: Math.round(adhesivePrice * 10) / 10,
        total: Math.round(tileArea * adhesivePrice)
      })
      recommendedMaterials.push(brandInfo.glue)
    }

    // Epoksiidvuuk vs tsemendivuuk
    const isEpoxy = tileSpecs?.jointType === 'epoxy'
    if (tileArea > 0) {
      if (isEpoxy) {
        laborItems.push({
          id: 'tile-epoxy',
          category: 'viimistlus',
          title: 'Epoksiidvuukimine ja eripesu',
          description: '2-komponentse epoksiidvuugimassi pealekandmine ja eripesu emulsiooniga',
          quantity: tileArea,
          unit: 'm²',
          unitPrice: 14,
          total: tileArea * 14
        })
        materialItems.push({
          id: 'mat-epoxy',
          category: 'materjalid',
          title: 'Epoksiidvuugimass ja puhastuskemikaalid',
          description: '100% vee- ja kemikaalikindel antibakteriaalne vuuk',
          quantity: tileArea,
          unit: 'm²',
          unitPrice: 15,
          total: tileArea * 15
        })
        technicalNotes.push('Epoksiidvuuk tagab täieliku veetiheduse ja määrdumiskindluse, eriti dušinurkades ja köökides.')
      } else {
        materialItems.push({
          id: 'mat-grout',
          category: 'materjalid',
          title: `Vuugisegu: ${brandInfo.grout}`,
          description: 'Elastne peenteraga vuugisegu (vuukimine sisaldub paigalduse baashinnas)',
          quantity: tileArea,
          unit: 'm²',
          unitPrice: Math.round(3.5 * brandFactor * 10) / 10,
          total: Math.round(tileArea * 3.5 * brandFactor)
        })
        recommendedMaterials.push(brandInfo.grout)
      }
    }
  }

  // 4. MIKROTSEMENT (kui teenus on 'mikrotsement' või 'mõlemad')
  if (serviceType === 'mikrotsement' || serviceType === 'mõlemad') {
    const microArea = serviceType === 'mõlemad' ? Math.round(totalArea * 0.4) : totalArea

    if (microArea > 0) {
      laborItems.push({
        id: 'micro-labor',
        category: 'paigaldus',
        title: 'Mikrotsemendi paigaldus (mitmekihiline süsteem)',
        description: 'Epokrunt + klaaskiudvõrk, aluskihid (Base), 2 viimistluskihti (Medium/Fino), lihvimine ja 2x PU kaitsekiht',
        quantity: microArea,
        unit: 'm²',
        unitPrice: 68,
        total: microArea * 68
      })

      materialItems.push({
        id: 'mat-micro-system',
        category: 'materjalid',
        title: 'Professionaalne mikrotsemendi süsteemikomplekt',
        description: 'Polümeervaigud, mikrotsemendi kuivsegud, pigmendid, poorisulgur ja 2-komponentne PU matt/siidlakk',
        quantity: microArea,
        unit: 'm²',
        unitPrice: 38,
        total: microArea * 38
      })
      recommendedMaterials.push('Topciment / Forcrete / Bautech mikrobetoonsüsteem koos 2K PU lakiga')
      technicalNotes.push('Mikrotsement vajab pärast lakkimist min 7 päeva täielikku kivinemist enne intensiivset veekoormust.')
    }
  }

  // 5. ERITÖÖD JA DETAILID (Jiirid, nišid, trapid, silikoon)
  const jiirLength = Number(scope.corners45degCount || 0)
  if (jiirLength > 0) {
    laborItems.push({
      id: 'jiir-labor',
      category: 'viimistlus',
      title: 'Plaatide 45° välisnurkade lihvimine (jiirid)',
      description: 'Välisnurkade faasimine 45 kraadi alla ilma plastik/metall-liistuta, esteetiline kivilõige',
      quantity: jiirLength,
      unit: 'jm',
      unitPrice: 28,
      total: jiirLength * 28
    })
    technicalNotes.push('45° jiirid annavad esmaklassilise esteetika ilma plastliistudeta.')
  }

  const niches = Number(scope.nichesCount || 0)
  if (niches > 0) {
    laborItems.push({
      id: 'niche-labor',
      category: 'paigaldus',
      title: 'Seinaniššide ja riiulite plaatimine / vormistus',
      description: 'Kalded, täppislõiked, hüdroisolatsiooni ja nurkade detailne vormistus',
      quantity: niches,
      unit: 'tk',
      unitPrice: 65,
      total: niches * 65
    })
  }

  const drains = Number(scope.drainsCount || 0)
  if (drains > 0) {
    laborItems.push({
      id: 'drain-labor',
      category: 'paigaldus',
      title: 'Trapikraede ja kallete vormistamine',
      description: 'Ümarlõiked või renntrapi kallete ühildamine plaadimustriga',
      quantity: drains,
      unit: 'tk',
      unitPrice: 55,
      total: drains * 55
    })
  }

  const siliconeLen = Number(scope.siliconeLength || 0) || Math.round(Number(scope.perimeter || 0) * 1.5)
  if (siliconeLen > 0) {
    laborItems.push({
      id: 'silicone-labor',
      category: 'viimistlus',
      title: 'Sanitaarsilikooni paigaldus nurkadesse ja perimeetrile',
      description: 'Hallituskindel elastne hermetiseerimine vuugitooniga sobiva silikooniga',
      quantity: siliconeLen,
      unit: 'jm',
      unitPrice: 3.5,
      total: siliconeLen * 3.5
    })
    materialItems.push({
      id: 'mat-silicone',
      category: 'materjalid',
      title: 'Sanitaarsilikoon ja abivahendid',
      description: 'Seenevastane elastomeerne sanitaarsilikoon',
      quantity: Math.max(1, Math.ceil(siliconeLen / 10)),
      unit: 'tk',
      unitPrice: 9.5,
      total: Math.max(1, Math.ceil(siliconeLen / 10)) * 9.5
    })
  }

  if (laborItems.length === 0) {
    laborItems.push({
      id: 'fallback-labor',
      category: 'paigaldus',
      title: 'Plaatimis- ja paigaldustööd',
      quantity: 1,
      unit: 'kmpl',
      unitPrice: 500,
      total: 500
    })
  }

  const laborSubtotal = Math.round(laborItems.reduce((sum, item) => sum + item.total, 0))
  const materialSubtotal = Math.round(materialItems.reduce((sum, item) => sum + item.total, 0))
  const netTotal = laborSubtotal + materialSubtotal
  const vat = Math.round(netTotal * 0.22)
  const grossTotal = netTotal + vat

  let estimatedDays = Math.max(2, Math.ceil(totalArea / 6))
  if (scope.waterproofingArea > 0) estimatedDays += 1
  if (serviceType === 'mikrotsement' || serviceType === 'mõlemad') estimatedDays += 2
  if (jiirLength > 6) estimatedDays += 1

  return {
    laborItems,
    materialItems,
    laborSubtotal,
    materialSubtotal,
    netTotal,
    vat,
    grossTotal,
    priceRange: {
      min: Math.round(grossTotal * 0.92),
      max: Math.round(grossTotal * 1.12)
    },
    estimatedDays,
    technicalNotes,
    recommendedMaterials,
    chosenBrandSystem: brandInfo.name,
    generatedAt: new Date().toISOString()
  }
}
