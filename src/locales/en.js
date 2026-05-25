/**
 * English locale for <ganzhi-cycle>.
 *
 * Symbols and words are distinct:
 *   - *Symbols arrays drive the rings (Chinese glyphs for stems/branches,
 *     emoji for animals).
 *   - *Words arrays drive the centre, markers, tooltips, and aria labels.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const en = {
  label: 'English',
  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: 'Year',
  btnBC:       'BC',
  btnAD:       'AD',
  btnToday:    'Today',
  yearUnit:    '',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     'Yang',
  yin:      'Yin',
  elements: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────

  /**
   * Heavenly Stems — Chinese glyphs stay in the stem ring regardless of locale.
   * A locale like Japanese could supply variant Kanji here.
   */
  stemSymbols: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],

  /** Earthly Branches — same rationale as stemSymbols. */
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],

  /** Zodiac animals — emoji are universally understood symbols. */
  animalSymbols: ['🐭', '🐂', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐒', '🐓', '🐕', '🐷'],

  /** Emoji-friendly font stack applied only to the animal ring. */
  animalFont: "'Noto Emoji','Segoe UI Emoji','Apple Color Emoji',sans-serif",

  // ── Words (displayed in centre, markers, tooltips, aria) ─────────────────────
  // null → fall back to the corresponding *Symbols array.

  /**
   * Pinyin romanisations for the 10 Heavenly Stems, parallel to stemSymbols:
   * 甲 乙 丙 丁 戊 己 庚 辛 壬 癸
   */
  stemWords: ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'],

  /**
   * Pinyin romanisations for the 12 Earthly Branches, parallel to branchSymbols:
   * 子 丑 寅 卯 辰 巳 午 未 申 酉 戌 亥
   */
  branchWords: ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'],

  /**
   * English animal names, parallel to animalSymbols.
   * These are the words shown in the centre and tooltips; the ring itself
   * always displays the emoji from animalSymbols.
   */
  animalWords: [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
  ],

  /**
   * Format a combined ganzhi label used in markers, the centre, and aria text.
   * Receives symbols and words separately so the format can choose what to show.
   *
   * @param {string} stemSym    Stem symbol,  e.g. '甲'
   * @param {string} branchSym  Branch symbol, e.g. '子'
   * @param {string} stemWord   Stem word,    e.g. 'Jiǎ'
   * @param {string} branchWord Branch word,  e.g. 'Zǐ'
   */
  fmtGanzhi: (stemSym, branchSym, stemWord, branchWord) =>
    `${stemSym}${branchSym} (${stemWord} ${branchWord})`,

  // ── Title ────────────────────────────────────────────────────────────────────
  centerTitle:   'Sexagenary Cycle',
  displayMode:   'ring',
  titleFontSize: 48,
  minFontSize:   12,

  // ── Accessibility ─────────────────────────────────────────────────────────────
  svgTitle: 'Sexagenary Cycle',
  svgDesc:  'Wheel diagram of the 60-year cycle of Heavenly Stems and Earthly Branches',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: 'Five Elements \u2014 Heavenly Stems \u2014 Earthly Branches \u2014 Zodiac Animals',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `${1 - astro} BC` : `${astro} AD`,
  fmtInfo:   (pol, elem, animal) => `${pol} ${elem}  ·  ${animal}`,
  fmtLegend: (pol, elem) => `${pol} ${elem}`,
};

export default en;
