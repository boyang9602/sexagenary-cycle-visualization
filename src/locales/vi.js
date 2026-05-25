// vi.js
/**
 * Vietnamese locale for <ganzhi-cycle>.
 * Note: Vietnamese zodiac replaces Rabbit with Cat.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const vi = {
  label: 'Tiếng Việt',
  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: 'Năm',
  btnBC:       'TCN',
  btnAD:       'SCN',
  btnToday:    'Hôm nay',
  yearUnit:    '',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     'Dương',
  yin:      'Âm',
  elements: ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────
  stemSymbols:   ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  // Vietnamese zodiac: Cat instead of Rabbit
  animalSymbols: ['🐭', '🐂', '🐯', '🐱', '🐉', '🐍', '🐴', '🐑', '🐒', '🐔', '🐶', '🐷'],
  animalFont:    null,

  // ── Words (displayed in centre, markers, tooltips, aria) ─────────────────────
  stemWords:   ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'],
  branchWords: ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'],
  animalWords: ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'],

  fmtGanzhi: (stemSym, branchSym, stemWord, branchWord) =>
    `${stemSym}${branchSym} (${stemWord} ${branchWord})`,

  // ── Title ────────────────────────────────────────────────────────────────────
  centerTitle:   'Lục Thập Hoa Giáp',
  displayMode:   'ring',
  titleFontSize: 48,
  minFontSize:   12,

  // ── Accessibility ─────────────────────────────────────────────────────────────
  svgTitle: 'Chu kỳ Lục Thập Hoa Giáp',
  svgDesc:  'Sơ đồ vòng tròn chu kỳ 60 năm của Thiên Can và Địa Chi',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: 'Ngũ Hành — Thiên Can — Địa Chi — Thập Nhị Sinh Vật',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `${1 - astro} TCN` : `${astro} SCN`,
  fmtInfo:   (pol, elem, animal) => `${pol} ${elem} · ${animal}`,
  fmtLegend: (pol, elem) => `${pol} ${elem}`,
};

export default vi;
