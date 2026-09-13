/**
 * Curated authentic photographic references for Indian onion varieties and defect inspection.
 * Uses high-resolution Wikimedia Commons and Unsplash agricultural imagery.
 */

export const VARIETY_IMAGES = {
  // Nashik Red: iconic dark ruby red globe onion from Nashik, Maharashtra
  nashik_red: {
    name: 'Nashik Red',
    origin: 'Nashik, Maharashtra',
    img: '/varieties/nashik-red.jpg',
    characteristics: 'High TSS, firm tight scales, deep purplish-red skin with excellent storage life.',
  },
  // Bhima Super: high-yielding Kharif/late Kharif variety developed by ICAR-DOGR
  bhima_super: {
    name: 'Bhima Super',
    origin: 'ICAR-DOGR, Rajgurunagar',
    img: '/varieties/Bhima-Super-Red-Onion.jpg',
    characteristics: 'Vibrant red round bulbs, high yield, moderate pungency.',
  },
  // Bellary Red: classic south Indian flat-globe onion from Karnataka
  bellary_red: {
    name: 'Bellary Red',
    origin: 'Bellary, Karnataka',
    img: '/varieties/bellary red.jpg',
    characteristics: 'Bright coppery red, slightly flattened round bulb, robust export caliber.',
  },
  // Pune Fursungi: premier Maharashtra Rabi onion with exceptional storability
  pune_fursungi: {
    name: 'Pune Fursungi',
    origin: 'Pune / Ahmednagar, MH',
    img: '/varieties/puna-fursungi-onion.jpg',
    characteristics: 'Light copper red, thin neck, tight adherent skin with minimal sprouting.',
  },
  // Bangalore Rose: small pungent GI-tagged round shallot/pickling export onion
  bangalore_rose: {
    name: 'Bangalore Rose (GI Tag)',
    origin: 'Chikkaballapur / Bengaluru, Karnataka',
    img: '/varieties/bangalore-rose-onion.jpg',
    characteristics: 'GI Tagged. Spherical flat-topped button bulbs, deep scarlet color, rich in anthocyanin.',
  },
  // Agrifound Dark Red: developed by NHRDF, deep dark wine red
  agrifound_dark_red: {
    name: 'Agrifound Dark Red',
    origin: 'NHRDF, Nashik',
    img: '/varieties/agrifound-red-organic-red-onion.jpeg',
    characteristics: 'Dark purplish-red globular bulbs, 5–6 cm diameter, firm fleshy scales.',
  },
  // Pusa Red: IARI New Delhi variety with medium pungency
  pusa_red: {
    name: 'Pusa Red',
    origin: 'IARI, New Delhi',
    img: '/varieties/pusa-red-onion.jpg',
    characteristics: 'Bronze red, flat-globular, 13–14% TSS, less prone to bolting.',
  },
  // White Onion (Dehydration): Mahuva / Bhavnagar Gujarat processing onion
  white_onion: {
    name: 'White Onion (Dehydration Grade)',
    origin: 'Bhavnagar / Mahuva, Gujarat',
    img: '/varieties/white-onion.webp',
    characteristics: 'Chalky white, high dry matter (18–20% TSS), tailored for dehydration flakes and powder.',
  },
  // Yellow Granex: sweet mild onion type
  yellow_granex: {
    name: 'Yellow Granex',
    origin: 'Subtropical / Winter Crop',
    img: '/varieties/Yellow Granex.jpg',
    characteristics: 'Semi-flat golden-yellow scales, sweet juicy flesh, mild pungency.',
  },
  // Red Creole: extremely pungent tropical storage onion
  red_creole: {
    name: 'Red Creole',
    origin: 'Warm Semi-Arid Tropics',
    img: '/varieties/redcreoleonion.jpg',
    characteristics: 'Deep bronze-red skin, flat thick bulbs, heavy pungency, long shelf life.',
  },
  // Pusa White Round: prominent white bulb variety
  pusa_white_round: {
    name: 'Pusa White Round',
    origin: 'IARI, New Delhi',
    img: '/varieties/Pusa White Round.jpg',
    characteristics: 'Uniform globe shape, pure white wrapper scales, excellent dehydration yield.',
  },
  // Pusa Madhavi: light red storage onion
  pusa_madhavi: {
    name: 'Pusa Madhavi',
    origin: 'IARI, New Delhi',
    img: '/varieties/Pusa Madhavi.jpg',
    characteristics: 'Light reddish-bronze outer skin, mild to medium storage potential.',
  },
  // Arka Kalyan: developed by IIHR Bengaluru for Kharif season
  arka_kalyan: {
    name: 'Arka Kalyan',
    origin: 'ICAR-IIHR, Bengaluru',
    img: '/varieties/Arka Kalyan.jpg',
    characteristics: 'Pinkish-red globes, resistance to purple blotch disease, thick cured wrapper.',
  },
  // Agrifound Light Red: Rabi variety
  agrifound_light_red: {
    name: 'Agrifound Light Red',
    origin: 'NHRDF, Nashik',
    img: '/varieties/aflightred.jpg',
    characteristics: 'Light copper-red, tight bulb center, high export suitability to Southeast Asia.',
  },
  // Other / Generic Unspecified
  other: {
    name: 'Standard Commercial Onion',
    origin: 'Local APMC Mandi',
    img: '/varieties/nashik-red.jpg',
    characteristics: 'Standard mixed commercial lot with variable grading parameters.',
  },
};

/**
 * Inspection defect samples with real photographic evidence
 */
export const DEFECT_SAMPLE_IMAGES = [
  {
    id: 'sample_sprout',
    title: 'Sprouted Bulb Evidence',
    tag: '[DEFECT: SPROUT (MODERATE)]',
    classTag: 'TAG: CLASS II',
    tagBg: 'bg-rose-950/85 text-rose-200 border-rose-700',
    badgeBg: 'bg-amber-900/85 text-amber-200 border-amber-700',
    img: '/samples/sprouted_sample.jpg',
    description: 'Fresh shoot emerging from neck. Moisture exposure during storage.',
  },
  {
    id: 'sample_grade_a',
    title: 'Pristine Export Grade A',
    tag: '[OK: EXPORT COMPLIANT]',
    classTag: 'TAG: GRADE A',
    tagBg: 'bg-emerald-950/85 text-emerald-200 border-emerald-700',
    badgeBg: 'bg-teal-900/85 text-teal-200 border-teal-700',
    img: '/samples/pristine_sample.jpg',
    description: 'Dry intact wrapper scales, cured tight neck, firm solid flesh.',
  },
  {
    id: 'sample_doubles',
    title: 'Twin / Split Bulb Defect',
    tag: '[DEFECT: DOUBLES (LIGHT)]',
    classTag: 'TAG: BORDERLINE',
    tagBg: 'bg-amber-950/85 text-amber-200 border-amber-700',
    badgeBg: 'bg-stone-900/85 text-stone-200 border-stone-600',
    img: '/samples/twin_sample.jpg',
    description: 'Secondary growing point splitting bulb into conjoined twin bulbs.',
  },
];
