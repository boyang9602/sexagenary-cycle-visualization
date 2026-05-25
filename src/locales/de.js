// de.js
/**
 * German locale for <ganzhi-cycle>.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const de = {
  label: 'Deutsch',
  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: 'Jahr',
  btnBC:       'v. Chr.',
  btnAD:       'n. Chr.',
  btnToday:    'Heute',
  yearUnit:    '',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     'Yang',
  yin:      'Yin',
  elements: ['Holz', 'Feuer', 'Erde', 'Metall', 'Wasser'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────
  stemSymbols:   ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  animalSymbols: ['🐭', '🐂', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐒', '🐓', '🐕', '🐷'],
  animalFont:    "'Noto Emoji','Segoe UI Emoji','Apple Color Emoji',sans-serif",

  // ── Words (displayed in centre, markers, tooltips, aria) ─────────────────────
  stemWords:   ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'],
  branchWords: ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'],
  animalWords: ['Ratte', 'Büffel', 'Tiger', 'Hase', 'Drache', 'Schlange', 'Pferd', 'Ziege', 'Affe', 'Hahn', 'Hund', 'Schwein'],

  fmtGanzhi: (stemSym, branchSym, stemWord, branchWord) =>
    `${stemSym}${branchSym} (${stemWord} ${branchWord})`,

  // ── Title ────────────────────────────────────────────────────────────────────
  centerTitle:   'Sexagenärzyklus',
  displayMode:   'ring',
  titleFontSize: 48,
  minFontSize:   12,

  // ── Accessibility ─────────────────────────────────────────────────────────────
  svgTitle: 'Sexagenärzyklus',
  svgDesc:  'Rad-Diagramm des 60-Jahres-Zyklus der Himmelsstämme und Erdzweige',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: 'Fünf Elemente — Himmelsstämme — Erdzweige — Tierkreiszeichen',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `${1 - astro} v. Chr.` : `${astro} n. Chr.`,
  fmtInfo:   (pol, elem, animal) => `${pol} ${elem} · ${animal}`,
  fmtLegend: (pol, elem) => `${pol} ${elem}`,
};

export default de;
