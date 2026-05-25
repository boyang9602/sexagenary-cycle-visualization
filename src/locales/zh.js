/**
 * Simplified-Chinese locale for <ganzhi-cycle>.
 *
 * Symbols and words coincide in Chinese, so all *Words fields are null —
 * the component falls back to the corresponding *Symbols array.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const zh = {
  label: '简体汉字',

  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: '西元',
  btnBC:       '前',
  btnAD:       '后',
  btnToday:    '今日',
  yearUnit:    '年',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     '阳',
  yin:      '阴',
  elements: ['木', '火', '土', '金', '水'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────

  /** Heavenly Stems — shown in the innermost ring. */
  stemSymbols:   ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],

  /** Earthly Branches — shown in the middle ring. */
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],

  /** Zodiac animals — shown in the outermost ring. */
  animalSymbols: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],

  /** null → inherit the component's default CJK serif font. */
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
  svgTitle: '六十甲子干支纪年循环图',
  svgDesc:  '六十甲子干支纪年循环图',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: '五行 \u2014 天干 \u2014 地支 \u2014 生肖',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `西元前 ${1 - astro}` : `西元 ${astro}`,
  fmtInfo:   (pol, elem, animal) => `${pol}${elem}  ·  ${animal}`,
  fmtLegend: (pol, elem) => `${pol}${elem}`,
};

export default zh;
