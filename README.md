# &lt;ganzhi-cycle&gt;

A zero-dependency web component that renders the 60-year sexagenary cycle
(六十甲子) of Heavenly Stems (天干) and Earthly Branches (地支) as an
interactive SVG wheel, with built-in multi-language support.

## Installation

```bash
npm install ganzhi-cycle
```

Or use directly from a CDN:

```html
<script type="module"
  src="https://cdn.jsdelivr.net/npm/ganzhi-cycle/src/ganzhi-cycle.js">
</script>
```

## Usage

```html
<!-- Defaults to today's year; language auto-detected from <html lang="…"> -->
<ganzhi-cycle></ganzhi-cycle>

<!-- Explicit year and language -->
<ganzhi-cycle year="1984" lang="en"></ganzhi-cycle>

<!-- ISO date string — only the year part is used -->
<ganzhi-cycle date="2026-05-23" lang="zh"></ganzhi-cycle>

<!-- BC year: astronomical year 0 = 1 BC, negative = earlier BC -->
<ganzhi-cycle year="-3" lang="en"></ganzhi-cycle>
```

## Attributes

| Attribute | Type   | Default                   | Description |
|-----------|--------|---------------------------|-------------|
| `year`    | int    | current year              | Astronomical year (AD positive, 0 = 1 BC, negative = earlier BC) |
| `date`    | string | —                         | ISO date string; year part used (AD only) |
| `lang`    | string | `<html lang>` → `"zh"`   | BCP 47 primary language subtag |

All attributes are reactive — changing them via JavaScript updates the wheel immediately.

## Built-in languages

| Tag  | Language           | Animals         | Title display |
|------|--------------------|-----------------|---------------|
| `zh` | Simplified Chinese | 鼠牛虎兔龙蛇…  | Centre text   |
| `en` | English            | 🐭🐂🐯🐰🐲🐍… | Arc ring      |

## Design notes

### Stems and branches are never translated in the rings

甲乙丙丁… (Heavenly Stems) and 子丑寅卯… (Earthly Branches) are cultural
symbols that appear in the rings unchanged in every locale. When a locale
provides `stems` / `branches` arrays, those names appear only *alongside*
the original symbols — at markers, in the centre, and in tooltip / aria text.

### Animals

Chinese locales use the traditional characters (生肖). All other locales
use emoji (🐭🐂🐯…), which are universally understood and require no
word-level translation.

### Title display modes

`displayMode: 'center'` (default, used by `zh`) renders the title as large
text inside the centre circle above the selected year's ganzhi pair.

`displayMode: 'ring'` (used by `en`) renders the title as individual
characters on a circular arc just inside the animal ring, symmetric about
the vertical 子午线 (12 o'clock axis). The arc spans only as wide as the
text needs at `titleFontSize`; font is reduced dynamically if the text
exceeds `ARC_MAX_DEG` (270°), and hard-clipped symmetrically at
`minFontSize` in the extreme case. The centre then shows only the
selected year's ganzhi pair and info line.

## Adding a locale

1. Copy `src/locales/en.js` to `src/locales/XX.js`.
2. Fill in all fields (see the shape reference below).
3. Register before or after the element connects:

```js
import { registerLocale } from 'ganzhi-cycle';
import jaLocale from './locales/ja.js';
registerLocale('ja', jaLocale);
```

```html
<ganzhi-cycle lang="ja" year="2026"></ganzhi-cycle>
```

## Locale shape reference

```js
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
```

## Arc title ring tuning

The `ARC_MAX_DEG` constant (default 270) and `ARC_CHAR_WIDTH_RATIO` (default 0.58)
are exported for advanced use; they can be adjusted at module level if needed
for scripts with atypical character widths. Per-locale tuning is done through
`titleFontSize` and `minFontSize`.

## Keyboard & accessibility

Each of the 60 segments is focusable (`tabindex="0"`, `role="button"`) and
activatable with Enter or Space. Every segment carries a `<title>` tooltip
and an `aria-label` that includes the full ganzhi label (with romanisation
when available), the formatted year, and the polarity/element/animal line.

## Project structure

```
ganzhi-cycle/
├── src/
│   ├── locales/
│   │   ├── zh.js          Simplified Chinese (built-in)
│   │   └── en.js          English with Pinyin (built-in)
│   └── ganzhi-cycle.js  Component + registerLocale export
├── demo/
│   └── index.html         Interactive demo with language switcher
├── package.json
└── README.md
```

## Browser support

Any browser supporting Custom Elements v1 and ES modules. No build step or
polyfill required.
