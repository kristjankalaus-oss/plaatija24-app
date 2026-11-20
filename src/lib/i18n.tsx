'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ServiceType } from '@/types'

export type Locale = 'et' | 'en' | 'ru'

interface LanguageContextValue {
  locale: Locale
  setLocale: (loc: Locale) => void
  t: (key: string) => string
  tService: (id: ServiceType) => { label: string; subtitle: string }
}

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  et: {
    // Brand & Nav
    'brand.tagline': 'Ehitus & Viimistlus',
    'brand.slogan': 'Eelarve sekundiga, pakkumised päevaga. Säästa aega ja raha.',
    'nav.home': 'Avaleht',
    'nav.request': 'Küsi pakkumist (AI)',
    'nav.tilers': 'Meistrid & Firmad',
    'nav.pricing': 'Meistrite paketid',
    'nav.myProjects': 'Minu päringud',
    'nav.myTenders': 'Minu hanked',
    'nav.workspace': 'Töölaud',
    'nav.feedback': 'Tagasiside',
    'nav.admin': 'Admin',
    'nav.submitRequest': '+ Esita päring',
    'nav.login': 'Logi sisse',
    'nav.logout': 'Logi välja',

    // Home Hero
    'home.badge': 'Objekt24 · Eesti ehitus- ja viimistlustööde turuplats',
    'home.h1.prefix': 'Eelarve sekundiga,',
    'home.h1.highlight': 'pakkumised päevaga.',
    'home.h1.suffix': 'Säästa aega ja raha.',
    'home.subtitle': 'Plaatimine, mikrotsement, maalritööd, kipsitööd, müüriladumine ja üldehitus ühest kohast.',
    'home.desc': 'Sisesta objekti mõõdud, fotod või joonised ning meie AI kalkulaator koostab kohese 2026. aasta turuhindadel põhineva eelarve. Saa kindlatelt meistritelt võrreldavad pakkumised ühe päringuga.',
    'home.cta.client': 'Küsi tasuta pakkumist & koosta AI pildid',
    'home.cta.pro': 'Liitu meistrina (0 € – 49 €/k)',
    'home.trust.1': 'Kliendile täiesti tasuta',
    'home.trust.2': 'Eraldi seina ja põranda kalkulatsioon',
    'home.trust.3': 'AI fotorealistlikud pildid',
    'home.trust.4': 'Otsevestlus kiirsõnumites',

    // Bento
    'bento.1.tag': 'Keraamika',
    'bento.1.title': 'Plaatimine & Suurformaat',
    'bento.1.desc': '30×60 · 60×120 · XXL Slabid · Kalasaba · 45° Jiirid',
    'bento.2.tag': 'Vuugivaba',
    'bento.2.title': 'Mikrotsement',
    'bento.2.desc': 'Seinad & põrandad · 2K PU kaitsekiht · Plaadile katmine',
    'bento.3.tag': 'Täislahendus',
    'bento.3.title': 'Maalri-, Kipsi- & Müüritööd',
    'bento.3.desc': 'Pahteldus · Karkass · Fibo/Bauroc · Betoonivalud',
    'bento.4.tag': 'Reaalajas',
    'bento.4.title': 'AI Hinnakalkulaator',
    'bento.4.desc': 'Töö + materjalid eraldi · Kombineeritud seinad & põrand',

    // Standards bar
    'std.1': 'Sertifitseeritud hüdroisolatsioon',
    'std.2': 'Täpne 2026 mahuarvestus',
    'std.3': 'Keraamika & Suurformaat',
    'std.4': 'Vuugivaba Mikrotsement',

    // How it works
    'how.badge': 'Kuidas teenus töötab?',
    'how.title': 'Mugav tellijale, tulus meistrile',
    'how.subtitle': 'Platvorm viib kokku erakliendid, peatöövõtjad ja kvalifitseeritud meistrid üle Eesti',
    'how.s1.title': 'Sisesta andmed & mahud',
    'how.s1.desc': 'Määra seinte ja põranda pindala (plaat vs mikrotsement), töölõigud ning laadi üles fotod ja joonised.',
    'how.s2.title': 'AI hinnaprognoos & pildid',
    'how.s2.desc': 'AI arvutab detailse turuhindadel põhineva kalkulatsiooni ning kujundab realistlikud fotod valmis ruumist.',
    'how.s3.title': 'Meistrite pakkumised',
    'how.s3.desc': 'Registreeritud meistrid ja B2B allhankijad näevad päringut, kohandavad hindu ja saadavad ametliku pakkumise.',
    'how.s4.title': 'Kiirsõnumid & Leping',
    'how.s4.desc': 'Suhtle pakkujatega kiirsõnumites, esita täpsustavaid küsimusi ja lepi kokku tööde algus.',

    // B2B Banner
    'b2b.badge': 'Peatöövõtjatele & Arendajatele (B2B)',
    'b2b.title': 'Suured kortermajad, äripinnad & kiired alltöövõtu etapid',
    'b2b.desc': 'Kas juhid ehitusobjekti või vajad kiiresti lisajõudu lõpetamata etappidele? Lisa hanked koos mahutabelitega — suured põhihanked on avatud 49 € Äri PRO brigaadidele ning kiired etapid ka 12.90 € Meister PRO väikefirmadele.',
    'b2b.cta1': '+ Sisesta B2B hange',
    'b2b.cta2': 'Liitu 49€ B2B meistrina',

    // Pricing preview
    'plan.badge': 'Liitu Platvormiga',
    'plan.title': 'Meistrite & Ettevõtete paketid',
    'plan.subtitle': 'Alusta tasuta või liitu PRO paketiga, et vastata kõigile erapäringutele ja B2B etappidele',
    'plan.perMonth': '/ kuu',
    'plan.free.title': 'Alustav Meister',
    'plan.free.desc': 'Tutvu platvormiga tasuta. Kuni 3 pakkumist kuus erapäringutele.',
    'plan.free.cta': 'Vaata paketti',
    'plan.pro.badge': 'Kõige populaarsem',
    'plan.pro.title': 'Aktiivne Meister PRO',
    'plan.pro.desc': 'Piiramatu arv erapäringuid + peatöövõtjate kiired etapid ja lisajõu tööd.',
    'plan.pro.cta': 'Liitu 12.90 € paketiga',
    'plan.vip.title': 'Peatöövõtjad & Äri PRO',
    'plan.vip.tag': 'B2B Eliit',
    'plan.vip.desc': 'Täielik ligipääs PEATÖÖVÕTJATE B2B põhihangetele ja arendustele.',
    'plan.vip.cta': 'Liitu 49.00 € paketiga',

    // Footer
    'footer.managedBy': 'Haldaja:',
    'footer.email': 'E-post:',
    'footer.admin': 'Admin Paneel',

    // Login
    'login.badge': 'Objekt24 Konto',
    'login.title.login': 'Logi sisse',
    'login.title.register': 'Loo uus konto',
    'login.sub.login': 'Sisene oma kliendi või meistri töölauale',
    'login.sub.register': 'Vali roll ja alusta pakkumiste esitamist või küsimist',
    'login.tab.login': 'Logi sisse',
    'login.tab.register': 'Registreeru',
    'login.role.label': 'Konto tüüp',
    'login.role.tiler': 'Meister / Ehitusfirma',
    'login.role.tilerDesc': 'Tee pakkumisi ja halda profiili',
    'login.role.b2b': 'Peatöövõtja / Arendaja (B2B)',
    'login.role.b2bDesc': 'Sisesta objekte ja hankeid',
    'login.role.client': 'Eraklient / Tellija',
    'login.role.clientDesc': 'Jälgi oma päringuid ja pakkumisi',
    'login.fullName': 'Ees- ja perekonnanimi',
    'login.companyName': 'Ettevõtte nimi',
    'login.email': 'E-post',
    'login.password': 'Parool',
    'login.submit.login': 'Sisene kontole',
    'login.submit.register': 'Loo konto',
    'login.loading': 'Töötleb...',
    'login.backHome': '← Tagasi avalehele',
    'login.err.credentials': 'Vale e-post või parool. Kontrolli andmeid.',
    'login.err.name': 'Palun sisesta oma nimi.',
    'login.err.company': 'Palun sisesta ettevõtte nimi.',
    'login.err.passwordLen': 'Parool peab olema vähemalt 6 tähemärki pikk.',
    'login.err.network': 'Ühenduse viga. Proovi uuesti.',
    'login.success.created': '✅ Konto loodud! Kontrolli oma e-posti kinnituslingi jaoks ja seejärel logi sisse.',

    // Request Form
    'req.header.badge': 'Objekt24 · Nutikas AI eelarvestaja',
    'req.header.title': 'Küsi pakkumist ehitus- ja viimistlustöödele',
    'req.header.desc': 'Täida objekti andmed sekunditega, saa kohene 2026. aasta turuhinnal põhinev kalkulatsioon ning võta vastu meistrite pakkumised.',
    'req.step.1': '1. Töö & Mõõdud',
    'req.step.2': '2. Töölõigud',
    'req.step.3': '3. Materjalid',
    'req.step.4': '4. Kontakt & Saada',
    'req.client.label': 'Kes tellib töö?',
    'req.client.private': 'Eraklient',
    'req.client.privateDesc': 'Kodu, vannituba, remont, juurdeehitus',
    'req.client.b2b': 'Peatöövõtja / Arendaja (B2B)',
    'req.client.b2bDesc': 'Suurhange või kiire etapp objektile',
    'req.b2b.companyLabel': 'Ettevõtte / Arenduse nimi',
    'req.b2b.scopeLabel': 'Hanke ulatus (kellele avatud?)',
    'req.b2b.stageHelper': 'Kiire etapp / Lisajõud',
    'req.b2b.stageHelperDesc': 'Avatud 12.90 € Meister PRO ja 49 € Äri PRO tegijatele',
    'req.b2b.fullProject': 'Tervikprojekt / Suurhange',
    'req.b2b.fullProjectDesc': 'Avatud ainult 49 € Äri PRO brigaadidele',
    'req.service.label': 'Vali töö liik',
    'req.desc.label': 'Töö kirjeldus & erisoovid',
    'req.desc.placeholder': 'Nt. Vannitoa kapitaalremont, vana plaadi eemaldus, kipsseinad, uus plaatimine...',
    'req.files.label': 'Fotod või joonised (valikuline)',
    'req.files.cta': 'Lohista pildid siia või kliki valimiseks',
    'req.area.floor': 'Põranda pindala (m²)',
    'req.area.wall': 'Seinte pindala (m²)',
    'req.area.tileFloor': 'Plaaditav põrand (m²)',
    'req.area.microFloor': 'Mikrotsement põrand (m²)',
    'req.area.tileWall': 'Plaaditavad seinad (m²)',
    'req.area.microWall': 'Mikrotsement seinad (m²)',
    'req.btn.next': 'Edasi →',
    'req.btn.prev': '← Tagasi',
    'req.btn.submit': '🚀 Saada päring meistritele',
    'req.btn.submitting': 'Saadan päringut...',
    'req.contact.name': 'Sinu nimi',
    'req.contact.email': 'E-post',
    'req.contact.phone': 'Telefoninumber (kohustuslik)',
    'req.contact.region': 'Piirkond / Maakond',
    'req.contact.address': 'Täpne aadress või linnaosa (valikuline)',
    'req.timeline.label': 'Millal soovid töödega alustada?',
    'req.timeline.urgent': 'Esimesel võimalusel (1 kuu jooksul)',
    'req.timeline.planned': 'Planeeritud (1–3 kuu jooksul)',
    'req.timeline.browsing': 'Uurin vaid orienteeruvat hinda',
    'req.confirmBudget': 'Kinnitan, et olen tutvunud paremal oleva orienteeruva turuhinnaga ja soovin saada meistrite pakkumisi.',
    'req.sidebar.title': 'Reaalajas AI Eelarve',
    'req.sidebar.subtitle': '2026 Eesti turuhindade prognoos',
    'req.sidebar.labor': 'Tööraha (orienteeruv)',
    'req.sidebar.materials': 'Materjalid (orienteeruv)',
    'req.sidebar.total': 'Kokku orienteeruvalt',
    'req.sidebar.days': 'Tööde kestus',
    'req.sidebar.workDays': 'tööpäeva',
    'req.sidebar.breakdownLabor': 'Töölõigud (rida-realt)',
    'req.sidebar.breakdownMat': 'Materjalid (rida-realt)',
    'req.sidebar.note': 'Sisaldab käibemaksuta/tööjõu turuvahemikku. Täpse hinna saadavad meistrid pärast päringu ülevaatust.',
    'req.err.phone': 'Palun sisesta kehtiv telefoninumber, et meistrid saaksid objekti ülevaatuse kokku leppida.',
    'req.err.budget': 'Palun kinnita enne saatmist, et oled tutvunud orienteeruva turuhinnaga.',

    // Pricing page
    'pricing.badge': 'Meistrite Tellimuspaketid',
    'pricing.title': 'Liitu Objekt24 meistrite võrgustikuga',
    'pricing.subtitle': 'Tellijale on platvorm täiesti tasuta. Vali oma töömahule sobiv pakett ja saa pidevalt uusi tulusaid objekte.',
    'pricing.current': '✓ Praegu valitud pakett',
    'pricing.cancelNote': 'Paketti saab igal ajal muuta või peatada',
    'pricing.ad.badge': 'Reklaamipartneritele & Materjalimüüjatele',
    'pricing.ad.title': 'Reklaamibännerite hinnakiri',

    // Tilers / Feedback / My Projects
    'tilers.badge': 'Kvalifitseeritud tegijad',
    'tilers.title': 'Meistrid & Ehitusfirmad',
    'tilers.subtitle': 'Sirvi kontrollitud meistrite profiile, tehtud töid ja hinnanguid üle Eesti.',
    'tilers.empty': 'Hetkel pole veel avalikke meistriprofiile lisatud. Registreeru meistrina ja ole esimene!',
    'tilers.cta': 'Liitu meistrina',
    'feedback.badge': 'Kliendi ja meistri hääl',
    'feedback.title': 'Tagasiside & Kvaliteedihinnang',
    'feedback.subtitle': 'Aita meil hoida Objekt24 turuplatsi kvaliteeti. Jaga oma kogemust või teata probleemist.',
    'myProjects.title': 'Minu päringud & hanked',
    'myProjects.subtitle': 'Halda oma esitatud töid, vaata meistrite pakkumisi ja suhtle otse.',
    'myProjects.new': '+ Uus päring',
    'myProjects.empty': 'Sul pole veel ühtegi aktiivset päringut.',
  },
  en: {
    // Brand & Nav
    'brand.tagline': 'Construction & Finishing',
    'brand.slogan': 'Estimate in seconds, quotes in a day. Save time and money.',
    'nav.home': 'Home',
    'nav.request': 'Get Quotes (AI)',
    'nav.tilers': 'Pros & Companies',
    'nav.pricing': 'Pro Plans',
    'nav.myProjects': 'My Requests',
    'nav.myTenders': 'My Tenders',
    'nav.workspace': 'Pro Board',
    'nav.feedback': 'Feedback',
    'nav.admin': 'Admin',
    'nav.submitRequest': '+ New Request',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',

    // Home Hero
    'home.badge': 'Objekt24 · Estonian Construction & Finishing Marketplace',
    'home.h1.prefix': 'Estimate in seconds,',
    'home.h1.highlight': 'quotes in a day.',
    'home.h1.suffix': 'Save time and money.',
    'home.subtitle': 'Tiling, microcement, painting, drywall, masonry and general construction in one place.',
    'home.desc': 'Enter your room dimensions, photos or drawings and our AI calculator instantly builds a 2026 market-rate estimate. Receive comparable quotes from verified pros with one request.',
    'home.cta.client': 'Get Free Quotes & AI Visuals',
    'home.cta.pro': 'Join as a Pro (0 € – 49 €/mo)',
    'home.trust.1': '100% free for clients',
    'home.trust.2': 'Separate wall & floor calculation',
    'home.trust.3': 'AI photorealistic renders',
    'home.trust.4': 'Direct in-app messaging',

    // Bento
    'bento.1.tag': 'Ceramics',
    'bento.1.title': 'Tiling & Large Format',
    'bento.1.desc': '30×60 · 60×120 · XXL Slabs · Herringbone · 45° Miters',
    'bento.2.tag': 'Seamless',
    'bento.2.title': 'Microcement',
    'bento.2.desc': 'Walls & floors · 2K PU sealer · Over-tile application',
    'bento.3.tag': 'Full Scope',
    'bento.3.title': 'Painting, Drywall & Masonry',
    'bento.3.desc': 'Plastering · Framing · Fibo/Bauroc · Concrete works',
    'bento.4.tag': 'Real-time',
    'bento.4.title': 'AI Cost Calculator',
    'bento.4.desc': 'Labor + materials split · Combined walls & floors',

    // Standards bar
    'std.1': 'Certified Waterproofing',
    'std.2': 'Accurate 2026 Volume Calc',
    'std.3': 'Ceramics & Large Format',
    'std.4': 'Seamless Microcement',

    // How it works
    'how.badge': 'How it works',
    'how.title': 'Effortless for clients, profitable for pros',
    'how.subtitle': 'Connecting private clients, general contractors and skilled trades across Estonia',
    'how.s1.title': 'Enter dimensions & scope',
    'how.s1.desc': 'Set wall and floor areas (tile vs microcement), work stages, and upload photos or floor plans.',
    'how.s2.title': 'AI estimate & visuals',
    'how.s2.desc': 'AI calculates a detailed market-based budget and generates realistic visuals of the finished space.',
    'how.s3.title': 'Pro quotes arrive',
    'how.s3.desc': 'Verified tradespeople and B2B subcontractors review your brief and send itemized offers.',
    'how.s4.title': 'Chat & Start Work',
    'how.s4.desc': 'Message contractors directly, clarify details and agree on the project start date.',

    // B2B Banner
    'b2b.badge': 'For General Contractors & Developers (B2B)',
    'b2b.title': 'Apartment buildings, commercial spaces & urgent subcontracting stages',
    'b2b.desc': 'Managing a construction site or need extra hands for finishing stages? Post tenders with quantities — full tenders are open to 49 € Business PRO crews, and urgent stage jobs to 12.90 € Pro trades.',
    'b2b.cta1': '+ Post B2B Tender',
    'b2b.cta2': 'Join 49€ B2B Pro',

    // Pricing preview
    'plan.badge': 'Join the Platform',
    'plan.title': 'Plans for Pros & Companies',
    'plan.subtitle': 'Start for free or upgrade to PRO to unlock unlimited private leads and B2B projects',
    'plan.perMonth': '/ mo',
    'plan.free.title': 'Starter Pro',
    'plan.free.desc': 'Try the platform for free. Up to 3 quotes per month on private requests.',
    'plan.free.cta': 'View Plan',
    'plan.pro.badge': 'Most Popular',
    'plan.pro.title': 'Active Meister PRO',
    'plan.pro.desc': 'Unlimited private leads + B2B urgent stage jobs and extra-hands contracts.',
    'plan.pro.cta': 'Choose 12.90 € Plan',
    'plan.vip.title': 'Contractors & Business PRO',
    'plan.vip.tag': 'B2B Elite',
    'plan.vip.desc': 'Full access to general contractor B2B main tenders and developments.',
    'plan.vip.cta': 'Choose 49.00 € Plan',

    // Footer
    'footer.managedBy': 'Operated by:',
    'footer.email': 'Email:',
    'footer.admin': 'Admin Panel',

    // Login
    'login.badge': 'Objekt24 Account',
    'login.title.login': 'Sign In',
    'login.title.register': 'Create Account',
    'login.sub.login': 'Access your client or contractor dashboard',
    'login.sub.register': 'Choose your role to start requesting or sending quotes',
    'login.tab.login': 'Sign In',
    'login.tab.register': 'Register',
    'login.role.label': 'Account Type',
    'login.role.tiler': 'Tradesperson / Construction Co.',
    'login.role.tilerDesc': 'Send quotes & manage profile',
    'login.role.b2b': 'General Contractor / Developer (B2B)',
    'login.role.b2bDesc': 'Post sites & B2B tenders',
    'login.role.client': 'Private Client / Homeowner',
    'login.role.clientDesc': 'Track your requests & quotes',
    'login.fullName': 'Full Name',
    'login.companyName': 'Company Name',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit.login': 'Sign In',
    'login.submit.register': 'Create Account',
    'login.loading': 'Processing...',
    'login.backHome': '← Back to Home',
    'login.err.credentials': 'Invalid email or password. Please check your details.',
    'login.err.name': 'Please enter your full name.',
    'login.err.company': 'Please enter your company name.',
    'login.err.passwordLen': 'Password must be at least 6 characters long.',
    'login.err.network': 'Connection error. Please try again.',
    'login.success.created': '✅ Account created! Check your email for the confirmation link, then sign in.',

    // Request Form
    'req.header.badge': 'Objekt24 · Smart AI Estimator',
    'req.header.title': 'Request Quotes for Construction & Finishing',
    'req.header.desc': 'Enter your project details in seconds, get an instant 2026 market estimate, and receive quotes from verified pros.',
    'req.step.1': '1. Work & Sizes',
    'req.step.2': '2. Scope',
    'req.step.3': '3. Materials',
    'req.step.4': '4. Contact & Send',
    'req.client.label': 'Who is ordering the work?',
    'req.client.private': 'Private Client',
    'req.client.privateDesc': 'Home, bathroom, renovation, extension',
    'req.client.b2b': 'General Contractor / Developer (B2B)',
    'req.client.b2bDesc': 'Main tender or urgent site stage',
    'req.b2b.companyLabel': 'Company / Project Name',
    'req.b2b.scopeLabel': 'Tender Scope (who can quote?)',
    'req.b2b.stageHelper': 'Urgent Stage / Extra Hands',
    'req.b2b.stageHelperDesc': 'Open to 12.90 € Meister PRO & 49 € Business PRO',
    'req.b2b.fullProject': 'Full Project / Main Tender',
    'req.b2b.fullProjectDesc': 'Open only to 49 € Business PRO crews',
    'req.service.label': 'Select Trade / Service',
    'req.desc.label': 'Project Description & Notes',
    'req.desc.placeholder': 'E.g. Full bathroom renovation, old tile removal, drywall, new tiling...',
    'req.files.label': 'Photos or Floor Plans (optional)',
    'req.files.cta': 'Drop images here or click to select',
    'req.area.floor': 'Floor Area (m²)',
    'req.area.wall': 'Wall Area (m²)',
    'req.area.tileFloor': 'Tiled Floor (m²)',
    'req.area.microFloor': 'Microcement Floor (m²)',
    'req.area.tileWall': 'Tiled Walls (m²)',
    'req.area.microWall': 'Microcement Walls (m²)',
    'req.btn.next': 'Next →',
    'req.btn.prev': '← Back',
    'req.btn.submit': '🚀 Send Request to Pros',
    'req.btn.submitting': 'Sending request...',
    'req.contact.name': 'Your Name',
    'req.contact.email': 'Email',
    'req.contact.phone': 'Phone Number (required)',
    'req.contact.region': 'Region / County',
    'req.contact.address': 'Street / District (optional)',
    'req.timeline.label': 'When do you plan to start?',
    'req.timeline.urgent': 'As soon as possible (within 1 month)',
    'req.timeline.planned': 'Planned (1–3 months)',
    'req.timeline.browsing': 'Just checking estimated prices',
    'req.confirmBudget': 'I confirm I have reviewed the estimated market budget on the right and want to receive contractor quotes.',
    'req.sidebar.title': 'Live AI Estimate',
    'req.sidebar.subtitle': '2026 Estonian Market Forecast',
    'req.sidebar.labor': 'Labor (est.)',
    'req.sidebar.materials': 'Materials (est.)',
    'req.sidebar.total': 'Estimated Total',
    'req.sidebar.days': 'Estimated Duration',
    'req.sidebar.workDays': 'workdays',
    'req.sidebar.breakdownLabor': 'Labor Breakdown',
    'req.sidebar.breakdownMat': 'Materials Breakdown',
    'req.sidebar.note': 'Reflects market range before VAT. Exact binding quotes are sent by pros after reviewing your brief.',
    'req.err.phone': 'Please enter a valid phone number so pros can arrange a site visit.',
    'req.err.budget': 'Please confirm that you have reviewed the estimated market budget before submitting.',

    // Pricing page
    'pricing.badge': 'Contractor Subscriptions',
    'pricing.title': 'Join the Objekt24 Pro Network',
    'pricing.subtitle': '100% free for clients. Choose the plan that matches your crew capacity and win steady projects.',
    'pricing.current': '✓ Current Active Plan',
    'pricing.cancelNote': 'Change or pause your plan anytime',
    'pricing.ad.badge': 'For Partners & Material Suppliers',
    'pricing.ad.title': 'Ad Banner Pricing',

    // Tilers / Feedback / My Projects
    'tilers.badge': 'Verified Specialists',
    'tilers.title': 'Pros & Construction Companies',
    'tilers.subtitle': 'Browse verified contractor profiles, portfolios and reviews across Estonia.',
    'tilers.empty': 'No public pro profiles yet. Register as a pro and be the first!',
    'tilers.cta': 'Join as a Pro',
    'feedback.badge': 'Client & Pro Voice',
    'feedback.title': 'Feedback & Quality Rating',
    'feedback.subtitle': 'Help us keep Objekt24 reliable. Share your experience or report an issue.',
    'myProjects.title': 'My Requests & Tenders',
    'myProjects.subtitle': 'Manage your submitted projects, compare quotes and message contractors.',
    'myProjects.new': '+ New Request',
    'myProjects.empty': 'You do not have any active requests yet.',
  },
  ru: {
    // Brand & Nav
    'brand.tagline': 'Строительство и отделка',
    'brand.slogan': 'Смета за секунду, предложения за день. Экономьте время и деньги.',
    'nav.home': 'Главная',
    'nav.request': 'Запросить цену (AI)',
    'nav.tilers': 'Мастера и фирмы',
    'nav.pricing': 'Тарифы мастеров',
    'nav.myProjects': 'Мои запросы',
    'nav.myTenders': 'Мои тендеры',
    'nav.workspace': 'Биржа заказов',
    'nav.feedback': 'Отзывы',
    'nav.admin': 'Админ',
    'nav.submitRequest': '+ Подать запрос',
    'nav.login': 'Войти',
    'nav.logout': 'Выйти',

    // Home Hero
    'home.badge': 'Objekt24 · Строительная и отделочная площадка Эстонии',
    'home.h1.prefix': 'Смета за секунду,',
    'home.h1.highlight': 'предложения за день.',
    'home.h1.suffix': 'Экономьте время и деньги.',
    'home.subtitle': 'Плитка, микроцемент, малярные, гипсокартонные, кладочные и общестроительные работы в одном месте.',
    'home.desc': 'Введите размеры объекта, загрузите фото или чертежи — наш AI-калькулятор мгновенно рассчитает смету по рыночным ценам 2026 года. Получите сравнимые предложения от проверенных мастеров.',
    'home.cta.client': 'Бесплатный запрос и AI-визуализация',
    'home.cta.pro': 'Для мастеров (0 € – 49 €/мес)',
    'home.trust.1': 'Для заказчика полностью бесплатно',
    'home.trust.2': 'Отдельный расчёт стен и пола',
    'home.trust.3': 'Фотореалистичные AI-эскизы',
    'home.trust.4': 'Прямой чат с мастерами',

    // Bento
    'bento.1.tag': 'Керамика',
    'bento.1.title': 'Плитка и крупный формат',
    'bento.1.desc': '30×60 · 60×120 · XXL слэбы · Ёлочка · Запил 45°',
    'bento.2.tag': 'Без швов',
    'bento.2.title': 'Микроцемент',
    'bento.2.desc': 'Стены и пол · Защита 2K PU · Поверх старой плитки',
    'bento.3.tag': 'Под ключ',
    'bento.3.title': 'Малярные, гипсокартон и кладка',
    'bento.3.desc': 'Шпаклёвка · Каркас · Fibo/Bauroc · Бетонные работы',
    'bento.4.tag': 'Онлайн',
    'bento.4.title': 'AI-калькулятор сметы',
    'bento.4.desc': 'Работа + материалы отдельно · Комбинация стен и пола',

    // Standards bar
    'std.1': 'Сертифицированная гидроизоляция',
    'std.2': 'Точный расчёт объёмов 2026',
    'std.3': 'Керамика и крупный формат',
    'std.4': 'Бесшовный микроцемент',

    // How it works
    'how.badge': 'Как это работает?',
    'how.title': 'Удобно заказчику, выгодно мастеру',
    'how.subtitle': 'Платформа объединяет частных клиентов, генподрядчиков и опытных мастеров по всей Эстонии',
    'how.s1.title': 'Укажите объёмы и детали',
    'how.s1.desc': 'Задайте площадь стен и пола (плитка или микроцемент), этапы работ и загрузите фото или план.',
    'how.s2.title': 'AI-смета и эскизы',
    'how.s2.desc': 'AI рассчитает подробную рыночную смету и создаст реалистичную визуализацию готового помещения.',
    'how.s3.title': 'Предложения мастеров',
    'how.s3.desc': 'Зарегистрированные мастера и B2B-субподрядчики изучают запрос и отправляют точные ценовые предложения.',
    'how.s4.title': 'Чат и начало работ',
    'how.s4.desc': 'Общайтесь с исполнителями в чате, уточняйте детали и договаривайтесь о дате старта.',

    // B2B Banner
    'b2b.badge': 'Для генподрядчиков и застройщиков (B2B)',
    'b2b.title': 'Многоквартирные дома, коммерческие объекты и срочные этапы',
    'b2b.desc': 'Управляете стройкой или срочно нужны рабочие руки на завершение этапа? Разместите тендер с ведомостью объёмов — крупные тендеры открыты для 49 € Бизнес PRO, а быстрые этапы также для 12.90 € Мастер PRO.',
    'b2b.cta1': '+ Разместить B2B тендер',
    'b2b.cta2': 'Подключить 49€ B2B PRO',

    // Pricing preview
    'plan.badge': 'Присоединиться',
    'plan.title': 'Тарифы для мастеров и фирм',
    'plan.subtitle': 'Начните бесплатно или выберите PRO-тариф для неограниченных частных и B2B заказов',
    'plan.perMonth': '/ мес',
    'plan.free.title': 'Стартовый Мастер',
    'plan.free.desc': 'Познакомьтесь с платформой бесплатно. До 3 предложений в месяц по частным заказам.',
    'plan.free.cta': 'Смотреть тариф',
    'plan.pro.badge': 'Самый популярный',
    'plan.pro.title': 'Активный Мастер PRO',
    'plan.pro.desc': 'Безлимитные частные запросы + срочные B2B этапы от генподрядчиков.',
    'plan.pro.cta': 'Выбрать 12.90 €',
    'plan.vip.title': 'Генподряд и Бизнес PRO',
    'plan.vip.tag': 'B2B Элит',
    'plan.vip.desc': 'Полный доступ к крупным B2B тендерам генподрядчиков и застройщиков.',
    'plan.vip.cta': 'Выбрать 49.00 €',

    // Footer
    'footer.managedBy': 'Оператор:',
    'footer.email': 'Эл. почта:',
    'footer.admin': 'Админ-панель',

    // Login
    'login.badge': 'Аккаунт Objekt24',
    'login.title.login': 'Вход в систему',
    'login.title.register': 'Регистрация',
    'login.sub.login': 'Войдите в кабинет заказчика или мастера',
    'login.sub.register': 'Выберите роль, чтобы отправлять или получать предложения',
    'login.tab.login': 'Войти',
    'login.tab.register': 'Регистрация',
    'login.role.label': 'Тип аккаунта',
    'login.role.tiler': 'Мастер / Строительная фирма',
    'login.role.tilerDesc': 'Отправляйте сметы и ведите профиль',
    'login.role.b2b': 'Генподрядчик / Застройщик (B2B)',
    'login.role.b2bDesc': 'Размещайте объекты и тендеры',
    'login.role.client': 'Частный клиент / Заказчик',
    'login.role.clientDesc': 'Отслеживайте запросы и предложения',
    'login.fullName': 'Имя и фамилия',
    'login.companyName': 'Название компании',
    'login.email': 'Эл. почта',
    'login.password': 'Пароль',
    'login.submit.login': 'Войти',
    'login.submit.register': 'Создать аккаунт',
    'login.loading': 'Обработка...',
    'login.backHome': '← На главную',
    'login.err.credentials': 'Неверная эл. почта или пароль. Проверьте данные.',
    'login.err.name': 'Пожалуйста, введите имя и фамилию.',
    'login.err.company': 'Пожалуйста, введите название компании.',
    'login.err.passwordLen': 'Пароль должен содержать не менее 6 символов.',
    'login.err.network': 'Ошибка соединения. Попробуйте снова.',
    'login.success.created': '✅ Аккаунт создан! Подтвердите эл. почту по ссылке в письме и войдите.',

    // Request Form
    'req.header.badge': 'Objekt24 · Умный AI-калькулятор',
    'req.header.title': 'Запрос цены на строительные и отделочные работы',
    'req.header.desc': 'Заполните данные объекта за секунды, получите мгновенную смету по ценам 2026 года и предложения от мастеров.',
    'req.step.1': '1. Работа и замеры',
    'req.step.2': '2. Этапы',
    'req.step.3': '3. Материалы',
    'req.step.4': '4. Контакт и отправка',
    'req.client.label': 'Кто заказывает работу?',
    'req.client.private': 'Частный клиент',
    'req.client.privateDesc': 'Квартира, ванная, ремонт, пристройка',
    'req.client.b2b': 'Генподрядчик / Застройщик (B2B)',
    'req.client.b2bDesc': 'Крупный тендер или срочный этап',
    'req.b2b.companyLabel': 'Название компании / объекта',
    'req.b2b.scopeLabel': 'Масштаб тендера (кому доступно?)',
    'req.b2b.stageHelper': 'Срочный этап / Доп. рабочие',
    'req.b2b.stageHelperDesc': 'Открыто для 12.90 € Мастер PRO и 49 € Бизнес PRO',
    'req.b2b.fullProject': 'Полный проект / Крупный тендер',
    'req.b2b.fullProjectDesc': 'Открыто только для 49 € Бизнес PRO бригад',
    'req.service.label': 'Выберите вид работ',
    'req.desc.label': 'Описание работ и пожелания',
    'req.desc.placeholder': 'Напр.: Капитальный ремонт ванной, демонтаж старой плитки, гипсокартон, укладка новой плитки...',
    'req.files.label': 'Фото или чертежи (необязательно)',
    'req.files.cta': 'Перетащите фото сюда или нажмите для выбора',
    'req.area.floor': 'Площадь пола (м²)',
    'req.area.wall': 'Площадь стен (м²)',
    'req.area.tileFloor': 'Пол под плитку (м²)',
    'req.area.microFloor': 'Пол под микроцемент (м²)',
    'req.area.tileWall': 'Стены под плитку (м²)',
    'req.area.microWall': 'Стены под микроцемент (м²)',
    'req.btn.next': 'Далее →',
    'req.btn.prev': '← Назад',
    'req.btn.submit': '🚀 Отправить запрос мастерам',
    'req.btn.submitting': 'Отправка...',
    'req.contact.name': 'Ваше имя',
    'req.contact.email': 'Эл. почта',
    'req.contact.phone': 'Номер телефона (обязательно)',
    'req.contact.region': 'Регион / Уезд',
    'req.contact.address': 'Адрес или район (необязательно)',
    'req.timeline.label': 'Когда планируете начать работы?',
    'req.timeline.urgent': 'Как можно скорее (в течение 1 месяца)',
    'req.timeline.planned': 'Планируется (в течение 1–3 месяцев)',
    'req.timeline.browsing': 'Просто изучаю ориентировочные цены',
    'req.confirmBudget': 'Подтверждаю, что ознакомился с ориентировочной рыночной сметой справа и хочу получить предложения от мастеров.',
    'req.sidebar.title': 'AI-смета онлайн',
    'req.sidebar.subtitle': 'Прогноз рыночных цен Эстонии 2026',
    'req.sidebar.labor': 'Работа (ориентир.)',
    'req.sidebar.materials': 'Материалы (ориентир.)',
    'req.sidebar.total': 'Итого ориентировочно',
    'req.sidebar.days': 'Срок выполнения',
    'req.sidebar.workDays': 'раб. дн.',
    'req.sidebar.breakdownLabor': 'Детализация работ',
    'req.sidebar.breakdownMat': 'Детализация материалов',
    'req.sidebar.note': 'Рыночный диапазон без НСО. Точную цену мастера пришлют после просмотра запроса.',
    'req.err.phone': 'Пожалуйста, введите действующий номер телефона, чтобы мастера могли согласовать осмотр объекта.',
    'req.err.budget': 'Пожалуйста, подтвердите, что ознакомились с ориентировочной сметой перед отправкой.',

    // Pricing page
    'pricing.badge': 'Подписки для мастеров',
    'pricing.title': 'Присоединяйтесь к сети мастеров Objekt24',
    'pricing.subtitle': 'Для заказчиков платформа бесплатна. Выберите подходящий тариф и получайте выгодные заказы.',
    'pricing.current': '✓ Текущий выбранный тариф',
    'pricing.cancelNote': 'Тариф можно изменить или приостановить в любое время',
    'pricing.ad.badge': 'Для партнёров и поставщиков материалов',
    'pricing.ad.title': 'Прайс-лист рекламных баннеров',

    // Tilers / Feedback / My Projects
    'tilers.badge': 'Проверенные специалисты',
    'tilers.title': 'Мастера и строительные фирмы',
    'tilers.subtitle': 'Изучайте профили мастеров, выполненные работы и отзывы по всей Эстонии.',
    'tilers.empty': 'Публичных профилей мастеров пока нет. Зарегистрируйтесь как мастер и станьте первым!',
    'tilers.cta': 'Стать мастером',
    'feedback.badge': 'Мнение клиентов и мастеров',
    'feedback.title': 'Отзывы и оценка качества',
    'feedback.subtitle': 'Помогите поддерживать качество площадки Objekt24. Поделитесь опытом или сообщите о проблеме.',
    'myProjects.title': 'Мои запросы и тендеры',
    'myProjects.subtitle': 'Управляйте своими объектами, сравнивайте сметы и общайтесь с мастерами.',
    'myProjects.new': '+ Новый запрос',
    'myProjects.empty': 'У вас пока нет активных запросов.',
  },
}

const SERVICE_TRANSLATIONS: Record<Locale, Record<ServiceType, { label: string; subtitle: string }>> = {
  et: {
    plaat: { label: 'Plaatimistööd', subtitle: 'Keraamika, suurformaat, looduskivi, mosaiik, hüdroisolatsioon' },
    mikrotsement: { label: 'Mikrotsement', subtitle: 'Vuugivabad seinad, põrandad, dušinurgad, 2K PU kaitse' },
    'mõlemad': { label: 'Plaat + Mikrotsement', subtitle: 'Kombineeritud vannitoad ja disainlahendused' },
    maalritood: { label: 'Maalritööd', subtitle: 'Pahteldus, kruntimine, värvimine, tapeetimine' },
    kipsitood: { label: 'Kipsitööd', subtitle: 'Vaheseinad, laed, karkass, kipsplaadi paigaldus' },
    muuriladumine: { label: 'Müüriladumine', subtitle: 'Fibo, Bauroc, Columbia kivi, tellis, vaheseinad' },
    porandatood: { label: 'Põrandatööd', subtitle: 'Tasandusvalu, parkett, LVT, liistud, põrandaküte' },
    santehnika_elekter: { label: 'Santehnika & Elekter', subtitle: 'Torustik, segistid, WC-raam, põrandakütte kaabel, valgustid' },
    fassaad_uldehitus: { label: 'Fassaad & Üldehitus', subtitle: 'Soojustus, krohv, terrassid, kapitaalremont' },
  },
  en: {
    plaat: { label: 'Tiling Works', subtitle: 'Ceramics, large format, natural stone, mosaic, waterproofing' },
    mikrotsement: { label: 'Microcement', subtitle: 'Seamless walls, floors, wet zones, 2K PU protection' },
    'mõlemad': { label: 'Tile + Microcement', subtitle: 'Combined bathrooms and custom finishes' },
    maalritood: { label: 'Painting & Plastering', subtitle: 'Skimming, priming, wall & ceiling painting, wallpapering' },
    kipsitood: { label: 'Drywall & Framing', subtitle: 'Partition walls, suspended ceilings, metal framing' },
    muuriladumine: { label: 'Masonry & Blockwork', subtitle: 'Fibo, Bauroc, Columbia block, brickwork, partitions' },
    porandatood: { label: 'Flooring Works', subtitle: 'Self-leveling screed, parquet, LVT, skirting, underfloor heating' },
    santehnika_elekter: { label: 'Plumbing & Electrical', subtitle: 'Piping, fixtures, concealed WC, heating cables, lighting' },
    fassaad_uldehitus: { label: 'Facade & General Build', subtitle: 'Insulation, rendering, terraces, full renovations' },
  },
  ru: {
    plaat: { label: 'Плиточные работы', subtitle: 'Керамика, крупный формат, натуральный камень, мозаика, гидроизоляция' },
    mikrotsement: { label: 'Микроцемент', subtitle: 'Бесшовные стены, полы, душевые зоны, защита 2K PU' },
    'mõlemad': { label: 'Плитка + Микроцемент', subtitle: 'Комбинированные ванные комнаты и дизайнерская отделка' },
    maalritood: { label: 'Малярные работы', subtitle: 'Шпаклёвка, грунтовка, покраска стен и потолков, обои' },
    kipsitood: { label: 'Гипсокартонные работы', subtitle: 'Перегородки, потолки, металлический каркас, монтаж ГКЛ' },
    muuriladumine: { label: 'Кладочные работы', subtitle: 'Fibo, Bauroc, блоки Columbia, кирпич, перегородки' },
    porandatood: { label: 'Напольные покрытия', subtitle: 'Выравнивающая стяжка, паркет, LVT, плинтусы, тёплый пол' },
    santehnika_elekter: { label: 'Сантехника и электрика', subtitle: 'Трубы, смесители, инсталляция, кабель тёплого пола, свет' },
    fassaad_uldehitus: { label: 'Фасад и общестрой', subtitle: 'Утепление, штукатурка, террасы, капитальный ремонт' },
  },
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'et',
  setLocale: () => {},
  t: (k) => TRANSLATIONS.et[k] ?? k,
  tService: (id) => SERVICE_TRANSLATIONS.et[id],
})

const STORAGE_KEY = 'objekt24_locale'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('et')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (saved === 'et' || saved === 'en' || saved === 'ru') {
        setLocaleState(saved)
        document.documentElement.lang = saved
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const setLocale = (loc: Locale) => {
    setLocaleState(loc)
    try {
      localStorage.setItem(STORAGE_KEY, loc)
      document.documentElement.lang = loc
    } catch {
      // ignore storage errors
    }
  }

  const t = (key: string): string => {
    return TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS.et[key] ?? key
  }

  const tService = (id: ServiceType) => {
    return SERVICE_TRANSLATIONS[locale]?.[id] ?? SERVICE_TRANSLATIONS.et[id]
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tService }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  return useContext(LanguageContext)
}
