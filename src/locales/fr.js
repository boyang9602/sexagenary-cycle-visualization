// fr.js
/**
 * French locale for <ganzhi-cycle>.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const fr = {
  label: 'Français',
  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: 'Année',
  btnBC:       'av. J.-C.',
  btnAD:       'ap. J.-C.',
  btnToday:    "Aujourd'hui",
  yearUnit:    '',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     'Yang',
  yin:      'Yin',
  elements: ['Bois', 'Feu', 'Terre', 'Métal', 'Eau'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────
  stemSymbols:   ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  animalSymbols: ['🐭', '🐂', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐒', '🐓', '🐕', '🐷'],
  animalFont:    "'Noto Emoji','Segoe UI Emoji','Apple Color Emoji',sans-serif",

  // ── Words (displayed in centre, markers, tooltips, aria) ─────────────────────
  stemWords:   ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'],
  branchWords: ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'],
  animalWords: ['Rat', 'Buffle', 'Tigre', 'Lapin', 'Dragon', 'Serpent', 'Cheval', 'Chèvre', 'Singe', 'Coq', 'Chien', 'Cochon'],

  fmtGanzhi: (stemSym, branchSym, stemWord, branchWord) =>
    `${stemSym}${branchSym} (${stemWord} ${branchWord})`,

  // ── Title ────────────────────────────────────────────────────────────────────
  centerTitle:   'Cycle Sexagésimal Chinois',
  displayMode:   'ring',
  titleFontSize: 48,
  minFontSize:   12,

  // ── Accessibility ─────────────────────────────────────────────────────────────
  svgTitle: 'Cycle sexagésimal chinois',
  svgDesc:  'Diagramme circulaire du cycle de 60 ans des Tiges célestes et Branches terrestres',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: 'Cinq Éléments — Tiges Célestes — Branches Terrestres — Animaux du Zodiaque',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `${1 - astro} av. J.-C.` : `${astro} ap. J.-C.`,
  fmtInfo:   (pol, elem, animal) => `${pol} ${elem} · ${animal}`,
  fmtLegend: (pol, elem) => `${pol} ${elem}`,
};

export default fr;
