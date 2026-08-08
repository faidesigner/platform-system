#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FOUNDATION = path.join(ROOT, 'root', 'foundation');
const OUT_DIRS = [
  path.join(ROOT, 'tools', 'figma-foundation-input'),
  path.join(ROOT, 'tools', 'figma-variable-visualizer'),
];

function readJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(FOUNDATION, filename), 'utf8'));
}

function cleanSegment(value) {
  return String(value)
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^_$/, 'default')
    .replace(/^None$/i, 'none')
    .replace(/^Over$/i, 'over');
}

function joinName(parts) {
  return parts.map(cleanSegment).filter(Boolean).join('/');
}

function walk(obj, parts = [], callback) {
  for (const [key, value] of Object.entries(obj)) {
    const next = [...parts, key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      walk(value, next, callback);
    } else {
      callback(next, value);
    }
  }
}

function flatten(obj, prefix) {
  const tokens = [];
  const initial = Array.isArray(prefix) ? prefix : prefix ? [prefix] : [];
  walk(obj, initial, (parts, value) => {
    tokens.push({ name: joinName(parts), raw: value });
  });
  return tokens;
}

function parseHex(value) {
  if (typeof value !== 'string') return null;
  const hex = value.trim();
  const match = /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.exec(hex);
  if (!match) return null;

  const raw = match[1];
  const r = parseInt(raw.slice(0, 2), 16) / 255;
  const g = parseInt(raw.slice(2, 4), 16) / 255;
  const b = parseInt(raw.slice(4, 6), 16) / 255;
  const a = raw.length === 8 ? parseInt(raw.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function parseNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  const rem = /^(-?\d+(\.\d+)?)rem$/.exec(text);
  if (rem) return Number(rem[1]) * 16;
  const px = /^(-?\d+(\.\d+)?)px$/.exec(text);
  if (px) return Number(px[1]);
  const ms = /^(-?\d+(\.\d+)?)ms$/.exec(text);
  if (ms) return Number(ms[1]);
  return null;
}

function referenceName(value, fallbackPrefix) {
  if (typeof value !== 'string') return null;
  const match = /^\{([^}]+)\}$/.exec(value.trim());
  if (!match) return null;
  const parts = match[1].split('.').map(cleanSegment);
  if (parts[0] === 'color') return parts.join('/');
  if (parts[0] === 'size') return ['size', ...parts.slice(1)].join('/');
  if (fallbackPrefix && parts[0] !== fallbackPrefix) return [fallbackPrefix, ...parts].join('/');
  return parts.join('/');
}

function referencePath(value) {
  if (typeof value !== 'string') return null;
  const match = /^\{([^}]+)\}$/.exec(value.trim());
  return match ? match[1].split('.').map(cleanSegment) : null;
}

function getPathValue(obj, parts) {
  return parts.reduce((cursor, part) => (cursor && cursor[part] !== undefined ? cursor[part] : undefined), obj);
}

function resolveTokenValue(value, roots) {
  const ref = referencePath(value);
  if (!ref) return value;
  for (const root of roots) {
    const resolved = getPathValue(root, ref);
    if (resolved !== undefined) return resolveTokenValue(resolved, roots);
  }
  return value;
}

function addToken(collection, token) {
  collection.tokens.push(token);
}

// font-weight 숫자 → Figma fontStyle 이름 매핑
const WEIGHT_STYLE_NAMES = {
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
};

// 타이포는 색상과 동일한 2계층으로 방출한다:
//  - FAI / Typography      (primitive, Value 단일 모드) — 숫자·폰트명은 여기에만 존재
//  - FAI / Typography Web  (semantic, 로케일 KO/EN/JP 모드) — 전부 primitive alias 참조
// typography-w.json이 이미 {font.size.16} 참조 구조이므로 그대로 alias로 옮긴다.
function createTypographyPayload() {
  const primitive = readJSON('typography.json');
  const web = readJSON('typography-w.json');
  const tokens = [];
  const textStyles = [];

  const addFloat = (name, raw) => {
    const parsed = parseNumber(resolveTokenValue(raw, [{ font: primitive }]));
    if (parsed === null || tokens.some((token) => token.name === name)) return;
    tokens.push({
      name,
      type: 'FLOAT',
      values: { Value: parsed },
    });
  };

  // ① primitive
  for (const item of flatten(primitive.size || {}, ['font', 'size'])) addFloat(item.name, item.raw);
  for (const item of flatten(primitive.lineHeight || {}, ['font', 'lineHeight'])) addFloat(item.name, item.raw);
  for (const item of flatten(primitive.letterSpacing || {}, ['font', 'letterSpacing'])) addFloat(item.name, item.raw);
  for (const [key, value] of Object.entries(primitive.family || {})) {
    tokens.push({
      name: joinName(['font', 'family', key]),
      type: 'STRING',
      values: { Value: String(value) },
    });
  }
  // weight — Figma는 숫자 fontWeight 바인딩이 없어 fontStyle 이름(STRING)으로 방출한다.
  for (const key of Object.keys(primitive.weight || {})) {
    const styleName = WEIGHT_STYLE_NAMES[key];
    if (!styleName) continue;
    tokens.push({
      name: joinName(['font', 'weight', key]),
      type: 'STRING',
      values: { Value: styleName },
    });
  }

  // ② 웹 semantic — 로케일을 모드로 접고, 값은 primitive alias
  const localeModes = Object.keys(web).map((locale) => locale.toUpperCase());
  const webTokens = new Map();
  const setWebValue = (name, type, mode, value) => {
    if (value === null || value === undefined) return;
    if (!webTokens.has(name)) webTokens.set(name, { name, type, values: {} });
    webTokens.get(name).values[mode] = value;
  };

  for (const [locale, localeConfig] of Object.entries(web)) {
    const mode = locale.toUpperCase();
    const familyRef = referenceName(localeConfig.font?.family);
    setWebValue('font/family', 'STRING', mode, familyRef ? { alias: familyRef } : localeConfig.font?.family);

    const familyRaw = resolveTokenValue(localeConfig.font?.family, [{ font: primitive }, web]);
    const family = String(familyRaw || '').split(',')[0].replace(/^['"]|['"]$/g, '');

    for (const [category, scales] of Object.entries(localeConfig)) {
      if (category === 'font') continue;
      for (const [scale, style] of Object.entries(scales)) {
        for (const prop of ['size', 'lineHeight', 'letterSpacing']) {
          const ref = referenceName(style[prop]);
          const parsed = parseNumber(resolveTokenValue(style[prop], [{ font: primitive }, web]));
          setWebValue(joinName([category, scale, prop]), 'FLOAT', mode, ref ? { alias: ref } : parsed);
        }

        const size = parseNumber(resolveTokenValue(style.size, [{ font: primitive }, web]));
        const lineHeight = parseNumber(resolveTokenValue(style.lineHeight, [{ font: primitive }, web]));
        const letterSpacing = parseNumber(resolveTokenValue(style.letterSpacing, [{ font: primitive }, web]));
        if (size === null || lineHeight === null || letterSpacing === null) continue;
        // weight는 스케일과 직교(같은 스케일이 400~700으로 두루 쓰임)라서
        // 스케일당 weight 변형 스타일을 모두 생성한다. Figma에선 폴더로 묶여 보인다.
        for (const weightKey of Object.keys(primitive.weight || {})) {
          const styleName = WEIGHT_STYLE_NAMES[weightKey];
          if (!styleName) continue;
          textStyles.push({
            name: joinName(['FAI', 'Typography', 'w', locale, category, scale, styleName]),
            family,
            style: styleName,
            fontSize: size,
            lineHeight,
            letterSpacing,
          });
        }
      }
    }
  }

  return {
    collections: [
      { name: 'FAI / Typography', modes: ['Value'], tokens },
      { name: 'FAI / Typography Web', modes: localeModes, tokens: [...webTokens.values()] },
    ],
    textStyles,
  };
}

// ─── 브랜드 모드 ────────────────────────────
// color-brand.json의 브랜드를 Semantic 컬렉션의 Figma 모드로 변환한다.
// 코드의 [data-brand='…'] 스코프와 동일한 구조:
//  - 브랜드 항목의 text/icon/filled/boder 그룹 → semantic의 optional·border brand 변수 오버라이드
//  - 브랜드 항목의 gray 그룹(primitive 별칭) → gray를 참조하는 모든 semantic을 해당 스케일로 재지정
// 새 브랜드를 Figma 모드로 노출하려면 여기에 { mode, client }만 추가한다.
// base: 'dark'면 semantic Dark 값 + 브랜드 항목의 `dark` 그룹을 기반으로 모드를 만든다.
const BRAND_MODES = [
  { mode: 'Hynix', client: 'hynix' },
  { mode: 'Hynix Dark', client: 'hynix', base: 'dark' },
];

// 브랜드 JSON 그룹 → semantic 변수 경로 매핑
const BRAND_GROUP_TO_SEMANTIC = {
  text: ['text', 'optional'],
  icon: ['icon', 'optional'],
  filled: ['filled', 'optional'],
  boder: ['border'],
};

function buildBrandOverrides(brandTokens) {
  const map = new Map();
  if (!brandTokens) return map;
  for (const [group, target] of Object.entries(BRAND_GROUP_TO_SEMANTIC)) {
    const tokens = brandTokens[group];
    if (!tokens || typeof tokens !== 'object') continue;
    for (const [key, raw] of Object.entries(tokens)) {
      map.set(joinName(['color', ...target, key]), raw);
    }
  }
  return map;
}

// {color.gray.X} 참조를 브랜드의 gray 별칭(예: bluegray)으로 치환
function remapNeutral(raw, brandGray) {
  if (!brandGray) return null;
  const parts = referencePath(raw);
  if (!parts || parts[0] !== 'color' || parts[1] !== 'gray') return null;
  return brandGray[parts[2]] || null;
}

function createCollections() {
  const colorGlobal = readJSON('color-global.json');
  const colorSemantic = readJSON('color-semantic.json');
  const colorBrand = fs.existsSync(path.join(FOUNDATION, 'color-brand.json'))
    ? readJSON('color-brand.json')
    : {};
  const spacing = readJSON('spacing.json');
  const opacity = readJSON('opacity.json');
  const motion = fs.existsSync(path.join(FOUNDATION, 'motion.json')) ? readJSON('motion.json') : null;
  const typography = createTypographyPayload();

  const collections = [
    { name: 'FAI / Color Primitive', modes: ['Value'], tokens: [] },
    { name: 'FAI / Color Semantic', modes: ['Light', 'Dark', ...BRAND_MODES.map((b) => b.mode)], tokens: [] },
    { name: 'FAI / Size', modes: ['Value'], tokens: [] },
    { name: 'FAI / Opacity', modes: ['Value'], tokens: [] },
    { name: 'FAI / Motion', modes: ['Value'], tokens: [] },
    ...typography.collections,
  ];

  const [primitive, semantic, size, opacityCollection, motionCollection] = collections;

  for (const item of flatten(colorGlobal, 'color')) {
    const parsed = parseHex(item.raw);
    if (!parsed) continue;
    addToken(primitive, {
      name: item.name,
      type: 'COLOR',
      values: { Value: parsed },
    });
  }

  const semanticNames = new Set([
    ...flatten(colorSemantic.light || {}, 'color').map((item) => item.name),
    ...flatten(colorSemantic.dark || {}, 'color').map((item) => item.name),
  ]);

  const brandModeData = BRAND_MODES.map(({ mode, client, base }) => ({
    mode,
    base,
    overrides: buildBrandOverrides(base === 'dark' ? colorBrand[client] && colorBrand[client].dark : colorBrand[client]),
    gray: colorBrand[client] && colorBrand[client].gray,
  }));

  for (const name of [...semanticNames].sort()) {
    const lightRaw = flatten(colorSemantic.light || {}, 'color').find((item) => item.name === name)?.raw;
    const darkRaw = flatten(colorSemantic.dark || {}, 'color').find((item) => item.name === name)?.raw;
    const lightRef = referenceName(lightRaw);
    const darkRef = referenceName(darkRaw);
    const lightColor = parseHex(lightRaw);
    const darkColor = parseHex(darkRaw);
    const values = {
      Light: lightRef ? { alias: lightRef } : lightColor,
      Dark: darkRef ? { alias: darkRef } : darkColor,
    };
    // 브랜드 모드 값: ① 브랜드 오버라이드 → ② gray 별칭 치환 → ③ base(Light/Dark) 그대로
    for (const { mode, base, overrides, gray } of brandModeData) {
      const baseRaw = (base === 'dark' ? darkRaw : lightRaw) || lightRaw;
      const brandRaw = overrides.get(name) || remapNeutral(baseRaw, gray) || baseRaw;
      const brandRef = referenceName(brandRaw);
      values[mode] = brandRef ? { alias: brandRef } : parseHex(brandRaw);
    }
    addToken(semantic, {
      name,
      type: 'COLOR',
      values,
    });
  }

  for (const item of flatten(spacing.size || {}, 'size')) {
    const parsed = parseNumber(item.raw);
    if (parsed === null) continue;
    addToken(size, {
      name: item.name,
      type: 'FLOAT',
      values: { Value: parsed },
    });
  }

  for (const item of flatten(spacing.mw || {}, 'mw')) {
    const alias = referenceName(item.raw);
    const parsed = parseNumber(item.raw);
    addToken(size, {
      name: item.name,
      type: 'FLOAT',
      values: { Value: alias ? { alias } : parsed },
    });
  }

  for (const item of flatten(opacity, 'opacity')) {
    const parsed = parseNumber(item.raw);
    if (parsed === null) continue;
    addToken(opacityCollection, {
      name: item.name,
      type: 'FLOAT',
      values: { Value: parsed },
    });
  }

  if (motion) {
    for (const item of flatten(motion.duration || {}, 'duration')) {
      const parsed = parseNumber(item.raw);
      if (parsed === null) continue;
      addToken(motionCollection, {
        name: item.name,
        type: 'FLOAT',
        values: { Value: parsed },
      });
    }

    for (const item of flatten(motion.ease || {}, 'ease')) {
      addToken(motionCollection, {
        name: item.name,
        type: 'STRING',
        values: { Value: String(item.raw) },
      });
    }
  }

  return {
    collections: collections.filter((collection) => collection.tokens.length > 0),
    textStyles: typography.textStyles,
  };
}

function renderPluginCode(payload) {
  // 실행 즉시 전부 넣지 않고, 가져올 컬렉션을 고르는 선택 UI를 먼저 띄운다.
  const uiItems = payload.collections.map((item) => ({ name: item.name, count: item.tokens.length }));
  const collectionRows = uiItems
    .map(
      (item) =>
        `<label class="row"><input type="checkbox" class="col" value="${item.name}" checked><span class="name">${item.name}</span><span class="count">${item.count}</span></label>`
    )
    .join('\n    ');
  const uiHeight = 172 + (uiItems.length + 2) * 30;
  const uiHtml = `<!doctype html>
<html><head><style>
  body { margin: 0; padding: 12px 14px; font: 11.5px/1.4 Inter, 'Pretendard Variable', sans-serif;
         color: var(--figma-color-text, #333); background: var(--figma-color-bg, #fff); }
  h3 { margin: 0 0 2px; font-size: 12.5px; }
  .sub { color: var(--figma-color-text-secondary, #888); margin: 0 0 10px; }
  .row { display: flex; align-items: center; gap: 8px; height: 30px; cursor: pointer; }
  .row input { margin: 0; }
  .name { flex: 1; }
  .count { color: var(--figma-color-text-secondary, #999); font-variant-numeric: tabular-nums; }
  .divider { border: 0; border-top: 1px solid var(--figma-color-border, #e5e5e5); margin: 6px 0; }
  .footer { display: flex; gap: 8px; margin-top: 12px; }
  button { flex: 1; height: 30px; border-radius: 6px; border: 1px solid var(--figma-color-border, #ccc);
           background: var(--figma-color-bg, #fff); color: inherit; cursor: pointer; font: inherit; }
  #import { background: #00827c; border-color: #00827c; color: #fff; font-weight: 600; }
  #all { flex: none; width: auto; padding: 0 10px; }
</style></head><body>
  <h3>가져올 항목 선택</h3>
  <p class="sub">Semantic·Web의 alias는 참조하는 Primitive가 파일에 있어야 연결됩니다.</p>
  ${collectionRows}
  <hr class="divider">
  <label class="row"><input type="checkbox" id="textstyles" checked><span class="name">Text Styles</span><span class="count">${payload.textStyles.length}</span></label>
  <label class="row"><input type="checkbox" id="overview"><span class="name">개요 페이지 생성</span></label>
  <div class="footer">
    <button id="all">전체</button>
    <button id="cancel">취소</button>
    <button id="import">Import</button>
  </div>
  <script>
    const boxes = Array.from(document.querySelectorAll('.col'));
    document.getElementById('all').onclick = () => {
      const next = !boxes.every((box) => box.checked);
      boxes.forEach((box) => { box.checked = next; });
    };
    document.getElementById('cancel').onclick = () =>
      parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    document.getElementById('import').onclick = () =>
      parent.postMessage({ pluginMessage: {
        type: 'import',
        collections: boxes.filter((box) => box.checked).map((box) => box.value),
        textStyles: document.getElementById('textstyles').checked,
        overview: document.getElementById('overview').checked,
      } }, '*');
  </script>
</body></html>`;

  return `const PAYLOAD = ${JSON.stringify(payload, null, 2)};

const UI_HTML = ${JSON.stringify(uiHtml)};
let FONT = null;
let FONT_BOLD = null;
let TEXT_ENABLED = false;

async function loadFonts() {
  if (typeof figma.listAvailableFontsAsync !== 'function') return;
  const fonts = await figma.listAvailableFontsAsync();
  if (!fonts.length) return;
  const regular =
    fonts.find((item) => item.fontName.family === 'Inter' && item.fontName.style === 'Regular') ||
    fonts.find((item) => item.fontName.style === 'Regular') ||
    fonts[0];
  const bold =
    fonts.find((item) => item.fontName.family === regular.fontName.family && /Bold|Semi Bold|Medium/.test(item.fontName.style)) ||
    regular;
  FONT = regular.fontName;
  FONT_BOLD = bold.fontName;
  await figma.loadFontAsync(FONT);
  if (FONT_BOLD.family !== FONT.family || FONT_BOLD.style !== FONT.style) {
    await figma.loadFontAsync(FONT_BOLD);
  }
  TEXT_ENABLED = true;
}

async function findFont(family, style) {
  if (typeof figma.listAvailableFontsAsync !== 'function') return null;
  const fonts = await figma.listAvailableFontsAsync();
  const families = [family, String(family).replace(/ Variable$/, '')].filter(Boolean);
  const exact = fonts.find((item) => families.includes(item.fontName.family) && item.fontName.style === style);
  if (exact) return exact.fontName;
  const regular = fonts.find((item) => families.includes(item.fontName.family) && item.fontName.style === 'Regular');
  if (regular) return regular.fontName;
  const sameFamily = fonts.find((item) => families.includes(item.fontName.family));
  return sameFamily ? sameFamily.fontName : null;
}

async function findTextStyleByName(name) {
  if (typeof figma.getLocalTextStylesAsync !== 'function') return null;
  const styles = await figma.getLocalTextStylesAsync();
  return styles.find((style) => style.name === name) || null;
}

async function importTextStyles() {
  if (!PAYLOAD.textStyles || !PAYLOAD.textStyles.length) return { created: 0, updated: 0, skipped: 0 };
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const styleData of PAYLOAD.textStyles) {
    const fontName = await findFont(styleData.family, styleData.style);
    if (!fontName) {
      skipped += 1;
      continue;
    }
    await figma.loadFontAsync(fontName);
    let style = await findTextStyleByName(styleData.name);
    if (!style) {
      style = figma.createTextStyle();
      style.name = styleData.name;
      created += 1;
    } else {
      updated += 1;
    }
    style.fontName = fontName;
    style.fontSize = styleData.fontSize;
    style.lineHeight = { unit: 'PIXELS', value: styleData.lineHeight };
    style.letterSpacing = { unit: 'PIXELS', value: styleData.letterSpacing };
  }

  return { created, updated, skipped };
}

function findModeId(collection, modeName) {
  const mode = collection.modes.find((item) => item.name === modeName) || collection.modes[0];
  return mode.modeId;
}

async function findCollectionByName(name) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  return collections.find((collection) => collection.name === name) || null;
}

async function findVariableByName(name, collectionId) {
  const variables = await figma.variables.getLocalVariablesAsync();
  return variables.find((variable) => variable.name === name && variable.variableCollectionId === collectionId) || null;
}

function asVariableValue(value, variablesByName) {
  if (value && typeof value === 'object' && value.alias) {
    const aliased = variablesByName.get(value.alias);
    return aliased ? figma.variables.createVariableAlias(aliased) : null;
  }
  return value;
}

function removePageByName(name) {
  const page = figma.root.children.find((item) => item.name === name);
  if (page) page.remove();
}

function createText(name, text, x, y, size, bold) {
  if (!TEXT_ENABLED) return null;
  const node = figma.createText();
  node.name = name;
  node.fontName = bold ? FONT_BOLD : FONT;
  node.characters = text;
  node.fontSize = size;
  node.x = x;
  node.y = y;
  node.fills = [{ type: 'SOLID', color: { r: 0.12, g: 0.12, b: 0.12 } }];
  figma.currentPage.appendChild(node);
  return node;
}

function createFrame(name, x, y, width, height) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.x = x;
  frame.y = y;
  frame.resize(width, height);
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  frame.strokeWeight = 1;
  frame.cornerRadius = 12;
  figma.currentPage.appendChild(frame);
  return frame;
}

function colorToPaint(value) {
  if (!value || value.alias) return { type: 'SOLID', color: { r: 0.94, g: 0.94, b: 0.94 } };
  return { type: 'SOLID', color: { r: value.r, g: value.g, b: value.b }, opacity: value.a };
}

function readableColor(value) {
  if (!value || value.alias) return '#alias';
  const toHex = (number) => Math.round(number * 255).toString(16).padStart(2, '0').toUpperCase();
  return '#' + toHex(value.r) + toHex(value.g) + toHex(value.b);
}

function drawColorCollection(page, collectionData, x, y, title, modeName) {
  createText('Title / ' + title, title, x, y, 28, true);
  createText('Meta / ' + title, collectionData.tokens.length + ' variables', x, y + 36, 13, false);

  const groups = new Map();
  for (const token of collectionData.tokens) {
    const parts = token.name.split('/');
    const group = parts.slice(0, Math.min(parts.length - 1, 2)).join('/');
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(token);
  }

  let cursorY = y + 84;
  let cursorX = x;
  let groupIndex = 0;
  for (const [group, tokens] of [...groups].slice(0, 12)) {
    if (groupIndex > 0 && groupIndex % 3 === 0) {
      cursorX = x;
      cursorY += 166;
    }
    const cardX = cursorX + (groupIndex % 3) * 360;
    const card = createFrame('Group / ' + group, cardX, cursorY, 328, 132);
    page.appendChild(card);
    createText('Label / ' + group, group, cardX + 16, cursorY + 14, 14, true);

    let swatchX = cardX + 16;
    let swatchY = cursorY + 46;
    for (const token of tokens.slice(0, 12)) {
      const rect = figma.createRectangle();
      rect.name = token.name;
      rect.x = swatchX;
      rect.y = swatchY;
      rect.resize(36, 36);
      rect.cornerRadius = 8;
      rect.fills = [colorToPaint(token.values[modeName])];
      rect.strokes = [{ type: 'SOLID', color: { r: 0.84, g: 0.84, b: 0.84 } }];
      rect.strokeWeight = 1;
      page.appendChild(rect);
      createText('Value / ' + token.name, token.name.split('/').pop(), swatchX, swatchY + 44, 9, false);
      swatchX += 50;
      if (swatchX > cardX + 280) {
        swatchX = cardX + 16;
        swatchY += 62;
      }
    }
    groupIndex += 1;
  }

  return cursorY + Math.ceil(groupIndex / 3) * 166;
}

function drawFloatCollection(page, collectionData, x, y, title) {
  createText('Title / ' + title, title, x, y, 28, true);
  createText('Meta / ' + title, collectionData.tokens.length + ' variables', x, y + 36, 13, false);

  let rowY = y + 84;
  for (const token of collectionData.tokens.slice(0, 36)) {
    const value = token.values.Value;
    if (typeof value !== 'number') continue;
    createText('Token / ' + token.name, token.name, x, rowY + 3, 11, false);
    const bar = figma.createRectangle();
    bar.name = 'Preview / ' + token.name;
    bar.x = x + 260;
    bar.y = rowY;
    bar.resize(Math.max(2, Math.min(value, 240)), 16);
    bar.cornerRadius = 8;
    bar.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.86, b: 0.12 } }];
    page.appendChild(bar);
    createText('Value / ' + token.name, String(value), x + 520, rowY + 1, 11, false);
    rowY += 26;
  }
  return rowY;
}

function drawMotionCollection(page, collectionData, x, y) {
  createText('Title / FAI / Motion', 'FAI / Motion', x, y, 28, true);
  createText('Meta / FAI / Motion', collectionData.tokens.length + ' variables', x, y + 36, 13, false);

  let rowY = y + 84;
  for (const token of collectionData.tokens) {
    const value = token.values.Value;
    createText('Token / ' + token.name, token.name, x, rowY, 13, false);
    createText('Value / ' + token.name, String(value), x + 280, rowY, 13, false);
    rowY += 28;
  }
  return rowY;
}

async function createOverviewPage() {
  removePageByName('FAI Variables Overview');
  const page = figma.createPage();
  page.name = 'FAI Variables Overview';
  await figma.setCurrentPageAsync(page);

  const background = figma.createRectangle();
  background.name = 'Overview background';
  background.x = 0;
  background.y = 0;
  background.resize(1320, 5200);
  background.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.95 } }];
  page.appendChild(background);
  background.locked = true;

  try {
    await loadFonts();
  } catch (error) {
    TEXT_ENABLED = false;
  }

  createText('Page title', 'FAI Foundation Variables', 80, 64, 40, true);
  createText('Page description', 'Generated from platform-system/root/foundation', 80, 116, 16, false);

  const primitive = PAYLOAD.collections.find((item) => item.name === 'FAI / Color Primitive');
  const semantic = PAYLOAD.collections.find((item) => item.name === 'FAI / Color Semantic');
  const size = PAYLOAD.collections.find((item) => item.name === 'FAI / Size');
  const opacity = PAYLOAD.collections.find((item) => item.name === 'FAI / Opacity');
  const motion = PAYLOAD.collections.find((item) => item.name === 'FAI / Motion');

  let y = 180;
  if (primitive) y = drawColorCollection(page, primitive, 80, y, 'FAI / Color Primitive', 'Value') + 64;
  if (semantic) y = drawColorCollection(page, semantic, 80, y, 'FAI / Color Semantic / Light', 'Light') + 64;
  if (size) y = drawFloatCollection(page, size, 80, y, 'FAI / Size') + 64;
  if (opacity) y = drawFloatCollection(page, opacity, 760, y - 64, 'FAI / Opacity') + 64;
  if (motion) drawMotionCollection(page, motion, 760, y, 'FAI / Motion');

  figma.viewport.scrollAndZoomIntoView(page.children);
}

async function importVariables(options) {
  const variablesByName = new Map();
  // 파일에 이미 존재하는 변수를 먼저 등록 — 선택 안 한 컬렉션(예: 이전에 넣어둔
  // Primitive)을 참조하는 alias도 연결되도록.
  const existingVariables = await figma.variables.getLocalVariablesAsync();
  for (const variable of existingVariables) {
    if (!variablesByName.has(variable.name)) variablesByName.set(variable.name, variable);
  }
  let created = 0;
  let updated = 0;
  let skippedAliases = 0;

  const selectedCollections = PAYLOAD.collections.filter((item) => options.collections.includes(item.name));

  for (const collectionData of selectedCollections) {
    let collection = await findCollectionByName(collectionData.name);
    if (!collection) collection = figma.variables.createVariableCollection(collectionData.name);

    // Figma는 새 컬렉션에 기본 모드 'Mode 1'을 깔아준다. 이걸 그대로 두면
    // 값이 채워지지 않는 0짜리 모드가 남으므로, 첫 미존재 payload 모드로 rename해
    // 재활용하고, 그래도 남으면 제거한다.
    for (const modeName of collectionData.modes) {
      if (!collection.modes.some((mode) => mode.name === modeName)) {
        const stray = collection.modes.find((mode) => mode.name === 'Mode 1');
        if (stray && !collectionData.modes.includes('Mode 1')) {
          collection.renameMode(stray.modeId, modeName);
        } else {
          collection.addMode(modeName);
        }
      }
    }
    const leftover = collection.modes.find(
      (mode) => mode.name === 'Mode 1' && !collectionData.modes.includes('Mode 1')
    );
    if (leftover && collection.modes.length > 1) {
      collection.removeMode(leftover.modeId);
    }

    for (const token of collectionData.tokens) {
      let variable = await findVariableByName(token.name, collection.id);
      if (!variable) {
        variable = figma.variables.createVariable(token.name, collection, token.type);
        created += 1;
      } else {
        updated += 1;
      }
      variablesByName.set(token.name, variable);
    }
  }

  for (const collectionData of selectedCollections) {
    const collection = await findCollectionByName(collectionData.name);
    if (!collection) continue;

    for (const token of collectionData.tokens) {
      const variable = await findVariableByName(token.name, collection.id);
      if (!variable) continue;

      for (const [modeName, rawValue] of Object.entries(token.values)) {
        const modeId = findModeId(collection, modeName);
        const value = asVariableValue(rawValue, variablesByName);
        if (value === null || value === undefined) {
          skippedAliases += 1;
          continue;
        }
        variable.setValueForMode(modeId, value);
      }
    }
  }

  const textStyles = options.textStyles
    ? await importTextStyles()
    : { created: 0, updated: 0, skipped: 0 };
  if (options.overview) await createOverviewPage();

  let message = 'FAI variables: ' + created + ' created, ' + updated + ' updated';
  if (skippedAliases) message += ', ' + skippedAliases + ' aliases skipped (참조 대상 Primitive 없음)';
  if (options.textStyles) {
    message += ' · text styles ' + textStyles.created + ' created, ' + textStyles.updated + ' updated';
    if (textStyles.skipped) message += ', ' + textStyles.skipped + ' skipped';
  }
  figma.notify(message);
  figma.closePlugin();
}

// ─── 선택 UI ───
figma.showUI(UI_HTML, { width: 300, height: ${uiHeight}, themeColors: true });
figma.ui.onmessage = (msg) => {
  if (!msg) return;
  if (msg.type === 'cancel') {
    figma.closePlugin();
    return;
  }
  if (msg.type === 'import') {
    if (!msg.collections.length && !msg.textStyles) {
      figma.notify('가져올 항목을 하나 이상 선택하세요.', { error: true });
      return;
    }
    importVariables({
      collections: msg.collections,
      textStyles: msg.textStyles,
      overview: msg.overview,
    }).catch((error) => {
      figma.notify('FAI variable import failed: ' + error.message, { error: true });
      figma.closePlugin();
    });
  }
};
`;
}

function main() {
  const foundation = createCollections();
  const payload = {
    source: 'platform-system/root/foundation',
    generatedAt: new Date().toISOString(),
    collections: foundation.collections,
    textStyles: foundation.textStyles,
  };

  for (const outDir of OUT_DIRS) {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'fai-foundation-variables.json'), JSON.stringify(payload, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'code.js'), renderPluginCode(payload));
  }
  console.log(`Generated ${payload.collections.length} Figma variable collections.`);
  for (const collection of payload.collections) {
    console.log(`- ${collection.name}: ${collection.tokens.length}`);
  }
  console.log(`- FAI / Typography Text Styles: ${payload.textStyles.length}`);
}

main();
