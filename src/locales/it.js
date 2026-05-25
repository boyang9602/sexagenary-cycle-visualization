// it.js
/**
 * Italian locale for <ganzhi-cycle>.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const it = {
  label: 'Italiano',
  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: 'Anno',
  btnBC:       'a.C.',
  btnAD:       'd.C.',
  btnToday:    'Oggi',
  yearUnit:    '',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     'Yang',
  yin:      'Yin',
  elements: ['Legno', 'Fuoco', 'Terra', 'Metallo', 'Acqua'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────
  stemSymbols:   ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  animalSymbols: ['🐭', '🐂', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐒', '🐓', '🐕', '🐷'],
  animalFont:    "'Noto Emoji','Segoe UI Emoji','Apple Color Emoji',sans-serif",

  // ── Words (displayed in centre, markers, tooltips, aria) ─────────────────────
  stemWords:   ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'],
  branchWords: ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'],
  animalWords: ['Topo', 'Bue', 'Tigre', 'Coniglio', 'Drago', 'Serpente', 'Cavallo', 'Capra', 'Scimmia', 'Gallo', 'Cane', 'Maiale'],

  fmtGanzhi: (stemSym, branchSym, stemWord, branchWord) =>
    `${stemSym}${branchSym} (${stemWord} ${branchWord})`,

  // ── Title ────────────────────────────────────────────────────────────────────
  centerTitle:   'Ciclo Sessagesimale Cinese',
  displayMode:   'ring',
  titleFontSize: 48,
  minFontSize:   12,

  // ── Accessibility ─────────────────────────────────────────────────────────────
  svgTitle: 'Ciclo sessagesimale cinese',
  svgDesc:  'Diagramma a ruota del ciclo di 60 anni dei Tronchi Celesti e Rami Terrestri',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: 'Cinque Elementi — Tronchi Celesti — Rami Terrestri — Animali dello Zodiaco',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `${1 - astro} a.C.` : `${astro} d.C.`,
  fmtInfo:   (pol, elem, animal) => `${pol} ${elem} · ${animal}`,
  fmtLegend: (pol, elem) => `${pol} ${elem}`,
};

export default it;
