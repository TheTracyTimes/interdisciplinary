export type ProductCategory = 'lut' | 'preset' | 'sample-pack' | 'bundle'
export type ProductTier = 'free' | 'paid'

// All supported NLEs and DAWs
export const ALL_NLES = [
  'DaVinci Resolve',
  'Adobe Premiere Pro',
  'Apple Final Cut Pro',
  'CapCut',
  'Avid Media Composer',
]

export const ALL_DAWS = [
  'Ableton Live',
  'Apple Logic Pro',
  'Avid Pro Tools',
  'FL Studio',
  'BandLab',
  'GarageBand',
]

// LUT format compatibility matrix
export const LUT_FORMAT_COMPAT: Record<string, string[]> = {
  'DaVinci Resolve':       ['.cube', '.3dl', '.look'],
  'Adobe Premiere Pro':    ['.cube', '.look'],
  'Apple Final Cut Pro':   ['.cube'],
  'CapCut':                ['.cube'],
  'Avid Media Composer':   ['.cube', '.3dl'],
}

// Preset format compatibility matrix
export const PRESET_FORMAT_COMPAT: Record<string, string[]> = {
  'Ableton Live':    ['.adg', '.adv', '.fxp'],
  'Apple Logic Pro': ['.pst', '.exs', '.aupreset'],
  'Avid Pro Tools':  ['.tfx', '.fxp'],
  'FL Studio':       ['.fst', '.fxp'],
  'BandLab':         ['Native (import via BandLab desktop)'],
  'GarageBand':      ['.aupreset'],
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  subcategory: string
  description: string
  price: number
  originalPrice?: number
  tier: ProductTier
  tags: string[]
  format: string[]
  compatible: string[]
  previewColors?: string[]
  featured?: boolean
  downloads?: number
  includes?: string[]
  bundleIds?: string[]
}

const LUT_ALL_FORMATS = ['.cube', '.3dl', '.look']
const LUT_ALL_NLE = ALL_NLES

export const PRODUCTS: Product[] = [
  {
    id: 'lut-indie-starter',
    name: 'Indie Film Starter Pack',
    category: 'lut',
    subcategory: 'Cinematic',
    description:
      '5 free LUTs built for indie shooters. Warm mid-tones, lifted shadows, and natural skin tones that work across Sony, Canon, and iPhone footage. Includes .cube for all NLEs.',
    price: 0,
    tier: 'free',
    tags: ['cinematic', 'warm', 'indie', 'starter', 'free'],
    format: LUT_ALL_FORMATS,
    compatible: LUT_ALL_NLE,
    previewColors: ['#c8956c', '#d4a574', '#b8835a', '#e0b896', '#a07050'],
    featured: true,
    downloads: 4820,
  },
  {
    id: 'lut-golden-hour',
    name: 'Golden Hour Collection',
    category: 'lut',
    subcategory: 'Cinematic',
    description:
      '12 LUTs designed to amplify magic hour lighting. Works with flat/log footage from ARRI, RED, Sony FX, and Blackmagic. Ships in .cube, .3dl, and .look.',
    price: 18,
    tier: 'paid',
    tags: ['golden hour', 'sunset', 'cinematic', 'warm'],
    format: LUT_ALL_FORMATS,
    compatible: LUT_ALL_NLE,
    previewColors: ['#f4a24e', '#e8884a', '#f6b86c', '#d97840', '#f9c98a'],
    featured: true,
    downloads: 2140,
  },
  {
    id: 'lut-noir-shadows',
    name: 'Noir & Shadow Series',
    category: 'lut',
    subcategory: 'Dramatic',
    description:
      '8 high-contrast LUTs for thriller, horror, and neo-noir. Deep crushed blacks, desaturated mids, selective color. .cube + .3dl included.',
    price: 22,
    tier: 'paid',
    tags: ['noir', 'horror', 'thriller', 'dark', 'contrast'],
    format: LUT_ALL_FORMATS,
    compatible: LUT_ALL_NLE,
    previewColors: ['#1a1a2e', '#2d2d44', '#16213e', '#0f3460', '#533483'],
    downloads: 987,
  },
  {
    id: 'lut-documentary',
    name: 'Documentary Naturals',
    category: 'lut',
    subcategory: 'Documentary',
    description:
      '6 clean, natural LUTs for documentary and interview work. True-to-life color with subtle lift. Compatible with all major NLEs.',
    price: 14,
    tier: 'paid',
    tags: ['documentary', 'natural', 'interview', 'clean'],
    format: LUT_ALL_FORMATS,
    compatible: LUT_ALL_NLE,
    previewColors: ['#8fad88', '#a3b899', '#7a9e7e', '#6b8f71', '#b5c9b7'],
    downloads: 1560,
  },
  {
    id: 'lut-music-video',
    name: 'Music Video Chrome Pack',
    category: 'lut',
    subcategory: 'Music Video',
    description:
      '10 bold, stylized LUTs for music videos — teal-orange, bleach bypass, hyper-saturated, and digital glitch grades. All NLE formats included.',
    price: 26,
    tier: 'paid',
    tags: ['music video', 'bold', 'stylized', 'chrome', 'vibrant'],
    format: LUT_ALL_FORMATS,
    compatible: LUT_ALL_NLE,
    previewColors: ['#00b4d8', '#0077b6', '#48cae4', '#023e8a', '#90e0ef'],
    featured: true,
    downloads: 3210,
  },
  {
    id: 'lut-youtube-creator',
    name: 'YouTube Creator LUT Pack',
    category: 'lut',
    subcategory: 'Social Media',
    description:
      '8 LUTs tuned for YouTube — punchy, clear, and optimized for compressed streaming. Works straight from iPhone, DSLR, and mirrorless. Great on all screen types.',
    price: 12,
    tier: 'paid',
    tags: ['youtube', 'social', 'vertical', 'creator', 'bright'],
    format: LUT_ALL_FORMATS,
    compatible: LUT_ALL_NLE,
    previewColors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
    downloads: 5400,
    featured: true,
  },
  {
    id: 'preset-mix-starter',
    name: 'Mix Ready Starter Kit',
    category: 'preset',
    subcategory: 'Mixing',
    description:
      '20 free mixing presets — EQ curves, compression, and reverb for vocals, drums, bass, and keys. Includes formats for every major DAW including BandLab.',
    price: 0,
    tier: 'free',
    tags: ['mixing', 'EQ', 'compression', 'starter', 'all genres'],
    format: ['.adg', '.pst', '.fxp', '.fst', '.aupreset'],
    compatible: ALL_DAWS,
    featured: true,
    downloads: 7230,
  },
  {
    id: 'preset-hiphop-drums',
    name: 'Hip-Hop Drum Chain',
    category: 'preset',
    subcategory: 'Drums',
    description:
      '15 drum processing chains for boom-bap and trap. Punchy 808 shaping, snare crack, hi-hat air. Packaged for Ableton, Logic, Pro Tools, FL Studio, and BandLab.',
    price: 16,
    tier: 'paid',
    tags: ['hip-hop', 'trap', 'drums', '808', 'boom-bap'],
    format: ['.adg', '.pst', '.fxp', '.fst'],
    compatible: ALL_DAWS,
    featured: true,
    downloads: 3890,
  },
  {
    id: 'preset-cinematic-strings',
    name: 'Cinematic String Textures',
    category: 'preset',
    subcategory: 'Orchestral',
    description:
      '12 string and pad presets for film scoring — evolving textures, staccato patches, hybrid organic-electronic layers. Logic and Pro Tools focused with Ableton rack versions.',
    price: 24,
    tier: 'paid',
    tags: ['cinematic', 'strings', 'film score', 'orchestral', 'pads'],
    format: ['.pst', '.adg', '.aupreset', '.fxp'],
    compatible: ['Ableton Live', 'Apple Logic Pro', 'Avid Pro Tools', 'GarageBand'],
    featured: true,
    downloads: 1670,
  },
  {
    id: 'preset-vocal-chain',
    name: 'Vocal Production Suite',
    category: 'preset',
    subcategory: 'Vocals',
    description:
      '18 vocal chain presets for rap, R&B, pop, and indie — de-essing, parallel compression, plate reverb, and doubling. Includes BandLab-compatible version.',
    price: 20,
    tier: 'paid',
    tags: ['vocals', 'rap', 'R&B', 'pop', 'processing'],
    format: ['.adg', '.pst', '.fxp', '.fst'],
    compatible: ALL_DAWS,
    downloads: 2980,
  },
  {
    id: 'preset-lofi-textures',
    name: 'Lo-Fi & Vinyl Textures',
    category: 'preset',
    subcategory: 'Lo-Fi',
    description:
      '10 lo-fi processing presets — tape saturation, vinyl crackle, pitch wobble, and dusty EQ. All DAW formats. BandLab desktop import guide included.',
    price: 14,
    tier: 'paid',
    tags: ['lo-fi', 'vinyl', 'tape', 'warm', 'chill'],
    format: ['.adg', '.pst', '.fxp', '.fst'],
    compatible: ALL_DAWS,
    downloads: 4120,
  },
  {
    id: 'preset-master-chain',
    name: 'Mastering Chain Presets',
    category: 'preset',
    subcategory: 'Mastering',
    description:
      '8 mastering chains tuned for streaming loudness targets (-14 LUFS). Genre settings for hip-hop, pop, electronic, and acoustic. Logic, Pro Tools, and Ableton.',
    price: 28,
    tier: 'paid',
    tags: ['mastering', 'loudness', 'streaming', 'final mix'],
    format: ['.adg', '.pst', '.fxp', '.aupreset'],
    compatible: ['Ableton Live', 'Apple Logic Pro', 'Avid Pro Tools', 'FL Studio'],
    downloads: 1340,
  },
  {
    id: 'samples-indie-film-score',
    name: 'Indie Film Score Elements',
    category: 'sample-pack',
    subcategory: 'Film',
    description:
      '80 royalty-free samples for indie film scoring — drones, swells, transitional hits, ambient beds. Stems included. Drag into any DAW or NLE.',
    price: 32,
    tier: 'paid',
    tags: ['film', 'score', 'cinematic', 'royalty-free', 'stems'],
    format: ['.wav', '.aiff'],
    compatible: [...ALL_DAWS, ...ALL_NLES],
    featured: true,
    downloads: 890,
  },
  {
    id: 'samples-free-oneshots',
    name: 'Free One-Shot Drum Collection',
    category: 'sample-pack',
    subcategory: 'Drums',
    description:
      '50 free one-shot drum samples — kicks, snares, hats, percussion. No attribution required. Works in every DAW and NLE.',
    price: 0,
    tier: 'free',
    tags: ['drums', 'one-shots', 'free', 'starter'],
    format: ['.wav'],
    compatible: [...ALL_DAWS, ...ALL_NLES],
    downloads: 9100,
  },
  {
    id: 'bundle-youtube-creator',
    name: 'YouTube Creator Starter Pack',
    category: 'bundle',
    subcategory: 'Bundle',
    description:
      'Everything a YouTube creator needs in one download — 8 YouTube-tuned LUTs for your video grade, 20 mix presets for your voiceover and music bed, and 50 free drum one-shots. Includes a setup guide for Premiere, Final Cut, CapCut, Logic, GarageBand, and BandLab.',
    price: 24,
    originalPrice: 44,
    tier: 'paid',
    tags: ['youtube', 'creator', 'bundle', 'starter', 'all-in-one'],
    format: ['.cube', '.3dl', '.look', '.adg', '.pst', '.fxp', '.fst', '.aupreset', '.wav'],
    compatible: [...ALL_NLES, ...ALL_DAWS],
    previewColors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
    featured: true,
    downloads: 1820,
    bundleIds: ['lut-youtube-creator', 'preset-mix-starter', 'samples-free-oneshots'],
    includes: [
      '8 YouTube Creator LUTs (.cube + .3dl + .look)',
      '20 Mix Ready Starter presets (all DAW formats)',
      '50 Free One-Shot drum samples (.wav)',
      'PDF setup guide for Premiere, Final Cut, CapCut',
      'PDF setup guide for Logic, GarageBand, BandLab',
      'Commercial use license',
    ],
  },
  {
    id: 'bundle-film-score',
    name: 'Film Score Complete Bundle',
    category: 'bundle',
    subcategory: 'Bundle',
    description:
      'The full scoring toolkit — cinematic LUTs to grade your picture, orchestral string presets for your cues, and 80 film score samples. Works end-to-end from DaVinci Resolve to Logic Pro.',
    price: 52,
    originalPrice: 78,
    tier: 'paid',
    tags: ['film', 'score', 'cinematic', 'bundle', 'orchestral'],
    format: ['.cube', '.3dl', '.look', '.pst', '.adg', '.aupreset', '.wav', '.aiff'],
    compatible: ['DaVinci Resolve', 'Adobe Premiere Pro', 'Apple Final Cut Pro', 'Ableton Live', 'Apple Logic Pro', 'Avid Pro Tools'],
    previewColors: ['#1a1a2e', '#2d2d44', '#8fad88', '#533483', '#16213e'],
    featured: true,
    downloads: 430,
    bundleIds: ['lut-documentary', 'lut-noir-shadows', 'preset-cinematic-strings', 'samples-indie-film-score'],
    includes: [
      '6 Documentary Natural LUTs',
      '8 Noir & Shadow LUTs',
      '12 Cinematic String Texture presets',
      '80 Indie Film Score sample elements',
      'Stems and session templates',
      'Commercial use license',
    ],
  },
  {
    id: 'bundle-indie-filmmaker',
    name: 'Indie Filmmaker Complete Kit',
    category: 'bundle',
    subcategory: 'Bundle',
    description:
      'The full indie film toolkit — warm cinematic LUTs, documentary naturals, film score samples, and string presets for your soundtrack. Built for solo filmmakers who shoot, score, and edit their own work.',
    price: 44,
    originalPrice: 74,
    tier: 'paid',
    tags: ['indie', 'film', 'filmmaker', 'bundle', 'complete'],
    format: ['.cube', '.3dl', '.look', '.pst', '.adg', '.aupreset', '.wav', '.aiff'],
    compatible: ['DaVinci Resolve', 'Adobe Premiere Pro', 'Apple Final Cut Pro', 'CapCut', 'Apple Logic Pro', 'Ableton Live', 'GarageBand'],
    previewColors: ['#c8956c', '#8fad88', '#d4a574', '#6b8f71', '#b8835a'],
    featured: true,
    downloads: 610,
    bundleIds: ['lut-indie-starter', 'lut-golden-hour', 'lut-documentary', 'preset-cinematic-strings', 'samples-indie-film-score'],
    includes: [
      '5 Indie Film Starter LUTs (free tier, now bundled)',
      '12 Golden Hour LUTs',
      '6 Documentary Natural LUTs',
      '12 Cinematic String Texture presets',
      '80 Indie Film Score samples + stems',
      'DaVinci Resolve project template',
      'Commercial use license',
    ],
  },
  {
    id: 'bundle-content-creator-pro',
    name: 'Content Creator Pro',
    category: 'bundle',
    subcategory: 'Bundle',
    description:
      'For creators who do everything — shoot, record, edit, post. YouTube LUTs, vocal presets, lo-fi music bed textures, and drum samples. Works across CapCut, Premiere, Final Cut, Logic, GarageBand, and BandLab.',
    price: 34,
    originalPrice: 58,
    tier: 'paid',
    tags: ['content creator', 'youtube', 'social', 'bundle', 'all-in-one'],
    format: ['.cube', '.3dl', '.adg', '.pst', '.fxp', '.fst', '.aupreset', '.wav'],
    compatible: [...ALL_NLES, ...ALL_DAWS],
    previewColors: ['#48dbfb', '#ff6b6b', '#feca57', '#54a0ff', '#ff9ff3'],
    featured: true,
    downloads: 940,
    bundleIds: ['lut-youtube-creator', 'preset-vocal-chain', 'preset-lofi-textures', 'samples-free-oneshots'],
    includes: [
      '8 YouTube Creator LUTs (all NLE formats)',
      '18 Vocal Production Suite presets',
      '10 Lo-Fi & Vinyl Texture presets',
      '50 Free One-Shot drum samples',
      'Setup guide: CapCut + GarageBand workflow',
      'Setup guide: BandLab vocal chain walkthrough',
      'Commercial use license',
    ],
  },
  {
    id: 'bundle-music-video-director',
    name: 'Music Video Director Pack',
    category: 'bundle',
    subcategory: 'Bundle',
    description:
      'Everything for a music video — bold color grades, vocal processing, drum chains, and mastering presets. From shooting in CapCut to mixing in BandLab or releasing from Pro Tools.',
    price: 48,
    originalPrice: 82,
    tier: 'paid',
    tags: ['music video', 'director', 'bundle', 'color', 'mix'],
    format: ['.cube', '.3dl', '.look', '.adg', '.pst', '.fxp', '.fst', '.aupreset'],
    compatible: [...ALL_NLES, ...ALL_DAWS],
    previewColors: ['#00b4d8', '#533483', '#e8884a', '#0077b6', '#f4a24e'],
    downloads: 380,
    bundleIds: ['lut-music-video', 'lut-golden-hour', 'preset-hiphop-drums', 'preset-vocal-chain', 'preset-master-chain'],
    includes: [
      '10 Music Video Chrome LUTs',
      '12 Golden Hour LUTs',
      '15 Hip-Hop Drum Chain presets',
      '18 Vocal Production Suite presets',
      '8 Mastering Chain presets (-14 LUFS ready)',
      'CapCut color import guide',
      'BandLab mastering walkthrough',
      'Commercial use license',
    ],
  },
  {
    id: 'bundle-everything',
    name: 'The Full Library',
    category: 'bundle',
    subcategory: 'Bundle',
    description:
      'Every LUT, every preset, every sample pack — the complete Interdisciplinary creative library. One purchase, everything included, all formats, all DAWs, all NLEs. Best value for serious creators.',
    price: 99,
    originalPrice: 218,
    tier: 'paid',
    tags: ['complete', 'library', 'all', 'bundle', 'best value'],
    format: ['.cube', '.3dl', '.look', '.adg', '.pst', '.fxp', '.fst', '.aupreset', '.tfx', '.wav', '.aiff'],
    compatible: [...ALL_NLES, ...ALL_DAWS],
    previewColors: ['#f4a24e', '#00b4d8', '#533483', '#48bb9a', '#e85d4a'],
    featured: true,
    downloads: 290,
    includes: [
      'All 6 LUT packs (49 LUTs total)',
      'All 6 preset packs (93 presets total)',
      'All sample packs (130+ samples)',
      'All formats for every DAW and NLE',
      'All setup guides and documentation',
      'Free updates for 12 months',
      'Commercial use license — unlimited projects',
    ],
  },
  {
    id: 'bundle-hiphop-producer',
    name: 'Hip-Hop Producer Pack',
    category: 'bundle',
    subcategory: 'Bundle',
    description:
      'Built for hip-hop and trap producers — drum chains, vocal processing, lo-fi textures, and music video LUTs. From beat-making in FL Studio or BandLab to shooting the visual in CapCut.',
    price: 38,
    originalPrice: 58,
    tier: 'paid',
    tags: ['hip-hop', 'trap', 'producer', 'bundle', 'music video'],
    format: ['.cube', '.3dl', '.adg', '.pst', '.fxp', '.fst', '.wav'],
    compatible: [...ALL_NLES, ...ALL_DAWS],
    previewColors: ['#00b4d8', '#533483', '#f4a24e', '#0077b6', '#1a1a2e'],
    featured: true,
    downloads: 760,
    bundleIds: ['lut-music-video', 'preset-hiphop-drums', 'preset-vocal-chain', 'preset-lofi-textures'],
    includes: [
      '10 Music Video Chrome LUTs',
      '15 Hip-Hop Drum Chain presets',
      '18 Vocal Production Suite presets',
      '10 Lo-Fi & Vinyl Texture presets',
      'BandLab import guide',
      'Commercial use license',
    ],
  },
]

export const PRODUCT_CATEGORIES: { id: ProductCategory | 'all'; label: string; icon: string; desc: string }[] = [
  { id: 'all',          label: 'All Products', icon: '🛍',  desc: '' },
  { id: 'bundle',       label: 'Bundles',      icon: '📦',  desc: 'Curated packs at a discount' },
  { id: 'lut',          label: 'LUTs',         icon: '🎨',  desc: 'Color grades for film & video' },
  { id: 'preset',       label: 'Presets',      icon: '🎛',  desc: 'Processing chains for music' },
  { id: 'sample-pack',  label: 'Sample Packs', icon: '🥁',  desc: 'Royalty-free audio samples' },
]
