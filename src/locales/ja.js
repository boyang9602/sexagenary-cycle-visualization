// ja.js
/**
 * Japanese locale for <ganzhi-cycle>.
 *
 * Symbols and words coincide in Japanese, so all *Words fields are null —
 * the component falls back to the corresponding *Symbols array.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const ja = {
  label: '日本語',

  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: '年',
  btnBC:       '紀元前',
  btnAD:       '西暦',
  btnToday:    '今日',
  yearUnit:    '年',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     '陽',
  yin:      '陰',
  elements: ['木', '火', '土', '金', '水'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────
  stemSymbols:   ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  // Japanese zodiac animals (using Japanese kanji variants)
  animalSymbols: ['鼠', '牛', '虎', '兎', '竜', '蛇', '馬', '羊', '猿', '鶏', '犬', '猪'],
  animalFont:    null,  // use default CJK font

  // ── Words (displayed in centre, markers, tooltips, aria) ─────────────────────
  // null → fall back to the corresponding *Symbols arrays (kanji)
  stemWords:   null,
  branchWords: null,
  animalWords: null,

  /**
   * Format a ganzhi label when *Words differ from *Symbols.
   * null → only the bare symbols are shown.
   */
  fmtGanzhi: null,

  // ── Title ────────────────────────────────────────────────────────────────────
  centerTitle:   '六十干支',
  displayMode:   'center',      // use ring display (or 'center' as preferred)
  titleFontSize: 52,
  minFontSize:   null,

  // ── Accessibility ─────────────────────────────────────────────────────────────
  svgTitle: '六十干支',
  svgDesc:  '十干十二支による60年周期の循環図',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: '五行 — 天干 — 地支 — 十二生肖',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `紀元前${1 - astro}年` : `西暦${astro}年`,
  fmtInfo:   (pol, elem, animal) => `${pol}${elem} ・ ${animal}`,
  fmtLegend: (pol, elem) => `${pol}${elem}`,
};

export default ja;
