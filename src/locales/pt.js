// pt.js
/**
 * Portuguese locale for <ganzhi-cycle>.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const pt = {
  label: 'Português',
  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: 'Ano',
  btnBC:       'a.C.',
  btnAD:       'd.C.',
  btnToday:    'Hoje',
  yearUnit:    '',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     'Yang',
  yin:      'Yin',
  elements: ['Madeira', 'Fogo', 'Terra', 'Metal', 'Água'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────
  stemSymbols:   ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  animalSymbols: ['🐭', '🐂', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐒', '🐓', '🐕', '🐷'],
  animalFont:    "'Noto Emoji','Segoe UI Emoji','Apple Color Emoji',sans-serif",

  // ── Words (displayed in centre, markers, tooltips, aria) ─────────────────────
  stemWords:   ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'],
  branchWords: ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'],
  animalWords: ['Rato', 'Boi', 'Tigre', 'Coelho', 'Dragão', 'Serpente', 'Cavalo', 'Cabra', 'Macaco', 'Galo', 'Cão', 'Porco'],

  fmtGanzhi: (stemSym, branchSym, stemWord, branchWord) =>
    `${stemSym}${branchSym} (${stemWord} ${branchWord})`,

  // ── Title ────────────────────────────────────────────────────────────────────
  centerTitle:   'Ciclo Sexagesimal Chinês',
  displayMode:   'ring',
  titleFontSize: 48,
  minFontSize:   12,

  // ── Accessibility ─────────────────────────────────────────────────────────────
  svgTitle: 'Ciclo sexagesimal chinês',
  svgDesc:  'Diagrama em roda do ciclo de 60 anos dos Troncos Celestiais e Ramos Terrestres',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: 'Cinco Elementos — Troncos Celestiais — Ramos Terrestres — Animais do Zodíaco',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `${1 - astro} a.C.` : `${astro} d.C.`,
  fmtInfo:   (pol, elem, animal) => `${pol} ${elem} · ${animal}`,
  fmtLegend: (pol, elem) => `${pol} ${elem}`,
};

export default pt;
