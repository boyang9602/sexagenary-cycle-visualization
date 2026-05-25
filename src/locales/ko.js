// ko.js
/**
 * Korean locale for <ganzhi-cycle>.
 *
 * @satisfies {import('../ganzhi-cycle.js').LocaleDef}
 */
const ko = {
  label: '한국어',
  // ── Year picker ──────────────────────────────────────────────────────────────
  pickerLabel: '년도',
  btnBC:       '기원전',
  btnAD:       '서기',
  btnToday:    '오늘',
  yearUnit:    '년',

  // ── Legend ───────────────────────────────────────────────────────────────────
  yang:     '양',
  yin:      '음',
  elements: ['목', '화', '토', '금', '수'],

  // ── Symbols (displayed in the rings) ─────────────────────────────────────────
  stemSymbols:   ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  branchSymbols: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  animalSymbols: ['🐭', '🐂', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐒', '🐓', '🐕', '🐷'],
  animalFont:    null,

  // ── Words (displayed in centre, markers, tooltips, aria) ─────────────────────
  stemWords:   ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'],
  branchWords: ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'],
  animalWords: ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'],

  fmtGanzhi: (stemSym, branchSym, stemWord, branchWord) =>
    `${stemSym}${branchSym} (${stemWord} ${branchWord})`,

  // ── Title ────────────────────────────────────────────────────────────────────
  centerTitle:   '육십갑자',
  displayMode:   'center',
  titleFontSize: 52,
  minFontSize:   null,

  // ── Accessibility ─────────────────────────────────────────────────────────────
  svgTitle: '육십갑자',
  svgDesc:  '천간과 지지의 60년 순환 다이어그램',

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: '오행 — 천간 — 지지 — 띠 동물',

  // ── Formatters ───────────────────────────────────────────────────────────────
  fmtYear:   (astro) => astro <= 0 ? `기원전 ${1 - astro}년` : `서기 ${astro}년`,
  fmtInfo:   (pol, elem, animal) => `${pol}${elem} · ${animal}`,
  fmtLegend: (pol, elem) => `${pol}${elem}`,
};

export default ko;
