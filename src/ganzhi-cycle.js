/**
 * <ganzhi-cycle> Web Component
 *
 * Usage:
 *   <script type="module" src="ganzhi-cycle.js"></script>
 *   <ganzhi-cycle></ganzhi-cycle>
 *   <ganzhi-cycle year="1984"></ganzhi-cycle>        <!-- AD 1984 -->
 *   <ganzhi-cycle year="-3"></ganzhi-cycle>          <!-- 4 BC   -->
 *   <ganzhi-cycle date="2026-05-23"></ganzhi-cycle>
 *   <ganzhi-cycle lang="en" year="2026"></ganzhi-cycle>
 *
 * Attributes:
 *   year  — Astronomical year integer (AD positive, 0 = 1 BC, negative = earlier BC)
 *   date  — ISO date string; year part used (AD only)
 *   lang  — BCP 47 language subtag, e.g. "zh" (default) or "en".
 *           Falls back to <html lang="…"> then to "zh".
 *
 * Adding a locale at runtime:
 *   import { registerLocale } from './ganzhi-cycle.js';
 *   import jaLocale from './locales/ja.js';
 *   registerLocale('ja', jaLocale);
 */

import locales from './locales/index.js';

// ── Locale registry ──────────────────────────────────────────────────────────

/** @type {Record<string, LocaleDef>} */
const LOCALES = Object.create(null);

/**
 * Register (or overwrite) a locale definition.
 * May be called before or after the element is connected to the DOM.
 *
 * @param {string}    lang  BCP 47 primary language subtag, e.g. 'en', 'zh', 'ja'
 * @param {LocaleDef} def   Locale object — see src/locales/en.js for the full shape
 */
export function registerLocale(lang, def) {
  LOCALES[lang.toLowerCase()] = def;
}

// Built-in locales shipped with the component
for (const [lang, def] of Object.entries(locales)) {
  registerLocale(lang, def);
}

/**
 * @typedef {object} LocaleDef
 * @property {string}          pickerLabel
 * @property {string}          btnBC
 * @property {string}          btnAD
 * @property {string}          btnToday
 * @property {string}          yearUnit
 * @property {string}          yang
 * @property {string}          yin
 * @property {string[]}        elements        Length-5 parallel to Five Elements
 * @property {string[]}        stemSymbols     Length-10 glyphs shown in the stem ring
 * @property {string[]}        branchSymbols   Length-12 glyphs shown in the branch ring
 * @property {string[]}        animalSymbols   Length-12 glyphs shown in the animal ring
 * @property {string|null}     animalFont      CSS font-family override for the animal ring
 * @property {string[]|null}   stemWords       Length-10 words for centre/markers/aria; null → use stemSymbols
 * @property {string[]|null}   branchWords     Length-12 words; null → use branchSymbols
 * @property {string[]|null}   animalWords     Length-12 words; null → use animalSymbols
 * @property {((ss:string,bs:string,sw:string,bw:string)=>string)|null} fmtGanzhi
 * @property {string}          centerTitle    Displayed as centre text or arc ring title
 * @property {'center'|'ring'} displayMode
 * @property {number}          titleFontSize  Default font size for the title
 * @property {number|null}     minFontSize    Minimum font size for arc shrinking (ring mode)
 * @property {string}          svgTitle
 * @property {string}          svgDesc
 * @property {string}          footer
 * @property {(astro:number)=>string}                           fmtYear
 * @property {(pol:string,elem:string,animal:string)=>string}  fmtInfo
 * @property {(pol:string,elem:string)=>string}                fmtLegend
 */

// ── Shared constants ──────────────────────────────────────────────────────────

const NS   = 'http://www.w3.org/2000/svg';
const FONT = "'Noto Serif SC','STSong','SimSun',serif";

// Angular distance (°) below which the current-year marker label is nudged
const LABEL_NUDGE_THRESHOLD = 12;

// Arc title ring: maximum sweep and character-width approximation for Latin text
const ARC_MAX_DEG         = 270;
const ARC_CHAR_WIDTH_RATIO = 0.58;  // em fraction — tune if needed

// ── Color palettes ────────────────────────────────────────────────────────────

// C_ELEM[i]   = [fillColor, textColor] for the 5 Five-Elements
const C_ELEM = [
  ['hsl(100, 38%, 58%)', 'hsl(100, 50%, 13%)'], // Wood
  ['hsl(  8, 56%, 62%)', 'hsl(  8, 65%, 13%)'], // Fire
  ['hsl( 38, 52%, 60%)', 'hsl( 38, 60%, 13%)'], // Earth
  ['hsl( 48, 46%, 66%)', 'hsl( 48, 55%, 15%)'], // Metal
  ['hsl(208, 44%, 60%)', 'hsl(208, 55%, 13%)'], // Water
];

// C_STEM[i] = [fillColor, textColor] — Yang (even index) / Yin (odd) per element
const C_STEM = [
  ['hsl(100, 40%, 62%)', 'hsl(100, 50%, 12%)'], // 甲 Yang Wood
  ['hsl(100, 34%, 52%)', 'hsl(100, 45%, 11%)'], // 乙 Yin  Wood
  ['hsl(  8, 58%, 66%)', 'hsl(  8, 65%, 12%)'], // 丙 Yang Fire
  ['hsl(  8, 52%, 56%)', 'hsl(  8, 60%, 11%)'], // 丁 Yin  Fire
  ['hsl( 38, 54%, 64%)', 'hsl( 38, 62%, 12%)'], // 戊 Yang Earth
  ['hsl( 38, 48%, 54%)', 'hsl( 38, 55%, 11%)'], // 己 Yin  Earth
  ['hsl( 48, 48%, 70%)', 'hsl( 48, 55%, 15%)'], // 庚 Yang Metal
  ['hsl( 48, 42%, 60%)', 'hsl( 48, 50%, 13%)'], // 辛 Yin  Metal
  ['hsl(208, 46%, 64%)', 'hsl(208, 55%, 13%)'], // 壬 Yang Water
  ['hsl(208, 40%, 54%)', 'hsl(208, 50%, 11%)'], // 癸 Yin  Water
];

const C_BRANCH = [
  ['hsl(208, 46%, 62%)', 'hsl(208, 55%, 12%)'], // 子 Rat    Yang Water
  ['hsl( 38, 48%, 56%)', 'hsl( 38, 55%, 12%)'], // 丑 Ox     Yin  Earth
  ['hsl(100, 40%, 62%)', 'hsl(100, 50%, 12%)'], // 寅 Tiger  Yang Wood
  ['hsl(100, 34%, 52%)', 'hsl(100, 45%, 11%)'], // 卯 Rabbit Yin  Wood
  ['hsl( 38, 54%, 62%)', 'hsl( 38, 62%, 12%)'], // 辰 Dragon Yang Earth
  ['hsl(  8, 52%, 58%)', 'hsl(  8, 60%, 12%)'], // 巳 Snake  Yin  Fire
  ['hsl(  8, 58%, 66%)', 'hsl(  8, 65%, 12%)'], // 午 Horse  Yang Fire
  ['hsl( 38, 48%, 56%)', 'hsl( 38, 55%, 12%)'], // 未 Goat   Yin  Earth
  ['hsl( 48, 48%, 68%)', 'hsl( 48, 55%, 15%)'], // 申 Monkey Yang Metal
  ['hsl( 48, 42%, 58%)', 'hsl( 48, 50%, 13%)'], // 酉 Rooster Yin Metal
  ['hsl( 38, 54%, 62%)', 'hsl( 38, 62%, 12%)'], // 戌 Dog    Yang Earth
  ['hsl(208, 40%, 56%)', 'hsl(208, 50%, 11%)'], // 亥 Pig    Yin  Water
];

// ── Shadow DOM template ───────────────────────────────────────────────────────

const TPL = document.createElement('template');
TPL.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400&display=swap');

  :host {
    display: block;
    font-family: 'Noto Serif SC','STSong','SimSun',Georgia,serif;
    color: #3e3218;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ── Picker ── */
  .picker {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .picker-label {
    font-size: .66rem;
    letter-spacing: .2em;
    color: #8a7035;
    padding: 0 2px;
  }

  .picker-control {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .era-toggle {
    display: flex;
    gap: 3px;
  }

  .era-toggle button {
    height: auto;
    padding: 2px 6px;
    background: transparent;
    border: 1px solid #c9a038;
    cursor: pointer;
    font-family: inherit;
    font-size: .68rem;
    color: #8a7035;
    letter-spacing: .08em;
    border-radius: 2px;
    transition: background .15s, color .15s;
    line-height: 1.2;
  }

  .era-toggle button.active {
    background: #c9a038;
    color: #fff8ee;
    border-color: #c9a038;
  }

  .picker-control input[type=number] {
    width: 52px;
    padding: 2px 2px 1px;
    border: none;
    border-bottom: 1px solid #c9a038;
    background: transparent;
    color: #3e3218;
    font-family: inherit;
    font-size: .82rem;
    text-align: center;
    outline: none;
    -moz-appearance: textfield;
    box-sizing: border-box;
  }
  .picker-control input[type=number]::-webkit-inner-spin-button,
  .picker-control input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

  .picker-unit {
    font-size: .66rem;
    color: #8a7035;
    letter-spacing: .12em;
    padding: 0 1px;
  }

  .btn-today {
    padding: 2px 6px;
    border: 1px solid #c9a038;
    background: transparent;
    color: #8a7035;
    font-family: inherit;
    font-size: .68rem;
    cursor: pointer;
    border-radius: 2px;
    letter-spacing: .12em;
    line-height: 1.2;
    transition: background .15s;
  }
  .btn-today:hover { background: rgba(201,160,56,.12); }

  /* ── Wheel SVG ── */
  #wheel {
    width: 100%;
    max-width: 870px;
    height: auto;
    display: block;
  }

  /* SVG <g role="button"> elements have no intrinsic shape, so the browser
     draws the focus outline as a rectangle around their entire bounding box.
     Remove it here — keyboard focus is still communicated via the darkened
     segment fill (applied in _buildWheel via isHighlight). */
  #wheel g[role="button"]:focus {
    outline: none;
  }

  /* ── Legend ── */
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 10px;
    justify-content: center;
    margin-top: 10px;
  }

  .li {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: .76rem;
    letter-spacing: .2em;
    color: #7a6835;
  }

  .dot {
    width: 13px;
    height: 13px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .rl {
    margin-top: 16px;
    font-size: .6rem;
    letter-spacing: .38em;
    text-indent: .38em;
    color: #5a4820;
    text-align: center;
    line-height: 2.6;
  }
</style>

<div class="wrapper">
  <svg id="wheel" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"
       role="img" aria-labelledby="svgTitleEl svgDescEl">
  </svg>

  <div class="picker">
    <span class="picker-label" id="lblPicker"></span>
    <div class="picker-control">
      <div class="era-toggle">
        <button id="btnBC"></button>
        <button id="btnAD" class="active"></button>
      </div>
      <input type="number" id="yearInput" min="1" value="2026">
      <span class="picker-unit" id="lblYearUnit"></span>
    </div>
    <button class="btn-today" id="btnToday"></button>
  </div>

  <div class="legends">
    <div class="legend" id="legend_yang"></div>
    <div class="legend" id="legend_yin"></div>
  </div>

  <div class="rl" id="lblFooter"></div>
</div>
`;

// ── Component class ───────────────────────────────────────────────────────────

class GanzhiCycle extends HTMLElement {

  static get observedAttributes() { return ['year', 'date', 'lang']; }

  constructor() {
    super();
    this._root  = this.attachShadow({ mode: 'open' });
    this._root.appendChild(TPL.content.cloneNode(true));
    this._isBC  = false;
    this._ready = false;
  }

  // ── Locale ───────────────────────────────────────────────────────────────────

  /** Resolve the active locale, falling back through html[lang] then 'zh'. */
  get _locale() {
    const raw = this.getAttribute('lang')
             || document.documentElement.lang
             || 'zh';
    const tag = raw.toLowerCase().split('-')[0];
    return LOCALES[tag] || LOCALES['zh'];
  }

  /** Push all non-SVG locale strings into the Shadow DOM. */
  _applyLocale() {
    const L = this._locale;
    this._q('lblPicker').textContent    = L.pickerLabel;
    this._q('btnBC').textContent        = L.btnBC;
    this._q('btnAD').textContent        = L.btnAD;
    this._q('btnToday').textContent     = L.btnToday;
    this._q('lblYearUnit').textContent  = L.yearUnit;
    this._q('lblFooter').textContent    = L.footer;
  }

  // ── Symbol / word helpers ────────────────────────────────────────────────────
  // Each *Word helper returns the word for its domain, falling back to the
  // symbol when the locale provides no separate word array.

  /** Word for a Heavenly Stem, e.g. 'Jiǎ' or '甲'. */
  _stemWord(si)   { const L = this._locale; return (L.stemWords   ?? L.stemSymbols  )[si]; }

  /** Word for an Earthly Branch, e.g. 'Zǐ' or '子'. */
  _branchWord(bi) { const L = this._locale; return (L.branchWords ?? L.branchSymbols)[bi]; }

  /** Word for a zodiac animal, e.g. 'Rat' or '鼠'. */
  _animalWord(bi) { const L = this._locale; return (L.animalWords ?? L.animalSymbols)[bi]; }

  /**
   * Full ganzhi label — symbols + words — for markers, centre, and aria.
   * Falls back to bare symbols when the locale provides no fmtGanzhi.
   */
  _ganzhiLabel(si, bi) {
    const L = this._locale;
    const ss = L.stemSymbols[si], bs = L.branchSymbols[bi];
    if (L.fmtGanzhi) {
      return L.fmtGanzhi(ss, bs, this._stemWord(si), this._branchWord(bi));
    }
    return ss + bs;
  }

  /**
   * Pronunciation-only subtitle for the centre, e.g. "(Jiǎ Zǐ)".
   * Returns null when stem/branch words are identical to their symbols
   * (meaning the locale has no distinct word form).
   */
  _pronunciationOf(si, bi) {
    const L  = this._locale;
    const sw = this._stemWord(si), bw = this._branchWord(bi);
    // Only show a pronunciation line when the words differ from the symbols
    if (sw !== L.stemSymbols[si] || bw !== L.branchSymbols[bi]) {
      return `(${sw} ${bw})`;
    }
    return null;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────────

  connectedCallback() {
    this._applyLocale();
    this._buildLegend();
    this._attachListeners();
    this._ready = true;
    this._initFromAttributes();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._ready || oldVal === newVal) return;
    if (name === 'lang') {
      this._applyLocale();
      this._buildLegend();
    }
    this._initFromAttributes();
  }

  // ── Attribute → astronomical year ─────────────────────────────────────────────

  get _attrYear() {
    if (this.hasAttribute('year')) {
      const y = parseInt(this.getAttribute('year'));
      return isNaN(y) ? new Date().getFullYear() : y;
    }
    if (this.hasAttribute('date')) {
      const d = new Date(this.getAttribute('date'));
      return isNaN(d) ? new Date().getFullYear() : d.getFullYear();
    }
    return new Date().getFullYear();
  }

  // ── BC / AD helpers ───────────────────────────────────────────────────────────

  _toAstro(displayYear, isBC) {
    return isBC ? 1 - displayYear : displayYear;
  }

  _fromAstro(astro) {
    if (astro <= 0) return { displayYear: 1 - astro, isBC: true };
    return { displayYear: astro, isBC: false };
  }

  // ── Init ──────────────────────────────────────────────────────────────────────

  _initFromAttributes() {
    const astro = this._attrYear;
    const { displayYear, isBC } = this._fromAstro(astro);

    this._isBC = isBC;
    this._q('yearInput').value = displayYear;
    this._q('btnAD').classList.toggle('active', !isBC);
    this._q('btnBC').classList.toggle('active',  isBC);

    this._render(astro);
  }

  // ── Event wiring ──────────────────────────────────────────────────────────────

  _attachListeners() {
    const onPickerChange = () => {
      const raw = this._q('yearInput').value;
      if (raw === '') { this._render(null); return; }
      const parsed  = parseInt(raw);
      const display = Math.max(1, isNaN(parsed) ? 1 : Math.abs(parsed));
      this._q('yearInput').value = display;
      this._render(this._toAstro(display, this._isBC));
    };

    this._q('yearInput').addEventListener('change', onPickerChange);
    this._q('yearInput').addEventListener('input',  onPickerChange);

    this._q('btnAD').addEventListener('click', () => {
      this._isBC = false;
      this._q('btnAD').classList.add('active');
      this._q('btnBC').classList.remove('active');
      onPickerChange();
    });

    this._q('btnBC').addEventListener('click', () => {
      this._isBC = true;
      this._q('btnBC').classList.add('active');
      this._q('btnAD').classList.remove('active');
      onPickerChange();
    });

    this._q('btnToday').addEventListener('click', () => {
      const today = new Date().getFullYear();
      this._isBC = false;
      this._q('yearInput').value = today;
      this._q('btnAD').classList.add('active');
      this._q('btnBC').classList.remove('active');
      this._render(today);
    });
  }

  // ── Legend ────────────────────────────────────────────────────────────────────

  _buildLegend() {
    const L = this._locale;
    this._q('legend_yang').innerHTML = '';
    this._q('legend_yin').innerHTML  = '';

    [L.yang, L.yin].forEach((polLabel, pi) => {
      const container = this._q(pi === 0 ? 'legend_yang' : 'legend_yin');
      L.elements.forEach((elemName, ei) => {
        const stemIdx = ei * 2 + pi;
        const [fillColor] = C_STEM[stemIdx];

        const item = document.createElement('span');
        item.className = 'li';

        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.style.background = fillColor;

        const txt = document.createElement('span');
        txt.textContent = L.fmtLegend(polLabel, elemName);

        item.appendChild(dot);
        item.appendChild(txt);
        container.appendChild(item);
      });
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  _render(astroYear) {
    this._buildWheel(astroYear);
  }

  // ── SVG Wheel ─────────────────────────────────────────────────────────────────

  _buildWheel(astroYear) {
    const svg = this._q('wheel');
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const L  = this._locale;
    const CX = 500, CY = 500, π = Math.PI;

    const hasYear    = (astroYear !== null && astroYear !== undefined);
    const layoutYear = hasYear ? astroYear : new Date().getFullYear();

    // ── SVG accessibility ──────────────────────────────────────────────────────

    const titleEl = document.createElementNS(NS, 'title');
    titleEl.id = 'svgTitleEl';
    titleEl.textContent = L.svgTitle;
    svg.appendChild(titleEl);

    const descEl = document.createElementNS(NS, 'desc');
    descEl.id = 'svgDescEl';
    descEl.textContent = L.svgDesc;
    svg.appendChild(descEl);

    // ── Ring geometry ──────────────────────────────────────────────────────────

    const CENTER_R   = 240;
    const W_ANIMALS  =  36;
    const W_BRANCHES =  36;
    const W_STEMS    =  36;

    const RA = [CENTER_R + 2,  CENTER_R + 2 + W_ANIMALS ];
    const RB = [RA[1],         RA[1] + W_BRANCHES        ];
    const RS = [RB[1],         RB[1] + W_STEMS           ];

    // Title arc radius: just inside CENTER_R
    const R_TITLE_ARC = CENTER_R - 22;   // 218 px

    const cycleOffset = ((layoutYear - 1984) % 60 + 60) % 60;
    const cycleStart  = layoutYear - cycleOffset;
    const currentIdx  = hasYear ? cycleOffset : -1;

    // ── Local SVG helpers ──────────────────────────────────────────────────────

    const mk = (tag, attrs = {}, txt) => {
      const el = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      if (txt !== undefined) el.textContent = txt;
      return el;
    };

    const circ = (r, f, s, sw) => mk('circle', {
      cx: CX, cy: CY, r,
      fill: f || 'none', stroke: s || 'none', 'stroke-width': sw || 1
    });

    const midR = ([r1, r2]) => (r1 + r2) / 2;

    const sector = (r1, r2, a1d, a2d) => {
      const a1 = a1d * π / 180, a2 = a2d * π / 180;
      const laf = (a2d - a1d) > 180 ? 1 : 0;
      const p = (r, a) => `${CX + r * Math.cos(a)},${CY + r * Math.sin(a)}`;
      return `M${p(r1,a1)}A${r1},${r1} 0 ${laf} 1 ${p(r1,a2)}`
           + `L${p(r2,a2)}A${r2},${r2} 0 ${laf} 0 ${p(r2,a1)}Z`;
    };

    const fontSize = ring => {
      const w   = ring[1] - ring[0];
      const arc = 2 * π * midR(ring) * 6 / 360;
      return Math.floor(Math.min(w * 0.6, arc * 0.7, 30));
    };

    /**
     * Place a single glyph (character or emoji) radially in a ring segment.
     * @param {[number,number]} ring
     * @param {number}          angleDeg  Centre angle of the segment (degrees)
     * @param {string}          ch        Character / emoji
     * @param {string}          fill      Text colour
     * @param {string|null}     fontOverride
     */
    const placeText = (ring, angleDeg, ch, fill, fontOverride = null) => {
      const r = midR(ring), fs = fontSize(ring);
      const rad = angleDeg * π / 180;
      const tx = CX + r * Math.cos(rad), ty = CY + r * Math.sin(rad);
      return mk('text', {
        x: tx, y: ty,
        'text-anchor': 'middle', 'dominant-baseline': 'central',
        'font-size': fs, 'font-family': fontOverride || FONT,
        fill, transform: `rotate(${angleDeg + 90},${tx},${ty})`
      }, ch);
    };

    /**
     * Render L.centerTitle as individual characters on a circular arc,
     * symmetric about 12 o'clock (the 子午线 / -90° axis).
     *
     * Arc sweep is as wide as the text needs at titleFontSize, capped at
     * ARC_MAX_DEG. Font is reduced if needed; text is hard-clipped at
     * ARC_MAX_DEG / 2 on each side (symmetric) at minFontSize.
     */
    const renderTitleRing = () => {
      const text       = L.centerTitle;
      const chars      = [...text];              // Unicode-safe split
      const defaultFS  = L.titleFontSize ?? 20;
      const minFS      = L.minFontSize    ?? 12;

      // Degrees occupied by one character at a given font size
      const charDegAt = fs => (fs * ARC_CHAR_WIDTH_RATIO * 180) / (π * R_TITLE_ARC);

      const totalDegDefault = chars.length * charDegAt(defaultFS);

      let fs = defaultFS;
      if (totalDegDefault > ARC_MAX_DEG) {
        // Shrink font to fit within ARC_MAX_DEG
        fs = (ARC_MAX_DEG * π * R_TITLE_ARC) / (chars.length * ARC_CHAR_WIDTH_RATIO * 180);
        fs = Math.max(fs, minFS);
      }

      const charDeg  = charDegAt(fs);
      const totalDeg = chars.length * charDeg;

      // Start angle: position text symmetrically about -90° (12 o'clock)
      let angle = -90 - totalDeg / 2;

      for (const ch of chars) {
        const mid = angle + charDeg / 2;

        // Hard clip: skip characters whose centre falls outside ±ARC_MAX_DEG/2
        if (Math.abs(mid - (-90)) <= ARC_MAX_DEG / 2) {
          const rad = mid * π / 180;
          const tx  = CX + R_TITLE_ARC * Math.cos(rad);
          const ty  = CY + R_TITLE_ARC * Math.sin(rad);
          svg.appendChild(mk('text', {
            x: tx, y: ty,
            'text-anchor': 'middle', 'dominant-baseline': 'central',
            'font-size': fs, 'font-family': FONT,
            fill: '#c49830',
            transform: `rotate(${mid + 90},${tx},${ty})`
          }, ch));
        }

        angle += charDeg;
      }
    };

    /**
     * Outer diamond marker with stacked text labels, tangentially oriented.
     *
     * Labels (from wheel edge outward):
     *   ganzhi      — original symbols only (always Chinese), large
     *   pron        — pronunciation / romanisation (optional, smaller)
     *   yearLabel   — formatted year string
     *
     * When pron is provided the layout expands by one radial step.
     *
     * @param {number}      angleDeg      Diamond angle (degrees)
     * @param {number}      si            Stem index 0-9
     * @param {number}      bi            Branch index 0-11
     * @param {string}      yearLabel     Pre-formatted year string
     * @param {string}      diamondFill
     * @param {string}      textFill
     * @param {number|undefined} labelAngleDeg  Optional nudged label angle
     */
    const outerMarker = (angleDeg, si, bi, yearLabel, diamondFill, textFill, labelAngleDeg) => {
      const rad = angleDeg * π / 180;
      const c   = Math.cos(rad), s = Math.sin(rad);
      const pc  = -s, ps = c;  // tangent direction

      // Diamond
      const dMid  = RS[1] + 17;
      const dIn   = dMid - 4.5;
      const dOut  = dMid + 9;
      const hw    = 5.5;
      svg.appendChild(mk('polygon', {
        points: [
          `${CX + dOut  * c},${CY + dOut  * s}`,
          `${CX + dMid  * c + hw * pc},${CY + dMid  * s + hw * ps}`,
          `${CX + dIn   * c},${CY + dIn   * s}`,
          `${CX + dMid  * c - hw * pc},${CY + dMid  * s - hw * ps}`,
        ].join(' '),
        fill: diamondFill, opacity: '0.9'
      }));

      const la  = labelAngleDeg ?? angleDeg;
      const lr  = la * π / 180;
      const lc  = Math.cos(lr), ls = Math.sin(lr);
      const rot = la + 90;

      // Ganzhi display in marker: symbols only (always glyphs, never words)
      const ganzhi = L.stemSymbols[si] + L.branchSymbols[bi];
      const pron   = this._pronunciationOf(si, bi);

      // Radial positions differ based on whether we have a pronunciation line
      const rGanzhi = pron ? RS[1] + 82 : RS[1] + 76;
      const rPron   = RS[1] + 60;
      const rYear   = pron ? RS[1] + 38 : RS[1] + 40;

      const fGanzhi = pron ? 20 : 22;
      const fPron   = 14;
      const fYear   = pron ? 15 : 17;

      const pt = (r) => ({ x: CX + r * lc, y: CY + r * ls });

      const addLabel = (r, text, fs) => {
        const { x, y } = pt(r);
        svg.appendChild(mk('text', {
          x, y,
          'text-anchor': 'middle', 'dominant-baseline': 'central',
          'font-size': fs, 'font-family': FONT,
          fill: textFill, transform: `rotate(${rot},${x},${y})`
        }, text));
      };

      addLabel(rGanzhi, ganzhi, fGanzhi);
      if (pron) addLabel(rPron, pron, fPron);
      addLabel(rYear, yearLabel, fYear);
    };

    // ── Background ─────────────────────────────────────────────────────────────
    svg.appendChild(circ(RS[1], '#faf8f2'));

    // ── 60 segments ─────────────────────────────────────────────────────────────
    for (let i = 0; i < 60; i++) {
      const si = i % 10, bi = i % 12, ei = Math.floor(si / 2);
      const a1 = -93 + i * 6, a2 = a1 + 6, ac = a1 + 3;
      const segYear = cycleStart + i;

      const g = mk('g');
      g.setAttribute('role', 'button');
      g.setAttribute('tabindex', '0');
      g.style.cursor = 'pointer';

      // Tooltip / aria-label: words (with symbol fallback) everywhere
      const ttGanzhi   = this._ganzhiLabel(si, bi);
      const ttPolarity = si % 2 === 0 ? L.yang : L.yin;
      const ttInfo     = L.fmtInfo(ttPolarity, L.elements[ei], this._animalWord(bi));
      const ttYear     = L.fmtYear(segYear);

      const tooltipEl = mk('title');
      tooltipEl.textContent = `${ttGanzhi}\n${ttYear}\n${ttInfo}`;
      g.appendChild(tooltipEl);
      g.setAttribute('aria-label', `${ttGanzhi}, ${ttYear}, ${ttInfo}`);

      g.addEventListener('click',   () => this._selectSegment(segYear));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') this._selectSegment(segYear);
      });

      const isHighlight = (i === currentIdx);

      const darkenHsl = (hslStr, amt = 14) =>
        hslStr.replace(
          /hsl\((\s*[\d.]+\s*),(\s*[\d.]+%\s*),(\s*[\d.]+)%\s*\)/,
          (_, h, s, l) => `hsl(${h},${s},${Math.max(0, parseFloat(l) - amt)}%)`
        );

      const rings = [
        [RA, L.animalSymbols[bi],  C_BRANCH[bi], L.animalFont],
        [RB, L.branchSymbols[bi],  C_BRANCH[bi], null        ],
        [RS, L.stemSymbols[si],    C_STEM[si],   null        ],
      ];

      for (const [ring, ch, [fill, textColor], fontOverride] of rings) {
        const actualFill = isHighlight ? darkenHsl(fill) : fill;
        g.appendChild(mk('path', {
          d: sector(ring[0], ring[1], a1, a2),
          fill: actualFill, stroke: '#d8cdb0', 'stroke-width': 0.5
        }));
        g.appendChild(placeText(ring, ac, ch, textColor, fontOverride));
      }

      svg.appendChild(g);
    }

    // ── Ring separators ────────────────────────────────────────────────────────
    for (const r of [RA[0], RA[1], RB[1], RS[1]])
      svg.appendChild(circ(r, 'none', '#c8b890', 0.9));

    // Major dividers every 12 segments (branch-cycle boundary)
    for (let i = 0; i < 60; i += 12) {
      const a = (-93 + i * 6) * π / 180;
      svg.appendChild(mk('line', {
        x1: CX + RA[0] * Math.cos(a), y1: CY + RA[0] * Math.sin(a),
        x2: CX + RS[1] * Math.cos(a), y2: CY + RS[1] * Math.sin(a),
        stroke: '#b8a478', 'stroke-width': 1.6
      }));
    }

    // Minor dividers every 10 segments (stem-cycle boundary)
    for (let i = 0; i < 60; i += 10) {
      const a = (-93 + i * 6) * π / 180;
      svg.appendChild(mk('line', {
        x1: CX + RA[0] * Math.cos(a), y1: CY + RA[0] * Math.sin(a),
        x2: CX + RS[1] * Math.cos(a), y2: CY + RS[1] * Math.sin(a),
        stroke: '#ccc0a0', 'stroke-width': 0.9
      }));
    }

    // Element-pair dividers every 2 segments
    for (let i = 0; i < 60; i += 2) {
      if (i % 10 === 0 || i % 12 === 0) continue;
      const a = (-93 + i * 6) * π / 180;
      svg.appendChild(mk('line', {
        x1: CX + RS[0] * Math.cos(a), y1: CY + RS[0] * Math.sin(a),
        x2: CX + RS[1] * Math.cos(a), y2: CY + RS[1] * Math.sin(a),
        stroke: '#d8cdb0', 'stroke-width': 0.6
      }));
    }

    // ── Centre content ─────────────────────────────────────────────────────────

    const txtCenter = (y, fs, fill, content, spacing) => {
      const attrs = {
        x: CX, y,
        'text-anchor': 'middle', 'dominant-baseline': 'central',
        'font-size': fs, 'font-family': FONT, fill,
      };
      if (spacing) attrs['letter-spacing'] = spacing;
      svg.appendChild(mk('text', attrs, content));
    };

    const divider = (y) => svg.appendChild(mk('line', {
      x1: CX - 60, y1: y, x2: CX + 60, y2: y,
      stroke: '#c8b890', 'stroke-width': 0.8
    }));

    const isRing = (L.displayMode === 'ring');

    if (hasYear) {
      const si    = currentIdx % 10, bi = currentIdx % 12, ei = Math.floor(si / 2);
      // Symbols always used for the large centre glyph pair
      const ganzhi = L.stemSymbols[si] + L.branchSymbols[bi];
      const pron   = this._pronunciationOf(si, bi);
      const pol    = si % 2 === 0 ? L.yang : L.yin;
      // Words (with symbol fallback) for the info line
      const info   = L.fmtInfo(pol, L.elements[ei], this._animalWord(bi));

      if (isRing) {
        // Title drawn as arc ring
        renderTitleRing();

        // Centre: ganzhi + optional pronunciation + info
        if (pron) {
          txtCenter(CY + 5,  56, '#c49830', ganzhi, '8');
          txtCenter(CY + 66, 17, '#8a7040', pron, '2');
          txtCenter(CY + 93, 20, '#8a7040', info, '3');
        } else {
          txtCenter(CY + 15, 62, '#c49830', ganzhi, '8');
          txtCenter(CY + 90, 22, '#8a7040', info,   '4');
        }

      } else {
        // 'center' displayMode: title as text above, ganzhi below
        txtCenter(CY - 80, L.titleFontSize ?? 44, '#c49830', L.centerTitle, '8');
        // divider(CY - 52);

        if (pron) {
          txtCenter(CY + 10, 52, '#c49830', ganzhi, '8');
          txtCenter(CY + 64, 16, '#8a7040', pron,   '2');
          txtCenter(CY + 90, 20, '#8a7040', info,   '3');
        } else {
          txtCenter(CY + 22, 52, '#c49830', ganzhi, '8');
          txtCenter(CY + 90, 22, '#8a7040', info,   '4');
        }
      }

    } else {
      // No year selected
      if (isRing) {
        renderTitleRing();
        // Centre left intentionally empty — user clicks a segment to populate it
      } else {
        txtCenter(CY, L.titleFontSize ?? 48, '#c49830', L.centerTitle, '12');
      }
    }

    // ── 甲子 marker (12 o'clock, cycle start) ──────────────────────────────────
    outerMarker(-90, 0, 0, L.fmtYear(cycleStart), '#c49830', '#7a5a20');

    // ── Current-year marker (vermilion) ────────────────────────────────────────
    if (hasYear && currentIdx !== 0) {
      const curAngle = -90 + currentIdx * 6;

      let angDist = currentIdx * 6;
      if (angDist > 180) angDist -= 360;

      let labelAngle;
      if (Math.abs(angDist) < LABEL_NUDGE_THRESHOLD) {
        const sign = angDist >= 0 ? 1 : -1;
        labelAngle = -90 + sign * LABEL_NUDGE_THRESHOLD;
      }

      const si = currentIdx % 10, bi = currentIdx % 12;
      outerMarker(curAngle, si, bi, L.fmtYear(astroYear), '#cc3010', '#8a2008', labelAngle);
    }
  }

  // ── Segment click / keyboard ──────────────────────────────────────────────────

  _selectSegment(segYear) {
    const { displayYear, isBC } = this._fromAstro(segYear);
    this._isBC = isBC;
    this._q('yearInput').value = displayYear;
    this._q('btnAD').classList.toggle('active', !isBC);
    this._q('btnBC').classList.toggle('active',  isBC);
    this._render(segYear);
  }

  // ── Utility ───────────────────────────────────────────────────────────────────

  _q(id) { return this._root.getElementById(id); }
}

customElements.define('ganzhi-cycle', GanzhiCycle);
