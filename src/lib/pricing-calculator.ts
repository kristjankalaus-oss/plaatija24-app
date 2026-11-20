// ============================================
// Plaatija24 & Mikrotsement – Letihindade AI kalkulaator
// 2026 Turu Hinnakiri: Ehitus Art Design (Topciment) + Remondisemu + Remonditurg
// ============================================

import {
  AIEstimate,
  EstimateLineItem,
  ScopeOfWork,
  TileSpecs,
  MicrocementSpecs,
  SystemBrand,
  ServiceType,
  WorkPricingRule
} from '@/types'
import { getPricingRules, DEFAULT_PRICING_RULES } from '@/lib/data-store'

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
  systemBrand: SystemBrand = 'none',
  customRules?: WorkPricingRule[]
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

  const activeServices = new Set<ServiceType>(
    scope.selectedServices && scope.selectedServices.length > 0 ? scope.selectedServices : [serviceType]
  )
  if (activeServices.has('mõlemad')) {
    activeServices.add('plaat')
    activeServices.add('mikrotsement')
  }

  // Kasutame kas etteantud reegleid, andmepoe reegleid või 2026 vaikereegleid
  const rulesList = (customRules && customRules.length > 0) ? customRules : (typeof window !== 'undefined' ? getPricingRules() : DEFAULT_PRICING_RULES)
  const rulesMap = new Map<string, WorkPricingRule>()
  for (const r of rulesList) {
    rulesMap.set(r.id, r)
  }

  const getR = (id: string, defaultLabor: number, defaultMat: number) => {
    const r = rulesMap.get(id)
    return {
      labor: r && r.enabled ? r.laborPrice : defaultLabor,
      material: r && r.enabled ? r.materialPrice : defaultMat,
      minFee: r?.minProjectFee
    }
  }

  // 1. PINNA ETTEVALMISTUS JA LAMMUTUS
  if (scope.demolitionRequired && totalArea > 0) {
    const rDemo = getR('demolition', 14, 0)
    laborItems.push({
      id: 'demo-1',
      category: 'ettevalmistus',
      title: 'Vana plaadi/katte eemaldus ja utiliseerimine',
      description: 'Olemasoleva pinnakatte lahtivõtmine, liimijääkide eemaldus, prahi kogumine kottidesse',
      quantity: totalArea,
      unit: 'm²',
      unitPrice: rDemo.labor,
      total: totalArea * rDemo.labor
    })
    technicalNotes.push('Vana katte eemaldamisel kontrollida aluspinna kandevõimet enne uute kihtide pealekandmist.')
  }

  if (scope.levelingRequired && totalArea > 0) {
    const rLev = getR('leveling', 16, 11)
    const matPrice = Math.round(rLev.material * brandFactor * 10) / 10
    laborItems.push({
      id: 'prep-1',
      category: 'ettevalmistus',
      title: 'Aluspinna tasandamine ja ettevalmistus',
      description: `Kruntimine süvanakkega, aluspinna tasanduskihi paigaldus (${brandInfo.name})`,
      quantity: totalArea,
      unit: 'm²',
      unitPrice: rLev.labor,
      total: totalArea * rLev.labor
    })
    materialItems.push({
      id: 'mat-prep-1',
      category: 'materjalid',
      title: `Nakkekrunt ja tasandussegu (${brandInfo.name})`,
      description: 'Sertifitseeritud nakkedispersioon ja kiirkõvenev tasandussegu',
      quantity: totalArea,
      unit: 'm²',
      unitPrice: matPrice,
      total: Math.round(totalArea * matPrice)
    })
    recommendedMaterials.push(`${brandInfo.name} aluspinnatooted ja tasandussegud`)
  }

  // Vanade plaatide katmine mikrotsemendiga (kui lammutust ei soovita)
  const isOverTile = Boolean(scope.overTilePrep || (scope.extras && scope.extras.some(e => e.includes('katta') || e.includes('vana_plaat'))))
  if (isOverTile && (serviceType === 'mikrotsement' || serviceType === 'mõlemad') && totalArea > 0 && !scope.demolitionRequired) {
    const rOverTile = getR('microcement_over_tile_prep', 18, 14)
    laborItems.push({
      id: 'over-tile-prep',
      category: 'ettevalmistus',
      title: 'Vanade plaatide armeerimine mikrotsemendi alla',
      description: 'Vuukide eeltäitmine, aluspinna karestus, leelisekindel klaaskiudvõrk ja epoksünakkekrunt',
      quantity: totalArea,
      unit: 'm²',
      unitPrice: rOverTile.labor,
      total: totalArea * rOverTile.labor
    })
    materialItems.push({
      id: 'mat-over-tile',
      category: 'materjalid',
      title: 'Epoksünakkekrunt ja klaaskiudvõrk',
      description: 'Tugevdatud armeerimisvõrk ja 2-komponentne epokrunt',
      quantity: totalArea,
      unit: 'm²',
      unitPrice: rOverTile.material,
      total: totalArea * rOverTile.material
    })
    technicalNotes.push('Vanade plaatide peale paigaldamisel tagab epokrunt ja klaaskiudvõrk, et vanad vuugijooned läbi ei kurna ega pragune.')
  }

  // 2. HÜDROISOLATSIOON
  const hydroArea = Number(scope.waterproofingArea || 0)
  if (hydroArea > 0) {
    const rHydro = getR('waterproofing', 22, 14)
    const matPrice = Math.round(rHydro.material * brandFactor * 10) / 10
    laborItems.push({
      id: 'hydro-labor',
      category: 'hüdroisolatsioon',
      title: 'Hüdroisolatsiooni paigaldus (2 kihti)',
      description: 'Kanga/nurgatugevduste paigaldus, trapikrae tihendamine, 2x elastne hüdroisolatsioonimastiks',
      quantity: hydroArea,
      unit: 'm²',
      unitPrice: rHydro.labor,
      total: hydroArea * rHydro.labor
    })
    materialItems.push({
      id: 'mat-hydro',
      category: 'materjalid',
      title: `Hüdroisolatsioonikomplekt: ${brandInfo.hydro}`,
      description: 'Elastne hüdroisolatsioonimastiks, nurgalindid, toruläbiviigud ja trapikrae',
      quantity: hydroArea,
      unit: 'm²',
      unitPrice: matPrice,
      total: Math.round(hydroArea * matPrice)
    })
    recommendedMaterials.push(brandInfo.hydro)
    technicalNotes.push(`Valitud hüdroisolatsioonisüsteem: ${brandInfo.name}. Märgruumides kohustuslik – tagab ehitusjärelevalve nõuetele vastava veetiheduse.`)
  }

  // 3. PLAATIMISTÖÖD (kui teenus on 'plaat' või 'mõlemad', või kui on määratud plaaditavad ruudud)
  const hasTileExplicit = (scope.tileFloorArea !== undefined && scope.tileFloorArea > 0) || (scope.tileWallArea !== undefined && scope.tileWallArea > 0)
  const isTileService = activeServices.has('plaat') || hasTileExplicit

  if (isTileService) {
    let tFloor = 0
    let tWall = 0

    if (scope.tileFloorArea !== undefined || scope.tileWallArea !== undefined) {
      tFloor = Number(scope.tileFloorArea || 0)
      tWall = Number(scope.tileWallArea || 0)
    } else {
      tFloor = serviceType === 'mõlemad' ? Math.round(floorArea * 0.5) : floorArea
      tWall = serviceType === 'mõlemad' ? Math.round(wallArea * 0.5) : wallArea
      if (tFloor === 0 && tWall === 0 && totalArea > 0) {
        tFloor = Math.round(totalArea * 0.25)
        tWall = totalArea - tFloor
      }
    }

    const isMosaic = tileSpecs?.size === 'mosaic'
    const isHerringbone = tileSpecs?.size === 'herringbone'
    const isLarge60x120 = tileSpecs?.size === 'large_60x120'
    const isSlabXXL = tileSpecs?.size === 'slab_large'

    if (isMosaic) {
      const r = getR('tile_mosaic', 75, 12)
      const q = tFloor + tWall
      if (q > 0) {
        laborItems.push({
          id: 'tile-mosaic-labor',
          category: 'paigaldus',
          title: 'Mosaiikplaatide paigaldus (võrgul või paberil)',
          description: 'Ülitäpne aluspind, peenhambaga kammlabidas ja detailne vuugipuhastus',
          quantity: q,
          unit: 'm²',
          unitPrice: r.labor,
          total: q * r.labor
        })
        materialItems.push({
          id: 'mat-tile-glue',
          category: 'materjalid',
          title: `Valge elastne plaadiliim: ${brandInfo.glue}`,
          description: 'Kõrgtugev deformeeruv C2TE S1 valge liim mosaiigile',
          quantity: q,
          unit: 'm²',
          unitPrice: Math.round(r.material * brandFactor * 10) / 10,
          total: Math.round(q * r.material * brandFactor)
        })
      }
    } else if (isHerringbone) {
      const r = getR('tile_herringbone', 50, 9.5)
      const q = tFloor + tWall
      if (q > 0) {
        laborItems.push({
          id: 'tile-herringbone-labor',
          category: 'paigaldus',
          title: 'Kalasaba (herringbone) mustriga plaatimine',
          description: 'V-kujuline muster, 45° nurkades tihe lõikamistöö ja laserjoondamine',
          quantity: q,
          unit: 'm²',
          unitPrice: r.labor,
          total: q * r.labor
        })
        materialItems.push({
          id: 'mat-tile-glue',
          category: 'materjalid',
          title: `Plaadiliim: ${brandInfo.glue}`,
          description: 'Elastne C2TE S1 plaadiliim ja kiilsüsteem',
          quantity: q,
          unit: 'm²',
          unitPrice: Math.round(r.material * brandFactor * 10) / 10,
          total: Math.round(q * r.material * brandFactor)
        })
      }
    } else if (isLarge60x120) {
      const r = getR('tile_large_60x120', 58, 11.5)
      const q = tFloor + tWall
      if (q > 0) {
        laborItems.push({
          id: 'tile-60x120-labor',
          category: 'paigaldus',
          title: 'Suurformaatplaatide paigaldus (60x120cm+)',
          description: 'Kahe mehe tõstmine, vaakum-iminapasüsteem ja C2TE S1 deformeeruv liim',
          quantity: q,
          unit: 'm²',
          unitPrice: r.labor,
          total: q * r.labor
        })
        materialItems.push({
          id: 'mat-tile-glue',
          category: 'materjalid',
          title: `Plaadiliim suurformaadile: ${brandInfo.glue}`,
          description: 'Kõrgtugev deformeeruv plaadiliim, kiilsüsteemi klambrid ja kiilud',
          quantity: q,
          unit: 'm²',
          unitPrice: Math.round(r.material * brandFactor * 10) / 10,
          total: Math.round(q * r.material * brandFactor)
        })
      }
    } else if (isSlabXXL) {
      const r = getR('tile_slab_xxl', 75, 16)
      const q = tFloor + tWall
      if (q > 0) {
        laborItems.push({
          id: 'tile-xxl-labor',
          category: 'paigaldus',
          title: 'XXL keraamiliste tahvlite / slabide paigaldus (120x240cm+)',
          description: 'Tippklassi gigantplaatide paigaldus kanderaamiga ja S2 elastne liimisäng',
          quantity: q,
          unit: 'm²',
          unitPrice: r.labor,
          total: q * r.labor
        })
        materialItems.push({
          id: 'mat-tile-glue',
          category: 'materjalid',
          title: `S2 klassi deformeeruv liim: ${brandInfo.glue}`,
          description: 'Tugevdatud polümeerliim ja XL tasandussüsteem',
          quantity: q,
          unit: 'm²',
          unitPrice: Math.round(r.material * brandFactor * 10) / 10,
          total: Math.round(q * r.material * brandFactor)
        })
      }
    } else {
      // Standard: eraldi põrand ja sein
      if (tFloor > 0) {
        const rF = getR('tile_floor_standard', 36, 8.5)
        laborItems.push({
          id: 'tile-floor-labor',
          category: 'paigaldus',
          title: 'Põrandaplaatimine (standard 30x30 kuni 60x60)',
          description: 'Põrandaplaatide rihtimine, liimimine kammlabidaga, tasandussüsteem ja pesu',
          quantity: tFloor,
          unit: 'm²',
          unitPrice: rF.labor,
          total: tFloor * rF.labor
        })
        materialItems.push({
          id: 'mat-tile-glue-floor',
          category: 'materjalid',
          title: `Põranda plaadiliim: ${brandInfo.glue}`,
          description: 'Deformeeruv C2TE S1 liim ja tasanduskiilud',
          quantity: tFloor,
          unit: 'm²',
          unitPrice: Math.round(rF.material * brandFactor * 10) / 10,
          total: Math.round(tFloor * rF.material * brandFactor)
        })
      }
      if (tWall > 0) {
        const rW = getR('tile_wall_standard', 38, 8.5)
        laborItems.push({
          id: 'tile-wall-labor',
          category: 'paigaldus',
          title: 'Seinaplaatimine (standard kuni 60x60)',
          description: 'Seinte laseri järgi rihtimine, vertikaalpaigaldus, täppislõiked servades',
          quantity: tWall,
          unit: 'm²',
          unitPrice: rW.labor,
          total: tWall * rW.labor
        })
        materialItems.push({
          id: 'mat-tile-glue-wall',
          category: 'materjalid',
          title: `Seina plaadiliim: ${brandInfo.glue}`,
          description: 'Valgumiskindel C2TE S1 plaadiliim',
          quantity: tWall,
          unit: 'm²',
          unitPrice: Math.round(rW.material * brandFactor * 10) / 10,
          total: Math.round(tWall * rW.material * brandFactor)
        })
      }
    }

    // Epoksiidvuuk vs tsemendivuuk
    const totalTileArea = tFloor + tWall
    const isEpoxy = tileSpecs?.jointType === 'epoxy'
    if (totalTileArea > 0) {
      if (isEpoxy) {
        const rEpoxy = getR('tile_epoxy_grout', 15, 15)
        laborItems.push({
          id: 'tile-epoxy',
          category: 'viimistlus',
          title: 'Epoksiidvuukimine ja eripesu emulsiooniga',
          description: '2-komponentse epoksiidvuugimassi pealekandmine ja eripesu emulsiooniga',
          quantity: totalTileArea,
          unit: 'm²',
          unitPrice: rEpoxy.labor,
          total: totalTileArea * rEpoxy.labor
        })
        materialItems.push({
          id: 'mat-epoxy',
          category: 'materjalid',
          title: 'Epoksiidvuugimass ja puhastuskemikaalid',
          description: '100% vee- ja kemikaalikindel antibakteriaalne vuuk',
          quantity: totalTileArea,
          unit: 'm²',
          unitPrice: rEpoxy.material,
          total: totalTileArea * rEpoxy.material
        })
        technicalNotes.push('Epoksiidvuuk tagab täieliku veetiheduse ja määrdumiskindluse, eriti dušinurkades ja köökides.')
      } else {
        materialItems.push({
          id: 'mat-grout',
          category: 'materjalid',
          title: `Vuugisegu: ${brandInfo.grout}`,
          description: 'Elastne peenteraga vuugisegu (vuukimine sisaldub paigalduse baashinnas)',
          quantity: totalTileArea,
          unit: 'm²',
          unitPrice: Math.round(3.5 * brandFactor * 10) / 10,
          total: Math.round(totalTileArea * 3.5 * brandFactor)
        })
        recommendedMaterials.push(brandInfo.grout)
      }
    }
  }

  // 4. MIKROTSEMENT (Topciment süsteem)
  const hasMicroExplicit = (scope.microFloorArea !== undefined && scope.microFloorArea > 0) || (scope.microWallArea !== undefined && scope.microWallArea > 0)
  const isMicroService = activeServices.has('mikrotsement') || hasMicroExplicit

  if (isMicroService) {
    let mFloor = 0
    let mWall = 0

    if (scope.microFloorArea !== undefined || scope.microWallArea !== undefined) {
      mFloor = Number(scope.microFloorArea || 0)
      mWall = Number(scope.microWallArea || 0)
    } else {
      mFloor = serviceType === 'mõlemad' ? Math.round(floorArea * 0.5) : floorArea
      mWall = serviceType === 'mõlemad' ? Math.round(wallArea * 0.5) : wallArea
      if (mFloor === 0 && mWall === 0 && totalArea > 0) {
        mFloor = Math.round(totalArea * 0.25)
        mWall = totalArea - mFloor
      }
    }
    const totalMicro = mFloor + mWall

    if (totalMicro > 0) {
      const rWall = getR('microcement_wall', 75, 48)
      const rFloor = getR('microcement_floor', 85, 52)
      const rMin = getR('microcement_min_project', 950, 0)

      let microLaborSum = 0

      if (mWall > 0) {
        const totalWallLabor = mWall * rWall.labor
        microLaborSum += totalWallLabor
        laborItems.push({
          id: 'micro-wall-labor',
          category: 'paigaldus',
          title: 'Mikrotsemendi paigaldus seintele (Topciment süsteem)',
          description: 'Nakkekrunt, 2x aluskiht (Base), 2x viimistlus (Fino), vahelihvimised ja 2-komponentne PU kaitsekiht',
          quantity: mWall,
          unit: 'm²',
          unitPrice: rWall.labor,
          total: totalWallLabor
        })
        materialItems.push({
          id: 'mat-micro-wall',
          category: 'materjalid',
          title: 'Topciment seina mikrotsemendi süsteemikomplekt',
          description: 'Nakkedispersioon, Base alussegud, Fino viimistluskiht, pigmendid ja 2K PU lakk',
          quantity: mWall,
          unit: 'm²',
          unitPrice: rWall.material,
          total: mWall * rWall.material
        })
      }

      if (mFloor > 0) {
        const totalFloorLabor = mFloor * rFloor.labor
        microLaborSum += totalFloorLabor
        laborItems.push({
          id: 'micro-floor-labor',
          category: 'paigaldus',
          title: 'Mikrotsemendi paigaldus põrandale (tugevdatud kulumiskiht)',
          description: 'Mehaaniline ettevalmistus, kiudtugevdatud aluskihid, kriimustuskindel 2K PU siidlakk',
          quantity: mFloor,
          unit: 'm²',
          unitPrice: rFloor.labor,
          total: totalFloorLabor
        })
        materialItems.push({
          id: 'mat-micro-floor',
          category: 'materjalid',
          title: 'Topciment põranda mikrotsemendi süsteemikomplekt',
          description: 'Tugevdatud mikrotsemendisegud, eponakkekrunt, kulumiskindel 2-komponentne PU siidlakk',
          quantity: mFloor,
          unit: 'm²',
          unitPrice: rFloor.material,
          total: mFloor * rFloor.material
        })
      }

      // VÄIKEOBJEKTI MIINIMUMTASU (< 10 m²)
      const minFee = rMin.minFee || 950
      if (totalMicro < 10 && microLaborSum < minFee) {
        const diff = minFee - microLaborSum
        laborItems.push({
          id: 'micro-min-project-diff',
          category: 'paigaldus',
          title: 'Mikrotsemendi väikeobjekti baastasu kompensatsioon (< 10 m²)',
          description: 'Tagab meistri 4–5 päeva külastuste (krunt, aluskihid, lihvimised, viimistlus, 2x PU lakk) tasuvuse',
          quantity: 1,
          unit: 'kmpl',
          unitPrice: diff,
          total: diff
        })
        technicalNotes.push('Väikese pinna miinimumtasu tagab sertifitseeritud meistri 4–5 päeva visiitide ja kuivamisaegade katmise.')
      }

      recommendedMaterials.push('Topciment sertifitseeritud mikrotsemendisüsteem (Ehitus Art Design partnerlus)')
      technicalNotes.push('Mikrotsement vajab pärast lakkimist 7 päeva täielikku kivinemist enne intensiivset veekoormust.')
      technicalNotes.push('Igapäevaseks hoolduseks kasutada neutraalseid pH-vahendeid, vältida tugevaid happelisi katlakivieemaldisi.')
    }
  }

  // 4B. MAALRI-, KIPSI-, MÜÜRI-, PÕRANDA-, SANTEHNIKA- JA FASSAADITÖÖD
  const paintQty = Number(scope.paintArea ?? (activeServices.has('maalritood') ? totalArea : 0))
  if ((activeServices.has('maalritood') || (scope.paintArea || 0) > 0) && paintQty > 0) {
    const rPaint = getR('paint_putty_standard', 18, 4.5)
    laborItems.push({
      id: 'paint-labor',
      category: 'viimistlus',
      title: 'Krohvimine, pahteldamine, lihvimine, kruntimine ja 2x värvimine',
      description: 'Lauspahteldus (2 kihti), kruntvärv ja 2 kihti kulumiskindlat seinavärvi',
      quantity: paintQty,
      unit: 'm²',
      unitPrice: rPaint.labor,
      total: paintQty * rPaint.labor
    })
    materialItems.push({
      id: 'mat-paint',
      category: 'materjalid',
      title: 'Krohv, pahtlid, kruntvärv, seinavärv ja teibid',
      quantity: paintQty,
      unit: 'm²',
      unitPrice: rPaint.material,
      total: Math.round(paintQty * rPaint.material)
    })
    technicalNotes.push('Kvaliteetne maalritöö eeldab vahekuivamisi ja lihvimistöid sujuva valguse all.')
  }

  const drywallQty = Number(scope.drywallArea ?? (activeServices.has('kipsitood') ? totalArea : 0))
  if ((activeServices.has('kipsitood') || (scope.drywallArea || 0) > 0) && drywallQty > 0) {
    const rDrywall = getR('drywall_partition', 34, 22)
    laborItems.push({
      id: 'drywall-labor',
      category: 'paigaldus',
      title: 'Kipsvaheseinte ja -lagede ehitus (karkass + vill + plaat)',
      description: 'Metallkarkassi rihtimine, heliisolatsioonivill ja kipsplaatide paigaldus',
      quantity: drywallQty,
      unit: 'm²',
      unitPrice: rDrywall.labor,
      total: drywallQty * rDrywall.labor
    })
    materialItems.push({
      id: 'mat-drywall',
      category: 'materjalid',
      title: 'Kipsplaadid, metallkarkass, vill ja kinnitustarvikud',
      quantity: drywallQty,
      unit: 'm²',
      unitPrice: rDrywall.material,
      total: Math.round(drywallQty * rDrywall.material)
    })
  }

  const masonryQty = Number(scope.masonryArea ?? (activeServices.has('muuriladumine') ? totalArea : 0))
  if ((activeServices.has('muuriladumine') || (scope.masonryArea || 0) > 0) && masonryQty > 0) {
    const rMasonry = getR('masonry_blocks', 42, 32)
    laborItems.push({
      id: 'masonry-labor',
      category: 'paigaldus',
      title: 'Plokkseinte ladumine / betoonitööd',
      description: 'Fibo/Bauroc/Columbia ladumine, armeerimine, sillused või tasandusvalud',
      quantity: masonryQty,
      unit: 'm²',
      unitPrice: rMasonry.labor,
      total: masonryQty * rMasonry.labor
    })
    materialItems.push({
      id: 'mat-masonry',
      category: 'materjalid',
      title: 'Müüriplokid, müürisegu, armatuur ja sillused',
      quantity: masonryQty,
      unit: 'm²',
      unitPrice: rMasonry.material,
      total: Math.round(masonryQty * rMasonry.material)
    })
  }

  const flooringQty = Number(scope.flooringArea ?? (activeServices.has('porandatood') ? floorArea : 0))
  if ((activeServices.has('porandatood') || (scope.flooringArea || 0) > 0) && flooringQty > 0) {
    const rFloor = getR('floor_parquet', 20, 4.5)
    laborItems.push({
      id: 'floor-parquet-labor',
      category: 'paigaldus',
      title: 'Põrandakatete paigaldus (parkett / LVT / laminaat)',
      description: 'Alusvaiba paigaldus, põrandakatte paigaldus ja liistude ettevalmistus',
      quantity: flooringQty,
      unit: 'm²',
      unitPrice: rFloor.labor,
      total: flooringQty * rFloor.labor
    })
    materialItems.push({
      id: 'mat-floor-underlay',
      category: 'materjalid',
      title: 'Aluskate, liimid ja paigaldustarvikud (põrandakate tellija valikul)',
      quantity: flooringQty,
      unit: 'm²',
      unitPrice: rFloor.material,
      total: Math.round(flooringQty * rFloor.material)
    })
  }

  if (activeServices.has('santehnika_elekter') || (scope.plumbingPoints || 0) > 0) {
    const points = Number(scope.plumbingPoints || Math.max(4, Math.round(totalArea / 3)))
    const rPlumb = getR('plumbing_point', 110, 45)
    laborItems.push({
      id: 'plumbing-labor',
      category: 'paigaldus',
      title: 'Santehnilised ja elektritööd (vee-, kanali- ja küttepunktid)',
      description: 'Torustike ja kaabelduse vedu, survestamine ja ühenduste ettevalmistus',
      quantity: points,
      unit: 'tk',
      unitPrice: rPlumb.labor,
      total: points * rPlumb.labor
    })
    materialItems.push({
      id: 'mat-plumb',
      category: 'materjalid',
      title: 'Torud, liitmikud, kaablid ja kinnitustarvikud',
      quantity: points,
      unit: 'tk',
      unitPrice: rPlumb.material,
      total: points * rPlumb.material
    })
  }

  const facadeQty = Number(scope.facadeArea ?? (activeServices.has('fassaad_uldehitus') ? totalArea : 0))
  if ((activeServices.has('fassaad_uldehitus') || (scope.facadeArea || 0) > 0) && facadeQty > 0) {
    const rFacade = getR('facade_insulation', 58, 38)
    laborItems.push({
      id: 'facade-labor',
      category: 'paigaldus',
      title: 'Fassaadi-, terrassi- ja üldehitustööd',
      description: 'Soojustamine, armeerimine ja viimistlus vastavalt objekti mahule',
      quantity: facadeQty,
      unit: 'm²',
      unitPrice: rFacade.labor,
      total: facadeQty * rFacade.labor
    })
    materialItems.push({
      id: 'mat-facade',
      category: 'materjalid',
      title: 'Soojustusplaadid, segud, võrk ja viimistluskrohv',
      quantity: facadeQty,
      unit: 'm²',
      unitPrice: rFacade.material,
      total: Math.round(facadeQty * rFacade.material)
    })
  }

  // 5. ERITÖÖD JA DETAILID (Jiirid, nišid, trapid, silikoon)
  const jiirLength = Number(scope.corners45degCount || 0)
  if (jiirLength > 0) {
    const rJiir = getR('corners_45deg_jiir', 28, 0)
    laborItems.push({
      id: 'jiir-labor',
      category: 'viimistlus',
      title: 'Plaatide 45° välisnurkade lihvimine (jiirid)',
      description: 'Välisnurkade faasimine 45 kraadi alla ilma plastik/metall-liistuta, esteetiline kivilõige',
      quantity: jiirLength,
      unit: 'jm',
      unitPrice: rJiir.labor,
      total: jiirLength * rJiir.labor
    })
    technicalNotes.push('45° jiirid annavad esmaklassilise esteetika ilma plastliistudeta.')
  }

  const niches = Number(scope.nichesCount || 0)
  if (niches > 0) {
    const rNiche = getR('niche', 65, 15)
    laborItems.push({
      id: 'niche-labor',
      category: 'paigaldus',
      title: 'Seinaniššide ja riiulite plaatimine / vormistus',
      description: 'Kalded, täppislõiked, veetiheduse ja nurkade detailne vormistus',
      quantity: niches,
      unit: 'tk',
      unitPrice: rNiche.labor,
      total: niches * rNiche.labor
    })
    materialItems.push({
      id: 'mat-niche',
      category: 'materjalid',
      title: 'Niššide tugevdusmaterjalid ja tihendid',
      quantity: niches,
      unit: 'tk',
      unitPrice: rNiche.material,
      total: niches * rNiche.material
    })
  }

  const drains = Number(scope.drainsCount || 0)
  if (drains > 0) {
    const rDrain = getR('drain', 55, 15)
    laborItems.push({
      id: 'drain-labor',
      category: 'paigaldus',
      title: 'Trapikraede ja kallete vormistamine',
      description: 'Ümarlõiked või renntrapi kallete ühildamine plaadimustriga',
      quantity: drains,
      unit: 'tk',
      unitPrice: rDrain.labor,
      total: drains * rDrain.labor
    })
    materialItems.push({
      id: 'mat-drain',
      category: 'materjalid',
      title: 'Trapikrae tihenduskomplekt ja elastne mansett',
      quantity: drains,
      unit: 'tk',
      unitPrice: rDrain.material,
      total: drains * rDrain.material
    })
  }

  const siliconeLen = Number(scope.siliconeLength || 0) || Math.round(Number(scope.perimeter || 0) * 1.5)
  if (siliconeLen > 0) {
    const rSil = getR('silicone', 4.5, 1.0)
    laborItems.push({
      id: 'silicone-labor',
      category: 'viimistlus',
      title: 'Sanitaarsilikooni paigaldus nurkadesse ja perimeetrile',
      description: 'Hallituskindel elastne hermetiseerimine vuugitooniga sobiva silikooniga',
      quantity: siliconeLen,
      unit: 'jm',
      unitPrice: rSil.labor,
      total: Math.round(siliconeLen * rSil.labor * 10) / 10
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
