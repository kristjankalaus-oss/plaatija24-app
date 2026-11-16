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
  SystemBrand
} from '@/types'
import { supabase } from '@/lib/supabase'

// HINNAKIRJA PAKETID PLAATIJATELE
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Alustav Meister',
    priceMonthly: 0,
    description: 'Tutvu platvormiga ja vasta esimestele klientidele tasuta',
    features: [
      'Kõik eraklientide päringud on nähtaval',
      'Maksimaalselt 3 pakkumist kuus',
      'Avalik meesteprofiil ja fotogalerii',
      'Otsesuhtlus kiirsõnumitega',
      'AI letihindade kalkulatsiooni nägemine'
    ],
    ctaText: 'Hetkel aktiivne (Tasuta)'
  },
  {
    id: 'pro_1290',
    name: 'Aktiivne Meister PRO',
    priceMonthly: 12.90,
    description: 'Ideaalne igapäevaselt tegutsevale plaatijale ja mikrotsemendi paigaldajale',
    badge: 'Kõige populaarsem',
    popular: true,
    features: [
      'Piiramatu arv pakkumiste esitamist erapäringutele',
      'Esiletõstetud profiil meistrite kataloogis',
      'Märge "Kinnitatud Meister PRO"',
      'Kohesed e-posti ja SMS teavitused uutest objektidest',
      'Eelisjärjekorras kiirsõnumite teavitused',
      'Prioriteetne klienditugi'
    ],
    ctaText: 'Vali PRO pakett (12.90 € / kuu)'
  },
  {
    id: 'vip_b2b_2500',
    name: 'Peatöövõtjad & Äri PRO',
    priceMonthly: 25.00,
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
    ctaText: 'Vali B2B Äripakett (25.00 € / kuu)'
  }
]

// REKLAAMIBÄNNERID (MIRA, Mapei, Weber, Kiilto jne)
export const SEED_ADS: AdBanner[] = [
  {
    id: 'ad-mira',
    brand: 'MIRA',
    title: 'mira 4400 multicoat süsteem',
    subtitle: 'Taani tippkvaliteediga sertifitseeritud hüdroisolatsioon ja plaadiliimid.',
    tagline: 'Garantii kuni 10 aastat!',
    ctaText: 'Vaata tooteid ja edasimüüjaid →',
    targetUrl: 'https://mirabyggeprodukter.ee',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    position: 'top_header',
    active: true,
    accentColor: '#d97706'
  },
  {
    id: 'ad-mapei',
    brand: 'Mapei',
    title: 'Mapei Ultracolor Plus & Mapelastic',
    subtitle: 'Kiirkõvenev vett ja mustust hülgav vuuk BioBlock® tehnoloogiaga.',
    tagline: 'Vali üle 40 disainitooni!',
    ctaText: 'Tutvu Mapei värvikaardiga →',
    targetUrl: 'https://www.mapei.com/ee',
    imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
    position: 'sidebar',
    active: true,
    accentColor: '#2563eb'
  },
  {
    id: 'ad-weber',
    brand: 'Weber',
    title: 'Saint-Gobain Weber põrandalahendused',
    subtitle: 'vetonit tasandussegud ja veekindlad plaatimissüsteemid ehitusprofessionaalile.',
    tagline: 'Usaldusväärne partner objektil.',
    ctaText: 'Loe tehnilisi lahendusi →',
    targetUrl: 'https://www.ee.weber',
    imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80',
    position: 'inline',
    active: true,
    accentColor: '#059669'
  }
]

// ADMIN TOOTED JA LETIHINNAD
export const SEED_ADMIN_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod-1',
    brand: 'mira',
    category: 'hüdroisolatsioon',
    name: 'Mira 4400 multicoat mastiks (15 kg)',
    unit: 'kott',
    retailPrice: 68.50,
    description: 'Elastne 1-komponentne hüdroisolatsioonimastiks märgadesse ruumidesse',
    inStock: true
  },
  {
    id: 'prod-2',
    brand: 'mira',
    category: 'plaadiliim',
    name: 'Mira 3130 superfix C2TE S1 (15 kg)',
    unit: 'kott',
    retailPrice: 22.90,
    description: 'Kõrgdeformeeruv valge/hall plaadiliim ka küttega põrandatele',
    inStock: true
  },
  {
    id: 'prod-3',
    brand: 'mapei',
    category: 'hüdroisolatsioon',
    name: 'Mapei Mapelastic AquaDefense (15 kg)',
    unit: 'kott',
    retailPrice: 84.00,
    description: 'Ülikiire kuivamisega (valmis plaatimiseks 4h) hüdroisolatsioon',
    inStock: true
  },
  {
    id: 'prod-4',
    brand: 'mapei',
    category: 'vuugisegu',
    name: 'Mapei Ultracolor Plus (5 kg)',
    unit: 'kott',
    retailPrice: 16.50,
    description: 'Hallitus- ja veekindel peenteraga vuugimass vuukidele 2-20 mm',
    inStock: true
  },
  {
    id: 'prod-5',
    brand: 'weber',
    category: 'tasandus',
    name: 'Weber vetonit 3000 tasandussegu (20 kg)',
    unit: 'kott',
    retailPrice: 17.80,
    description: 'Põrandate viimistlustasandus enne plaatimist ja mikrotsementi',
    inStock: true
  }
]

// SEED PAIGALDAJAD
export const SEED_TILERS: TilerProfile[] = [
  {
    id: 'tiler-1',
    name: 'Andres Tamm',
    companyName: 'NordicTiling OÜ',
    registryCode: '14829104',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
    city: 'Tallinn / Harjumaa',
    serviceRegions: ['Tallinn', 'Harjumaa', 'Raplamaa'],
    services: ['plaat', 'mikrotsement'],
    experienceYears: 14,
    phone: '+372 512 8492',
    email: 'andres@nordictiling.ee',
    rating: 4.9,
    reviewsCount: 38,
    completedJobsCount: 165,
    verified: true,
    bio: 'Pikaajalise kogemusega meister. Spetsialiseerunud suuremõõtmeliste plaatide (kuni 120x278cm) paigaldusele, 45° jiiride lihvimisele ja vannitubade mikrotsemendile. Sertifitseeritud Kiilto, MIRA ja Topciment paigaldaja.',
    badges: ['Top Meister PRO', 'MIRA Sertifitseeritud', 'Suurplaatide spetsialist'],
    subscriptionTier: 'pro_1290',
    quotesUsedThisMonth: 1,
    quotesLimit: -1,
    gallery: [
      {
        id: 'gal-101',
        tilerId: 'tiler-1',
        title: '60x120 Calacatta marmorplaat ja nišivalgustus',
        roomType: 'Vannituba',
        serviceType: 'plaat',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
        description: 'Täielik vannitoa renoveerimine Kakumäel. 45° jiirid, epoksiidvuuk ja süvisvalgustusega šampooninišš.',
        completedYear: '2024'
      },
      {
        id: 'gal-102',
        tilerId: 'tiler-1',
        title: 'Mikrotsement ja keraamika sümbioos duširuumis',
        roomType: 'Duširuum',
        serviceType: 'mikrotsement',
        imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80',
        description: 'Vuugivaba soe mikrotsement seintel, kontrastne must terrazzo põrandal.',
        completedYear: '2024'
      }
    ]
  },
  {
    id: 'tiler-2',
    name: 'Marek Kallas',
    companyName: 'Artisan Surface Stuudio OÜ',
    registryCode: '16049281',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    city: 'Tartu / Lõuna-Eesti',
    serviceRegions: ['Tartu', 'Tartumaa', 'Viljandimaa', 'Võrumaa'],
    services: ['mikrotsement'],
    experienceYears: 9,
    phone: '+372 534 99182',
    email: 'info@artisansurface.ee',
    rating: 5.0,
    reviewsCount: 24,
    completedJobsCount: 92,
    verified: true,
    bio: 'Pühendunud mikrotsemendi ja dekoratiivsete monoliitsete pindade paigaldusele. Teeme veekindlaid lahendusi vannitubadesse, treppidele ja äripindadele ilma ühegi vuugita.',
    badges: ['B2B Äripakett VIP', 'Mikrotsemendi Ekspert', 'Garantii 5a'],
    subscriptionTier: 'vip_b2b_2500',
    quotesUsedThisMonth: 4,
    quotesLimit: -1,
    gallery: [
      {
        id: 'gal-201',
        tilerId: 'tiler-2',
        title: 'Monoliitne helehall mikrotsemendist vannituba',
        roomType: 'Vannituba',
        serviceType: 'mikrotsement',
        imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
        description: 'Seinad, põrand ja renntrapp Forcrete veekindla mikrobetooniga Tartus.',
        completedYear: '2024'
      }
    ]
  },
  {
    id: 'tiler-3',
    name: 'Raivo Saar',
    companyName: 'Saare Plaat & Ehitus',
    registryCode: '12938472',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    city: 'Pärnu / Saaremaa',
    serviceRegions: ['Pärnu', 'Pärnumaa', 'Saaremaa', 'Hiiumaa'],
    services: ['plaat'],
    experienceYears: 18,
    phone: '+372 559 12384',
    email: 'raivo@saareplaat.ee',
    rating: 4.8,
    reviewsCount: 52,
    completedJobsCount: 240,
    verified: true,
    bio: 'Meisterliku käega plaatija. Teinud sadu spaasid, eramaju ja kortereid. Töötan täpselt, puhtalt ja tähtajaliselt.',
    badges: ['Tasuta Pakett (3/3)', 'Spaa- ja Basseiniehitus'],
    subscriptionTier: 'free',
    quotesUsedThisMonth: 3, // Oskab proovida limiidi täitumist!
    quotesLimit: 3,
    gallery: [
      {
        id: 'gal-301',
        tilerId: 'tiler-3',
        title: 'Pärnu suvekodu spaa ja aurusaun',
        roomType: 'Vannituba / Spaa',
        serviceType: 'plaat',
        imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80',
        description: 'Tume antratsiitplaat ja epoksiidvuuk, integreeritud pingid ja kumerused.',
        completedYear: '2024'
      }
    ]
  }
]

// SEED PROJEKTID (sh Peatöövõtja B2B projekt)
export const SEED_PROJECTS: ProjectInquiry[] = [
  {
    id: 'demo-preview',
    createdAt: new Date().toISOString(),
    status: 'pakkumised_avatud',
    clientType: 'private',
    clientName: 'Kristiina Kallas',
    clientEmail: 'kristiina@hot.ee',
    clientPhone: '+372 568 23411',
    city: 'Tallinn, Kristiine',
    address: 'Tedre tn',
    roomType: 'vannituba',
    roomTypeLabel: 'Vannituba',
    serviceType: 'mõlemad',
    systemBrand: 'mira',
    systemBrandLabel: 'MIRA Byggeprodukter',
    scope: {
      floorArea: 6.5,
      wallArea: 22,
      wallHeight: 2.6,
      perimeter: 10.5,
      levelingRequired: true,
      waterproofingArea: 28.5,
      corners45degCount: 8,
      nichesCount: 2,
      drainsCount: 1,
      siliconeLength: 16,
      demolitionRequired: false,
      extras: ['Hüdroisolatsioon', '45° jiirid', 'Nišid', 'Epoksiidvuuk']
    },
    tileSpecs: {
      size: 'large_60x120',
      sizeLabel: 'Suurplaat 60x120cm',
      material: 'portselan',
      finish: 'matt',
      colorStyle: 'Valge Carrara marmor helehallide soontega',
      jointType: 'epoxy',
      jointWidthMm: 1.5,
      tileBrand: 'Marazzi Grande'
    },
    microcementSpecs: {
      system: 'shower_waterproof',
      systemLabel: 'Veekindel dušisüsteem',
      finish: 'siidjas',
      colorTone: 'Soe liivakarva beež',
      texture: 'peenike_sile'
    },
    description: 'Vannitoa täislahendus uues korteris Kristiines. Soovime ühte seina ja dušinurka valge 60x120 marmorplaadiga, teised seinad ja põrand soojas liivakarva mikrotsemendis. Süsteemiks MIRA sertifitseeritud tooted.',
    files: [
      { name: 'vannituba_plaan.pdf', size: 1024 * 450, type: 'application/pdf' },
      { name: 'ruumi_olek.jpg', size: 1024 * 890, type: 'image/jpeg' }
    ],
    aiEstimate: {
      laborItems: [
        {
          id: 'prep-1',
          category: 'ettevalmistus',
          title: 'Aluspinna tasandamine ja ettevalmistus (MIRA)',
          quantity: 28.5,
          unit: 'm²',
          unitPrice: 14,
          total: 399
        },
        {
          id: 'hydro-1',
          category: 'hüdroisolatsioon',
          title: 'Hüdroisolatsiooni paigaldus (Mira 4400 multicoat)',
          quantity: 28.5,
          unit: 'm²',
          unitPrice: 16,
          total: 456
        },
        {
          id: 'tile-1',
          category: 'paigaldus',
          title: 'Plaatimistööd (Suurformaat 60x120cm)',
          quantity: 17,
          unit: 'm²',
          unitPrice: 42,
          total: 714
        },
        {
          id: 'micro-1',
          category: 'paigaldus',
          title: 'Mikrotsemendi paigaldus (mitmekihiline)',
          quantity: 11.5,
          unit: 'm²',
          unitPrice: 68,
          total: 782
        },
        {
          id: 'jiir-1',
          category: 'viimistlus',
          title: '45° välisnurkade lihvimine (jiirid)',
          quantity: 8,
          unit: 'jm',
          unitPrice: 28,
          total: 224
        },
        {
          id: 'niche-1',
          category: 'paigaldus',
          title: 'Seinaniššide ja riiulite plaatimine',
          quantity: 2,
          unit: 'tk',
          unitPrice: 65,
          total: 130
        },
        {
          id: 'epoxy-1',
          category: 'viimistlus',
          title: 'Epoksiidvuukimine ja eripesu',
          quantity: 17,
          unit: 'm²',
          unitPrice: 14,
          total: 238
        }
      ],
      materialItems: [
        {
          id: 'mat-prep',
          category: 'materjalid',
          title: 'Nakkekrunt ja kiirkõvenev tasandussegu',
          quantity: 28.5,
          unit: 'm²',
          unitPrice: 11.2,
          total: 319.2
        },
        {
          id: 'mat-hydro',
          category: 'materjalid',
          title: 'Mira 4400 multicoat + tugevduslindid',
          quantity: 28.5,
          unit: 'm²',
          unitPrice: 14.3,
          total: 407.5
        },
        {
          id: 'mat-glue',
          category: 'materjalid',
          title: 'Mira 3130 superfix elastne plaadiliim',
          quantity: 17,
          unit: 'm²',
          unitPrice: 10.2,
          total: 173.4
        },
        {
          id: 'mat-micro',
          category: 'materjalid',
          title: 'Professionaalne mikrotsemendi süsteem + 2K lakk',
          quantity: 11.5,
          unit: 'm²',
          unitPrice: 38,
          total: 437
        }
      ],
      laborSubtotal: 2963,
      materialSubtotal: 1337.1,
      netTotal: 4300.1,
      vat: 946.02,
      grossTotal: 5246.12,
      priceRange: { min: 4800, max: 5800 },
      estimatedDays: 7,
      technicalNotes: [
        'MIRA sertifitseeritud 10-aastane süsteemigarantii.',
        'Suurformaatplaat (60x120) nõuab kahepoolset liimi pealekandmist (buttering-floating).'
      ],
      recommendedMaterials: [
        'Mira 4400 multicoat elastne mastiks',
        'Mira 3130 superfix elastne liim'
      ],
      chosenBrandSystem: 'MIRA Byggeprodukter',
      generatedAt: new Date().toISOString()
    },
    aiVisualizations: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    quotesCount: 2
  },
  {
    id: 'b2b-project-202',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'pakkumised_avatud',
    clientType: 'contractor_b2b',
    isB2BProject: true,
    minTierRequired: 'vip_b2b_2500', // Ainult 25€ B2B Pro liikmetele!
    clientName: 'Toomas Tammur',
    companyName: 'Merko Ehitus Eesti / Allhanked',
    clientEmail: 'toomas.tammur@hanked-ehitus.ee',
    clientPhone: '+372 519 28310',
    city: 'Tallinn, Põhja-Tallinn (Noblessner)',
    address: 'Lennusadama 14 arendus',
    roomType: 'vannituba',
    roomTypeLabel: 'Korterelamu (16 vannituba)',
    serviceType: 'plaat',
    systemBrand: 'mapei',
    systemBrandLabel: 'MAPEI SpA Itaalia',
    scope: {
      floorArea: 96,
      wallArea: 320,
      wallHeight: 2.7,
      perimeter: 160,
      levelingRequired: false,
      waterproofingArea: 416,
      corners45degCount: 120,
      nichesCount: 16,
      drainsCount: 16,
      siliconeLength: 240,
      demolitionRequired: false,
      extras: ['Hüdroisolatsioon', '45° jiirid', 'Nišid', 'Epoksiidvuuk']
    },
    tileSpecs: {
      size: 'standard_60x60',
      sizeLabel: '60x60 cm keraamiline plaat',
      material: 'portselan',
      finish: 'matt',
      colorStyle: 'Hall kiltkivi ja helehall seinaplaat',
      jointType: 'cement'
    },
    description: 'Noblessneri uusarenduses 16 vannitoa plaatimine ja hüdroisolatsioon. Mahutabelid ja dwg joonised on lisatud. Tööde algus aprillis, otsime kogenud allhankijat. Tasumine etapiviisiliselt vastavalt aktidele.',
    files: [
      { name: 'mahutabel_korterid.xlsx', size: 1024 * 720, type: 'application/vnd.ms-excel' },
      { name: 'siseviimistlus_joonis.pdf', size: 1024 * 1800, type: 'application/pdf' }
    ],
    aiEstimate: {
      laborItems: [
        {
          id: 'b2b-l-1',
          category: 'hüdroisolatsioon',
          title: 'Hüdroisolatsiooni paigaldus (Mapelastic AquaDefense)',
          quantity: 416,
          unit: 'm²',
          unitPrice: 15,
          total: 6240
        },
        {
          id: 'b2b-l-2',
          category: 'paigaldus',
          title: 'Plaatimistööd 60x60 plaat (16 vannituba)',
          quantity: 416,
          unit: 'm²',
          unitPrice: 32,
          total: 13312
        },
        {
          id: 'b2b-l-3',
          category: 'viimistlus',
          title: '45° jiirid ja vuukimine',
          quantity: 120,
          unit: 'jm',
          unitPrice: 26,
          total: 3120
        }
      ],
      materialItems: [
        {
          id: 'b2b-m-1',
          category: 'materjalid',
          title: 'Mapei hüdroisolatsiooni ja liimisüsteem (hankehind)',
          quantity: 416,
          unit: 'm²',
          unitPrice: 21,
          total: 8736
        }
      ],
      laborSubtotal: 22672,
      materialSubtotal: 8736,
      netTotal: 31408,
      vat: 6909.76,
      grossTotal: 38317.76,
      priceRange: { min: 36000, max: 42000 },
      estimatedDays: 25,
      technicalNotes: ['B2B allhanke leping, nõutav MTR registreering ja garantii.'],
      recommendedMaterials: ['MAPEI Mapelastic AquaDefense'],
      chosenBrandSystem: 'MAPEI SpA Itaalia',
      generatedAt: new Date().toISOString()
    },
    aiVisualizations: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80'
    ],
    quotesCount: 1
  }
]

export const SEED_QUOTES: ContractorQuote[] = [
  {
    id: 'quote-101',
    projectId: 'demo-preview',
    tilerId: 'tiler-1',
    tilerName: 'Andres Tamm',
    tilerCompany: 'NordicTiling OÜ',
    tilerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
    tilerRating: 4.9,
    tilerCity: 'Tallinn',
    tilerTier: 'pro_1290',
    laborPrice: 2850,
    materialPrice: 1550,
    totalPrice: 4400,
    materialsIncluded: true,
    estimatedStartDate: '2 nädala pärast',
    estimatedDuration: '6 tööpäeva',
    warrantyYears: 3,
    comment: 'Tere Kristiina! Vaatasin teie projekti üle. MIRA 4400 multicoat süsteem on meil laos olemas ja anname ametliku sertifikaadi.',
    status: 'esitatud',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
]

export const SEED_MESSAGES: Record<string, ChatMessage[]> = {
  'demo-preview': [
    {
      id: 'msg-1',
      projectId: 'demo-preview',
      conversationId: 'demo-preview-tiler-1',
      senderType: 'tiler',
      senderName: 'Andres Tamm (NordicTiling PRO)',
      message: 'Tere! Kas MIRA süsteemi tooted hangite ise või soovite, et toome materjalid koos hulgisoodustusega?',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ]
}

// STORAGE KEYS
const STORAGE_KEYS = {
  PROJECTS: 'plaatija24_projects_v2',
  TILERS: 'plaatija24_tilers_v2',
  QUOTES: 'plaatija24_quotes_v2',
  MESSAGES: 'plaatija24_messages_v2',
  ADS: 'plaatija24_ads_v2',
  PRODUCTS: 'plaatija24_products_v2',
  PRICING: 'plaatija24_pricing_v2'
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
  const tilers = getTilers().map(t => t.id === updated.id ? updated : t)
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
