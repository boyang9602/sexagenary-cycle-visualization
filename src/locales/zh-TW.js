// zh-Hant.js
/**
 * Traditional Chinese locale for <ganzhi-cycle>.
 *
 * Symbols and words coincide in Traditional Chinese, so all *Words fields are null —
 * the component falls back to the corresponding *Symbols array.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const zhTW = {
  label: '繁體漢字',

  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: '西元',
  btnBC:       '前',
  btnAD:       '後',
  btnToday:    '今日',
  yearUnit:    '年',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     '陽',
  yin:      '陰',
  elements: ['木', '火', '土', '金', '水'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────
  stemSymbols:   ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  // Traditional Chinese zodiac animals (with 龍 and 雞)
  animalSymbols: ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'],
  animalFont:    null,

  // ── Words (displayed in centre, markers, tooltips, aria) ─────────────────────
  // null → fall back to the corresponding *Symbols array.
  stemWords:   null,
  branchWords: null,
  animalWords: null,

  /**
   * Format a ganzhi label when *Words differ from *Symbols.
   * null → only the bare symbols are shown.
   */
  fmtGanzhi: null,

  // ── Title ────────────────────────────────────────────────────────────────────
  centerTitle:   '六十甲子',
  displayMode:   'center',
  titleFontSize: 52,
  minFontSize:   null,

  // ── Accessibility ─────────────────────────────────────────────────────────────
  svgTitle: '六十甲子干支紀年循環圖',
  svgDesc:  '六十甲子干支紀年循環圖',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: '五行 — 天干 — 地支 — 生肖',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `西元前 ${1 - astro}` : `西元後 ${astro}`,
  fmtInfo:   (pol, elem, animal) => `${pol}${elem}  ·  ${animal}`,
  fmtLegend: (pol, elem) => `${pol}${elem}`,
};

export default zhTW;
