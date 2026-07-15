#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOOL_DIR = path.join(ROOT, 'tools', 'figma-component-generator');
const SPECS_DIR = path.join(TOOL_DIR, 'specs');

const specName = process.argv[2] || 'all';
const specFiles = fs.readdirSync(SPECS_DIR).filter((file) => file.endsWith('.json')).sort();
const selectedSpecFiles = specName === 'all' ? specFiles : [`${specName}.json`];

const specs = selectedSpecFiles.map((file) => {
  const specPath = path.join(SPECS_DIR, file);
  if (!fs.existsSync(specPath)) {
    console.error(`Spec not found: ${path.relative(ROOT, specPath)}`);
    process.exit(1);
  }

  return {
    id: path.basename(file, '.json'),
    ...JSON.parse(fs.readFileSync(specPath, 'utf8')),
  };
});
const tokenSources = {
  color: JSON.parse(fs.readFileSync(path.join(ROOT, 'root', 'foundation', 'color-global.json'), 'utf8')),
  semantic: JSON.parse(fs.readFileSync(path.join(ROOT, 'root', 'foundation', 'color-semantic.json'), 'utf8')),
  size: JSON.parse(fs.readFileSync(path.join(ROOT, 'root', 'foundation', 'spacing.json'), 'utf8')).size,
  space: JSON.parse(fs.readFileSync(path.join(ROOT, 'root', 'foundation', 'spacing.json'), 'utf8')).mw,
  font: JSON.parse(fs.readFileSync(path.join(ROOT, 'root', 'foundation', 'typography.json'), 'utf8')),
  grid: JSON.parse(fs.readFileSync(path.join(ROOT, 'root', 'web', 'tokens', 'grid.json'), 'utf8')),
  shadow: JSON.parse(fs.readFileSync(path.join(ROOT, 'root', 'foundation', 'effects.json'), 'utf8')).shadow,
};

function getByPath(source, tokenPath) {
  return tokenPath.split('.').reduce((current, key) => {
    if (!current) {
      return undefined;
    }
    if (current[key] !== undefined) {
      return current[key];
    }
    return current[key.toLowerCase()];
  }, source);
}

function resolveToken(tokenPath) {
  const namespace = tokenPath.split('.')[0];
  const source = tokenSources[namespace];
  if (!source) {
    throw new Error(`Unknown token namespace: ${namespace}`);
  }

  const value = getByPath(source, tokenPath.split('.').slice(1).join('.'));
  if (value === undefined) {
    throw new Error(`Token not found: ${tokenPath}`);
  }

  if (typeof value === 'string') {
    const match = value.match(/^\{(.+)\}$/);
    if (match) {
      return resolveToken(match[1]);
    }
  }

  return value;
}

function toPixels(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.endsWith('rem')) {
    return Number.parseFloat(value) * 16;
  }
  if (typeof value === 'string' && value.endsWith('px')) {
    return Number.parseFloat(value);
  }
  return value;
}

function resolveSpecTokens(value) {
  if (Array.isArray(value)) {
    return value.map(resolveSpecTokens);
  }
  if (value && typeof value === 'object') {
    if (value.$token) {
      return resolveToken(value.$token);
    }
    if (value.$pixelToken) {
      return toPixels(resolveToken(value.$pixelToken));
    }
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveSpecTokens(item)]));
  }
  return value;
}

function renderPluginCode(componentSpecs) {
  return `const SPECS = ${JSON.stringify(resolveSpecTokens(componentSpecs), null, 2)};
let SPEC = SPECS[0];

const FONT_FAMILIES = ["Pretendard Variable", "Pretendard", "Inter", "Arial"];

async function loadFont(style = "Regular") {
  for (const family of FONT_FAMILIES) {
    const font = { family, style };
    try {
      await figma.loadFontAsync(font);
      return font;
    } catch (error) {
      if (style !== "Regular") {
        const regularFont = { family, style: "Regular" };
        try {
          await figma.loadFontAsync(regularFont);
          return regularFont;
        } catch (regularError) {
          // Try the next family.
        }
      }
    }
  }
  throw new Error("No supported font found.");
}

function hexToPaint(hex) {
  const value = String(hex || "#000000").replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const a = value.length === 8 ? parseInt(value.slice(6, 8), 16) / 255 : 1;
  return { type: "SOLID", color: { r, g, b }, opacity: a };
}

function applyAutoLayout(node, layout) {
  // Figma sizing enum은 FIXED/AUTO만 유효. 스펙의 FILL 등은 AUTO로 정규화.
  const normSizing = (v) => (v === "FIXED" || v === "AUTO") ? v : "AUTO";
  node.layoutMode = layout.direction === "vertical" ? "VERTICAL" : "HORIZONTAL";
  node.primaryAxisSizingMode = normSizing(layout.primarySizing);
  node.counterAxisSizingMode = normSizing(layout.counterSizing);
  node.itemSpacing = layout.gap || 0;
  node.paddingTop = layout.padding?.top || 0;
  node.paddingRight = layout.padding?.right || 0;
  node.paddingBottom = layout.padding?.bottom || 0;
  node.paddingLeft = layout.padding?.left || 0;
  node.primaryAxisAlignItems = layout.primaryAlign || "MIN";
  node.counterAxisAlignItems = layout.counterAlign || "CENTER";
}

function createLabel(text, fontName, style) {
  const node = figma.createText();
  node.name = "label";
  node.fontName = fontName;
  node.characters = text;
  node.fontSize = style.fontSize;
  node.lineHeight = { unit: "PIXELS", value: style.lineHeight };
  node.fills = [hexToPaint(style.color)];
  return node;
}

function createBadgeIcon(style) {
  const node = figma.createEllipse();
  node.name = "icon";
  node.resize(style.size, style.size);
  node.fills = [hexToPaint(style.color)];
  return node;
}

function createSymbol(text, fontName, style) {
  const node = createLabel(text, fontName, style);
  node.name = "icon";
  node.textAlignHorizontal = "CENTER";
  node.textAlignVertical = "CENTER";
  node.resize(style.size, style.size);
  return node;
}

function createTabItem(label, state, fontName, spec) {
  const item = figma.createFrame();
  item.name = "tab-item / " + state;
  applyAutoLayout(item, spec.item.layout);
  item.cornerRadius = spec.item.radius;
  item.fills = [hexToPaint(spec.item.states[state].fill)];

  const text = createLabel(label, fontName, {
    ...spec.item.text,
    color: spec.item.states[state].text,
  });
  item.appendChild(text);
  return item;
}

function createNavTabVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.height);
  applyAutoLayout(component, SPEC.component.layout);
  component.fills = [hexToPaint(SPEC.component.fill)];
  component.strokes = [hexToPaint(SPEC.component.stroke)];
  component.strokeWeight = SPEC.component.strokeWeight;

  const count = variantSpec.count === "default" ? SPEC.defaults.defaultCount : Number(variantSpec.count);
  for (let index = 0; index < count; index += 1) {
    const label = SPEC.defaults.labels[index] || "Tab " + (index + 1);
    const state = index === 0 ? "active" : "default";
    component.appendChild(createTabItem(label, state, fontName, SPEC));
  }
  return component;
}

function createBadgeVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.minWidth, SPEC.component.height);
  applyAutoLayout(component, SPEC.component.layout);
  component.cornerRadius = SPEC.component.radius;
  component.fills = [hexToPaint(variantSpec.fill)];

  if (variantSpec.icon) {
    component.appendChild(createBadgeIcon({
      size: SPEC.icon.size,
      color: variantSpec.text,
    }));
  }

  component.appendChild(createLabel(variantSpec.label, fontName, {
    ...SPEC.text,
    color: variantSpec.text,
  }));
  return component;
}

function createBannerVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.minHeight);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = 0;
  component.fills = [];

  const header = figma.createFrame();
  header.name = "header";
  header.resize(SPEC.component.width, SPEC.header.minHeight);
  applyAutoLayout(header, SPEC.header.layout);
  header.fills = [hexToPaint(variantSpec.fill)];
  header.cornerRadius = variantSpec.container === "card" && !variantSpec.expanded ? SPEC.component.radius : 0;
  if (variantSpec.container === "card" && variantSpec.expanded) {
    header.topLeftRadius = SPEC.component.radius;
    header.topRightRadius = SPEC.component.radius;
    header.bottomLeftRadius = 0;
    header.bottomRightRadius = 0;
  }

  header.appendChild(createSymbol(variantSpec.icon, fontName, {
    ...SPEC.icon,
    color: variantSpec.iconColor,
  }));

  const copy = figma.createFrame();
  copy.name = "copy";
  copy.layoutMode = "VERTICAL";
  copy.primaryAxisSizingMode = "AUTO";
  copy.counterAxisSizingMode = "FIXED";
  copy.resize(SPEC.copy.width, SPEC.header.minHeight);
  copy.itemSpacing = SPEC.copy.gap;
  copy.fills = [];
  copy.layoutGrow = 1;

  copy.appendChild(createLabel(variantSpec.title, fontName, {
    ...SPEC.title,
    color: SPEC.title.color,
  }));

  if (variantSpec.description) {
    copy.appendChild(createLabel(variantSpec.description, fontName, {
      ...SPEC.description,
      color: SPEC.description.color,
    }));
  }
  header.appendChild(copy);

  const actions = figma.createFrame();
  actions.name = "actions";
  actions.layoutMode = "HORIZONTAL";
  actions.primaryAxisSizingMode = "AUTO";
  actions.counterAxisSizingMode = "AUTO";
  actions.counterAxisAlignItems = "CENTER";
  actions.itemSpacing = SPEC.actions.gap;
  actions.fills = [];

  if (variantSpec.expanded) {
    actions.appendChild(createSymbol("^", fontName, SPEC.actionIcon));
  }
  if (variantSpec.dismissable) {
    actions.appendChild(createSymbol("x", fontName, SPEC.actionIcon));
  }
  if (variantSpec.expanded || variantSpec.dismissable) {
    header.appendChild(actions);
  }

  component.appendChild(header);

  if (variantSpec.expanded) {
    const content = figma.createFrame();
    content.name = "content";
    content.resize(SPEC.component.width, SPEC.content.minHeight);
    applyAutoLayout(content, SPEC.content.layout);
    content.fills = [hexToPaint(SPEC.content.fill)];
    content.strokes = [hexToPaint(SPEC.content.stroke)];
    content.strokeWeight = SPEC.content.strokeWeight;
    if (variantSpec.container === "card") {
      content.topLeftRadius = 0;
      content.topRightRadius = 0;
      content.bottomLeftRadius = SPEC.component.radius;
      content.bottomRightRadius = SPEC.component.radius;
    }
    content.appendChild(createLabel(SPEC.content.label, fontName, {
      ...SPEC.description,
      color: SPEC.description.color,
    }));
    component.appendChild(content);
  }

  return component;
}

function createBreadcrumbItem(label, index, total, variantSpec, fontName) {
  const item = figma.createFrame();
  item.name = index === total - 1 ? "item / current" : "item / link";
  applyAutoLayout(item, SPEC.item.layout);
  item.fills = [];

  if (index > 0) {
    item.appendChild(createLabel(variantSpec.separator, fontName, {
      ...SPEC.text[variantSpec.variant],
      color: SPEC.separator.color,
    }));
  }

  const isCurrent = index === total - 1;
  item.appendChild(createLabel(label, fontName, {
    ...SPEC.text[variantSpec.variant],
    color: isCurrent ? variantSpec.currentColor : variantSpec.linkColor,
  }));

  return item;
}

function createBreadcrumbsVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  applyAutoLayout(component, SPEC.component.layout);
  component.fills = [];

  variantSpec.items.forEach((label, index) => {
    component.appendChild(createBreadcrumbItem(label, index, variantSpec.items.length, variantSpec, fontName));
  });

  return component;
}

function createButtonPrimitive(buttonSpec, index, total, groupSpec, fontName) {
  const button = figma.createFrame();
  button.name = "button / " + buttonSpec.label;
  button.resize(SPEC.button.width, SPEC.button.height[groupSpec.size]);
  applyAutoLayout(button, SPEC.button.layout[groupSpec.size]);
  button.fills = [hexToPaint(groupSpec.fill)];
  button.strokes = [hexToPaint(groupSpec.stroke)];
  button.strokeWeight = SPEC.button.strokeWeight;

  if (groupSpec.orientation === "horizontal") {
    button.topLeftRadius = index === 0 ? groupSpec.radius : 0;
    button.bottomLeftRadius = index === 0 ? groupSpec.radius : 0;
    button.topRightRadius = index === total - 1 ? groupSpec.radius : 0;
    button.bottomRightRadius = index === total - 1 ? groupSpec.radius : 0;
  } else {
    button.topLeftRadius = index === 0 ? groupSpec.radius : 0;
    button.topRightRadius = index === 0 ? groupSpec.radius : 0;
    button.bottomLeftRadius = index === total - 1 ? groupSpec.radius : 0;
    button.bottomRightRadius = index === total - 1 ? groupSpec.radius : 0;
  }

  button.appendChild(createLabel(buttonSpec.label, fontName, {
    ...SPEC.button.text[groupSpec.size],
    color: groupSpec.text,
  }));
  return button;
}

function createButtonGroupVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.layoutMode = variantSpec.orientation === "vertical" ? "VERTICAL" : "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = -SPEC.button.strokeWeight;
  component.fills = [];

  variantSpec.items.forEach((buttonSpec, index) => {
    component.appendChild(createButtonPrimitive(buttonSpec, index, variantSpec.items.length, variantSpec, fontName));
  });

  return component;
}

function createSimpleButtonVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(variantSpec.width || SPEC.component.width, SPEC.component.height[variantSpec.size]);
  applyAutoLayout(component, SPEC.component.layout[variantSpec.size]);
  component.cornerRadius = variantSpec.radius;
  component.fills = [hexToPaint(variantSpec.fill)];
  component.strokes = [hexToPaint(variantSpec.stroke)];
  component.strokeWeight = SPEC.component.strokeWeight;

  if (variantSpec.icon) {
    component.appendChild(createSymbol(variantSpec.icon, fontName, {
      ...SPEC.icon[variantSpec.size],
      color: variantSpec.text,
    }));
  }

  if (!SPEC.component.iconOnly) {
    component.appendChild(createLabel(variantSpec.label, fontName, {
      ...SPEC.text[variantSpec.size],
      color: variantSpec.text,
    }));
  }
  return component;
}

function createToggleButtonVariant(variantSpec, fontName) {
  const component = createSimpleButtonVariant(variantSpec, fontName);
  if (variantSpec.pressed) {
    component.name = variantSpec.name;
  }
  return component;
}

function createCheckboxMark(variantSpec, fontName) {
  const box = figma.createFrame();
  box.name = "checkbox";
  box.resize(SPEC.box.size, SPEC.box.size);
  box.cornerRadius = SPEC.box.radius;
  box.fills = [hexToPaint(variantSpec.boxFill)];
  box.strokes = [hexToPaint(variantSpec.boxStroke)];
  box.strokeWeight = SPEC.box.strokeWeight;
  if (variantSpec.state === "checked" || variantSpec.state === "partial") {
    const mark = figma.createText();
    mark.name = "mark";
    mark.fontName = fontName;
    mark.characters = variantSpec.state === "partial" ? "-" : "v";
    mark.fontSize = 12;
    mark.lineHeight = { unit: "PIXELS", value: 12 };
    mark.fills = [hexToPaint(variantSpec.markColor)];
    box.appendChild(mark);
  }
  return box;
}

function createCheckboxVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  applyAutoLayout(component, SPEC.component.layout);
  component.fills = [];
  component.appendChild(createCheckboxMark(variantSpec, fontName));

  const copy = figma.createFrame();
  copy.name = "copy";
  copy.layoutMode = "VERTICAL";
  copy.primaryAxisSizingMode = "AUTO";
  copy.counterAxisSizingMode = "AUTO";
  copy.itemSpacing = SPEC.copy.gap;
  copy.fills = [];
  copy.appendChild(createLabel(variantSpec.label, fontName, {
    ...SPEC.label,
    color: variantSpec.text,
  }));
  if (variantSpec.description) {
    copy.appendChild(createLabel(variantSpec.description, fontName, {
      ...SPEC.description,
      color: variantSpec.descriptionColor,
    }));
  }
  component.appendChild(copy);
  return component;
}

function createCardVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.height);
  applyAutoLayout(component, SPEC.component.layout[variantSpec.padding]);
  component.cornerRadius = SPEC.component.radius;
  component.fills = [hexToPaint(variantSpec.fill)];
  component.strokes = [hexToPaint(variantSpec.stroke)];
  component.strokeWeight = SPEC.component.strokeWeight;

  component.appendChild(createLabel(variantSpec.title, fontName, {
    ...SPEC.title,
    color: SPEC.title.color,
  }));
  component.appendChild(createLabel(variantSpec.description, fontName, {
    ...SPEC.description,
    color: SPEC.description.color,
  }));

  if (variantSpec.selected) {
    const indicator = createBadgeIcon({
      size: SPEC.indicator.size,
      color: SPEC.indicator.fill,
    });
    indicator.name = "selected-indicator";
    component.appendChild(indicator);
  }
  return component;
}

function createCarouselVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.height);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = variantSpec.gap;
  component.fills = [];

  variantSpec.items.forEach((label) => {
    const item = figma.createFrame();
    item.name = "item";
    item.resize(SPEC.item.width, SPEC.item.height);
    applyAutoLayout(item, SPEC.item.layout);
    item.cornerRadius = SPEC.item.radius;
    item.fills = [hexToPaint(SPEC.item.fill)];
    item.strokes = [hexToPaint(SPEC.item.stroke)];
    item.strokeWeight = 1;
    item.appendChild(createLabel(label, fontName, SPEC.item.text));
    component.appendChild(item);
  });

  return component;
}

function createCalendarCell(day, state, fontName) {
  const cell = figma.createFrame();
  cell.name = "day / " + state;
  cell.resize(SPEC.cell.size, SPEC.cell.size);
  applyAutoLayout(cell, SPEC.cell.layout);
  cell.cornerRadius = state === "in-range" ? 0 : SPEC.cell.radius;
  cell.fills = [hexToPaint(SPEC.cell.states[state].fill)];
  cell.strokes = SPEC.cell.states[state].stroke ? [hexToPaint(SPEC.cell.states[state].stroke)] : [];
  cell.strokeWeight = SPEC.cell.states[state].stroke ? 1 : 0;
  cell.appendChild(createLabel(String(day), fontName, {
    ...SPEC.cell.text,
    color: SPEC.cell.states[state].text,
  }));
  return cell;
}

function createCalendarVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.height);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = SPEC.component.gap;
  component.fills = [hexToPaint(SPEC.component.fill)];

  const header = figma.createFrame();
  header.name = "month";
  applyAutoLayout(header, SPEC.header.layout);
  header.fills = [];
  header.appendChild(createSymbol("<", fontName, SPEC.header.icon));
  header.appendChild(createLabel(variantSpec.month, fontName, SPEC.header.text));
  header.appendChild(createSymbol(">", fontName, SPEC.header.icon));
  component.appendChild(header);

  const weekdays = figma.createFrame();
  weekdays.name = "weekdays";
  weekdays.layoutMode = "HORIZONTAL";
  weekdays.primaryAxisSizingMode = "AUTO";
  weekdays.counterAxisSizingMode = "AUTO";
  weekdays.itemSpacing = 0;
  weekdays.fills = [];
  SPEC.weekdays.forEach((day) => weekdays.appendChild(createLabel(day, fontName, SPEC.weekdayText)));
  component.appendChild(weekdays);

  const grid = figma.createFrame();
  grid.name = "grid";
  grid.layoutMode = "VERTICAL";
  grid.primaryAxisSizingMode = "AUTO";
  grid.counterAxisSizingMode = "AUTO";
  grid.itemSpacing = 0;
  grid.fills = [];
  for (let rowIndex = 0; rowIndex < 6; rowIndex += 1) {
    const row = figma.createFrame();
    row.name = "week";
    row.layoutMode = "HORIZONTAL";
    row.primaryAxisSizingMode = "AUTO";
    row.counterAxisSizingMode = "AUTO";
    row.itemSpacing = 0;
    row.fills = [];
    for (let colIndex = 0; colIndex < 7; colIndex += 1) {
      const day = rowIndex * 7 + colIndex - 1;
      let state = "default";
      if (variantSpec.mode === "range" && day >= 10 && day <= 15) state = "in-range";
      if (day === 12 || (variantSpec.mode === "range" && day === 15)) state = "selected";
      if (day < 1 || day > 31) state = "outside";
      row.appendChild(createCalendarCell(day < 1 ? "" : day > 31 ? "" : day, state, fontName));
    }
    grid.appendChild(row);
  }
  component.appendChild(grid);
  return component;
}

function createVariant(variantSpec, fontName) {
  if (SPEC.template === "calendar") {
    return createCalendarVariant(variantSpec, fontName);
  }
  if (SPEC.template === "carousel") {
    return createCarouselVariant(variantSpec, fontName);
  }
  if (SPEC.template === "card") {
    return createCardVariant(variantSpec, fontName);
  }
  if (SPEC.template === "checkbox") {
    return createCheckboxVariant(variantSpec, fontName);
  }
  if (SPEC.template === "toggle-button") {
    return createToggleButtonVariant(variantSpec, fontName);
  }
  if (SPEC.template === "button" || SPEC.template === "icon-button") {
    return createSimpleButtonVariant(variantSpec, fontName);
  }
  if (SPEC.template === "button-group") {
    return createButtonGroupVariant(variantSpec, fontName);
  }
  if (SPEC.template === "breadcrumbs") {
    return createBreadcrumbsVariant(variantSpec, fontName);
  }
  if (SPEC.template === "banner") {
    return createBannerVariant(variantSpec, fontName);
  }
  if (SPEC.template === "badge") {
    return createBadgeVariant(variantSpec, fontName);
  }
  if (SPEC.template === "nav-tab") {
    return createNavTabVariant(variantSpec, fontName);
  }
  const NEW_RENDERERS = {
    "kbd": createKbdVariant,
    "link": createLinkVariant,
    "list": createListVariant,
    "skeleton": createSkeletonVariant,
    "linear-progress": createLinearProgressVariant,
    "segmented-control": createSegmentedControlVariant,
    "radio-list": createRadioListVariant,
    "slider": createSliderVariant,
    "pagination": createPaginationVariant,
    "number-input": createNumberInputVariant,
    "selector": createSelectorVariant,
    "multi-selector": createMultiSelectorVariant,
    "popover": createPopoverVariant,
    "more-menu": createMoreMenuVariant,
    "lightbox": createLightboxVariant,
  };
  const renderer = NEW_RENDERERS[SPEC.template];
  if (renderer) {
    return renderer(variantSpec, fontName);
  }
  return createGenericVariant(variantSpec, fontName);
}

/* ─────────────────────────────────────────────
   신규 컴포넌트 전용 렌더러 (스펙 구조 반영)
   공통 헬퍼: hexToPaint, applyAutoLayout, createLabel
   ───────────────────────────────────────────── */

function frameBox(name, { layout, radius, fill, stroke, strokeWeight } = {}) {
  const node = figma.createFrame();
  node.name = name;
  if (layout) applyAutoLayout(node, layout);
  else {
    node.layoutMode = "HORIZONTAL";
    node.primaryAxisSizingMode = "AUTO";
    node.counterAxisSizingMode = "AUTO";
  }
  if (typeof radius === "number") node.cornerRadius = radius;
  node.fills = fill ? [hexToPaint(fill)] : [];
  if (stroke) { node.strokes = [hexToPaint(stroke)]; node.strokeWeight = strokeWeight || 1; }
  return node;
}

function txt(text, fontName, size, color) {
  const n = figma.createText();
  n.fontName = fontName;
  n.characters = String(text);
  n.fontSize = size || 13;
  n.fills = [hexToPaint(color || "#1F2023")];
  return n;
}

// Kbd — 키 배지
function createKbdVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.layout);
  c.cornerRadius = SPEC.component.radius;
  c.fills = [hexToPaint(SPEC.component.fill)];
  c.strokes = [hexToPaint(SPEC.component.stroke)];
  c.strokeWeight = SPEC.component.strokeWeight || 1;
  c.appendChild(txt(variantSpec.text || "⌘", fontName, SPEC.text.fontSize, SPEC.text.color));
  return c;
}

// Link — 텍스트 앵커 (+ 외부 아이콘)
function createLinkVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.layout);
  c.fills = [];
  const label = txt(variantSpec.text || "Link", fontName, SPEC.text.fontSize, SPEC.text.color);
  c.appendChild(label);
  if (variantSpec.isExternal && SPEC.icon) {
    const ico = figma.createFrame();
    ico.name = "external-icon";
    ico.resize(SPEC.icon.size, SPEC.icon.size);
    ico.fills = [hexToPaint(SPEC.icon.color)];
    ico.cornerRadius = 2;
    c.appendChild(ico);
  }
  return c;
}

// List — 항목 세로 스택
function createListVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.layout);
  c.fills = [];
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "FIXED";
  c.resize(320, Math.max(c.height, 1));
  const labels = ["첫 번째 항목", "두 번째 항목", "세 번째 항목"];
  labels.forEach((t, i) => {
    const item = frameBox("item", { layout: SPEC.item.layout });
    item.layoutAlign = "STRETCH";
    if (variantSpec.hasDividers && i > 0 && SPEC.component.divider) {
      item.strokes = [hexToPaint(SPEC.component.divider)];
      item.strokeWeight = 1;
      item.strokeTopWeight = 1;
      item.strokeBottomWeight = 0; item.strokeLeftWeight = 0; item.strokeRightWeight = 0;
    }
    const prefix = variantSpec.marker === "disc" ? "• " : variantSpec.marker === "decimal" ? (i + 1) + ". " : "";
    item.appendChild(txt(prefix + t, fontName, SPEC.item.label.fontSize, SPEC.item.label.color));
    c.appendChild(item);
  });
  return c;
}

// Skeleton — 시머 박스
function createSkeletonVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.fills = [hexToPaint(SPEC.component.fill)];
  const v = variantSpec.variant || "text";
  if (v === "circle") { c.resize(40, 40); c.cornerRadius = 9999; }
  else if (v === "rect") { c.resize(160, 90); c.cornerRadius = SPEC.radius.rect; }
  else { c.resize(200, 12); c.cornerRadius = SPEC.radius.text; }
  return c;
}

// LinearProgress — 트랙 + 채움
function createLinearProgressVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = "HORIZONTAL";
  c.primaryAxisSizingMode = "FIXED";
  c.counterAxisSizingMode = "FIXED";
  c.resize(240, SPEC.track.height);
  c.cornerRadius = SPEC.track.radius;
  c.fills = [hexToPaint(SPEC.track.fill)];
  c.clipsContent = true;
  const variant = variantSpec.variant || "accent";
  const pct = typeof variantSpec.value === "number" ? variantSpec.value / 100 : 0.4;
  const fill = figma.createFrame();
  fill.name = "fill";
  fill.resize(Math.max(240 * pct, 1), SPEC.track.height);
  fill.cornerRadius = SPEC.track.radius;
  fill.fills = [hexToPaint(SPEC.fillColor[variant] || SPEC.fillColor.accent)];
  c.appendChild(fill);
  return c;
}

// SegmentedControl — 세그먼트 버튼 그룹
function createSegmentedControlVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.container.layout);
  c.cornerRadius = SPEC.container.radius;
  c.fills = [hexToPaint(SPEC.container.fill)];
  ["일간", "주간", "월간"].forEach((t, i) => {
    const seg = frameBox("segment", { layout: SPEC.item.layout, radius: SPEC.item.radius });
    if (i === 0) { seg.fills = [hexToPaint(SPEC.item.selectedFill)]; }
    else seg.fills = [];
    seg.appendChild(txt(t, fontName, SPEC.item.label.fontSize, SPEC.item.label.color));
    c.appendChild(seg);
  });
  return c;
}

// RadioList — 라디오 항목
function createRadioListVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = variantSpec.orientation === "horizontal" ? "HORIZONTAL" : "VERTICAL";
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "AUTO";
  c.itemSpacing = 4;
  c.fills = [];
  const r = SPEC.item.radio;
  [["옵션 A", true], ["옵션 B", false]].forEach(([label, on]) => {
    const item = frameBox("item", { layout: SPEC.item.layout });
    const circle = figma.createEllipse();
    circle.resize(r.size, r.size);
    circle.fills = [];
    circle.strokes = [hexToPaint(on ? r.checkedStroke : r.uncheckedStroke)];
    circle.strokeWeight = r.strokeWeight;
    item.appendChild(circle);
    item.appendChild(txt(label, fontName, SPEC.item.label.fontSize, SPEC.item.label.color));
    c.appendChild(item);
  });
  return c;
}

// Slider — 트랙 + 채움 + thumb
function createSliderVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = "NONE";
  c.resize(240, SPEC.thumb.size);
  c.fills = [];
  const track = figma.createFrame();
  track.name = "track";
  track.resize(240, SPEC.track.height);
  track.y = (SPEC.thumb.size - SPEC.track.height) / 2;
  track.cornerRadius = 9999;
  track.fills = [hexToPaint(SPEC.track.fill)];
  c.appendChild(track);
  const status = variantSpec.status || "default";
  const fill = figma.createFrame();
  fill.name = "fill";
  fill.resize(156, SPEC.track.height);
  fill.y = track.y;
  fill.cornerRadius = 9999;
  fill.fills = [hexToPaint(SPEC.fillColor[status] || SPEC.fillColor.default)];
  c.appendChild(fill);
  const thumb = figma.createEllipse();
  thumb.name = "thumb";
  thumb.resize(SPEC.thumb.size, SPEC.thumb.size);
  thumb.x = 156 - SPEC.thumb.size / 2;
  thumb.fills = [hexToPaint(SPEC.thumb.fill)];
  thumb.strokes = [hexToPaint(SPEC.thumb.stroke)];
  thumb.strokeWeight = SPEC.thumb.strokeWeight;
  c.appendChild(thumb);
  return c;
}

// Pagination — 페이지 버튼 열 또는 점
function createPaginationVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.layout);
  c.fills = [];
  if (variantSpec.variant === "dots") {
    for (let i = 0; i < 4; i++) {
      const dot = figma.createEllipse();
      dot.resize(SPEC.dot.size, SPEC.dot.size);
      dot.fills = [hexToPaint(i === 0 ? SPEC.dot.activeFill : SPEC.dot.inactiveFill)];
      c.appendChild(dot);
    }
  } else {
    ["‹", "1", "2", "3", "›"].forEach((t, i) => {
      const btn = frameBox("page", { radius: SPEC.pageButton.radius });
      btn.resize(SPEC.pageButton.size, SPEC.pageButton.size);
      btn.primaryAxisAlignItems = "CENTER";
      btn.counterAxisAlignItems = "CENTER";
      btn.layoutMode = "HORIZONTAL";
      btn.fills = t === "1" ? [hexToPaint(SPEC.pageButton.currentFill)] : [];
      btn.appendChild(txt(t, fontName, SPEC.pageButton.font.fontSize, SPEC.pageButton.font.color));
      c.appendChild(btn);
    });
  }
  return c;
}

// NumberInput — 필드 + 단위 + 스텝퍼
function createNumberInputVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.field.layout);
  c.cornerRadius = SPEC.component.field.radius;
  c.fills = [];
  const status = variantSpec.status || "default";
  c.strokes = [hexToPaint(SPEC.statusStroke[status] || SPEC.statusStroke.default)];
  c.strokeWeight = SPEC.component.field.strokeWeight || 1;
  c.appendChild(txt("50", fontName, 14, SPEC.component.label.color));
  if (variantSpec.unit) c.appendChild(txt(variantSpec.unit, fontName, SPEC.component.unit.fontSize, SPEC.component.unit.color));
  c.appendChild(txt("▲▼", fontName, 10, SPEC.component.unit.color));
  return c;
}

// Selector — 트리거 (드롭다운 닫힌 상태)
function createSelectorVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.trigger.layout);
  c.cornerRadius = SPEC.trigger.radius;
  c.fills = [];
  const status = variantSpec.status || "default";
  c.strokes = [hexToPaint(SPEC.trigger.statusStroke[status] || SPEC.trigger.statusStroke.default)];
  c.strokeWeight = SPEC.trigger.strokeWeight || 1;
  c.counterAxisSizingMode = "FIXED";
  c.resize(220, c.height);
  c.primaryAxisAlignItems = "SPACE_BETWEEN";
  c.appendChild(txt("항목 선택", fontName, SPEC.option.label.fontSize, SPEC.option.label.color));
  c.appendChild(txt("▾", fontName, 12, SPEC.option.label.color));
  return c;
}

// MultiSelector — 트리거 (badges 또는 count)
function createMultiSelectorVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.trigger.layout);
  c.cornerRadius = SPEC.trigger.radius;
  c.fills = [];
  c.strokes = [hexToPaint(SPEC.trigger.stroke)];
  c.strokeWeight = SPEC.trigger.strokeWeight || 1;
  c.counterAxisSizingMode = "FIXED";
  c.resize(240, c.height);
  c.primaryAxisAlignItems = "SPACE_BETWEEN";
  if (variantSpec.display === "badges") {
    const wrap = frameBox("badges", {});
    wrap.itemSpacing = 4;
    ["서울", "부산"].forEach((t) => {
      const b = frameBox("badge", { radius: SPEC.badge.radius, fill: SPEC.badge.fill });
      b.paddingLeft = 8; b.paddingRight = 8; b.paddingTop = 2; b.paddingBottom = 2;
      b.appendChild(txt(t, fontName, 11, SPEC.option.label.color));
      wrap.appendChild(b);
    });
    c.appendChild(wrap);
  } else {
    c.appendChild(txt("3개 선택", fontName, SPEC.option.label.fontSize, SPEC.option.label.color));
  }
  c.appendChild(txt("▾", fontName, 12, SPEC.option.label.color));
  return c;
}

// Popover — 패널
function createPopoverVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.panel.layout);
  c.cornerRadius = SPEC.panel.radius;
  c.fills = [hexToPaint(SPEC.panel.fill)];
  c.strokes = [hexToPaint(SPEC.panel.stroke)];
  c.strokeWeight = SPEC.panel.strokeWeight || 1;
  c.appendChild(txt("팝오버 콘텐츠", fontName, 13, "#1F2023"));
  return c;
}

// MoreMenu — 메뉴 패널
function createMoreMenuVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.menu.layout);
  c.cornerRadius = SPEC.menu.radius;
  c.fills = [hexToPaint(SPEC.menu.fill)];
  c.strokes = [hexToPaint(SPEC.menu.stroke)];
  c.strokeWeight = SPEC.menu.strokeWeight || 1;
  c.counterAxisSizingMode = "FIXED";
  c.resize(180, c.height);
  ["편집", "복제", "삭제"].forEach((t) => {
    const item = frameBox("item", { layout: SPEC.item.layout });
    item.layoutAlign = "STRETCH";
    const color = t === "삭제" ? SPEC.item.dangerColor : SPEC.item.label.color;
    item.appendChild(txt(t, fontName, SPEC.item.label.fontSize, color));
    c.appendChild(item);
  });
  return c;
}

// Lightbox — 풀스크린 미디어 오버레이 (축소 표현)
function createLightboxVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = "HORIZONTAL";
  c.primaryAxisSizingMode = "FIXED";
  c.counterAxisSizingMode = "FIXED";
  c.resize(360, 240);
  c.primaryAxisAlignItems = "CENTER";
  c.counterAxisAlignItems = "CENTER";
  c.cornerRadius = SPEC.component.radius || 16;
  c.fills = [hexToPaint(SPEC.component.backdrop || "#00000085")];
  c.appendChild(txt(variantSpec.itemType === "video" ? "▶ 비디오" : "이미지", fontName, 14, "#FFFFFF"));
  return c;
}

// 신규 컴포넌트용 fallback 렌더러.
// template별 전용 렌더가 없을 때, 스펙의 공통 형태 키(component/panel/track/
// trigger/container/item/field)에서 layout·fill·radius·stroke를 읽어 대략적 박스를 그린다.
// 세부 디테일은 Figma에서 디자이너가 다듬는다.
function createGenericVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name || SPEC.name || SPEC.template;

  // 형태 정보를 담을 만한 최상위 키를 우선순위대로 탐색
  const shapeKeys = ["component", "panel", "track", "trigger", "container", "field", "item"];
  let shape = null;
  for (const key of shapeKeys) {
    if (SPEC[key] && typeof SPEC[key] === "object") { shape = SPEC[key]; break; }
  }

  if (shape && shape.layout) {
    applyAutoLayout(component, shape.layout);
  } else {
    component.layoutMode = "HORIZONTAL";
    component.primaryAxisSizingMode = "AUTO";
    component.counterAxisSizingMode = "AUTO";
    component.paddingTop = 8; component.paddingBottom = 8;
    component.paddingLeft = 12; component.paddingRight = 12;
    component.itemSpacing = 4;
  }

  if (shape && typeof shape.radius === "number") component.cornerRadius = shape.radius;
  else component.cornerRadius = 8;

  if (shape && shape.fill) component.fills = [hexToPaint(shape.fill)];
  else component.fills = [];

  if (shape && shape.stroke) {
    component.strokes = [hexToPaint(shape.stroke)];
    component.strokeWeight = shape.strokeWeight || 1;
  }

  // 라벨: 컴포넌트 이름을 placeholder 텍스트로 넣어 빈 박스가 아니게 함
  const labelStyle = {
    fontSize: 13,
    lineHeight: 20,
    color: (SPEC.text && SPEC.text.color) || (SPEC.label && SPEC.label.color) || "#1F2023",
  };
  component.appendChild(createLabel(SPEC.name || SPEC.template, fontName, labelStyle));

  // 최소 크기 보장
  if (component.width < 24 || component.height < 16) {
    component.resize(Math.max(component.width, 120), Math.max(component.height, 32));
  }
  return component;
}

async function getOrCreatePage(name) {
  if (figma.loadAllPagesAsync) {
    await figma.loadAllPagesAsync();
  }

  const existing = figma.root.children.find((page) => page.name === name);
  if (existing) {
    return existing;
  }

  const page = figma.createPage();
  page.name = name;
  return page;
}

async function generateSpec(componentSpec, generatedPage, originX, originY) {
  SPEC = componentSpec;
  const fontName = await loadFont(SPEC.text?.fontStyle === "Medium" ? "Medium" : "Regular");

  const components = SPEC.variants.map((variant, index) => {
    const component = createVariant(variant, fontName);
    component.x = originX;
    component.y = originY + index * (SPEC.preview?.stepY || SPEC.component?.height || SPEC.component?.minHeight || 120);
    generatedPage.appendChild(component);
    return component;
  });

  if (components.length > 1) {
    const set = figma.combineAsVariants(components, generatedPage);
    set.name = SPEC.name;
    set.x = originX;
    set.y = originY;
    return set;
  } else {
    return components[0];
  }
}

async function generateSelected(ids) {
  const selectedSpecs = SPECS.filter((spec) => ids.includes(spec.id));
  if (selectedSpecs.length === 0) {
    figma.notify("Select at least one component.", { error: true });
    return;
  }

  const generatedPage = await getOrCreatePage("Generated");
  await getOrCreatePage("Published");
  await figma.setCurrentPageAsync(generatedPage);

  const generatedNodes = [];
  const failed = [];
  for (let index = 0; index < selectedSpecs.length; index += 1) {
    const column = index % 2;
    const row = Math.floor(index / 2);
    try {
      const node = await generateSpec(selectedSpecs[index], generatedPage, 80 + column * 760, 80 + row * 560);
      generatedNodes.push(node);
    } catch (error) {
      // 한 컴포넌트가 실패해도 나머지는 계속 생성. 실패 이름 + 사유를 모은다.
      failed.push(selectedSpecs[index].name + " (" + error.message + ")");
      console.error("Failed to generate " + selectedSpecs[index].id + ":", error);
    }
  }

  if (generatedNodes.length > 0) {
    figma.viewport.scrollAndZoomIntoView(generatedNodes);
  }
  if (failed.length > 0) {
    figma.notify("생성 실패 " + failed.length + "개: " + failed.join(" / "), { error: true, timeout: 10000 });
  } else {
    figma.notify("Generated " + generatedNodes.length + " component set(s).");
  }
  figma.closePlugin();
}

figma.showUI(__html__, { width: 360, height: 520, themeColors: true });
figma.ui.postMessage({
  type: "init",
  components: SPECS.map((spec) => ({
    id: spec.id,
    name: spec.name,
    description: spec.description || "",
    variantCount: spec.variants?.length || 0,
  })),
});

figma.ui.onmessage = (message) => {
  if (message.type === "cancel") {
    figma.closePlugin();
    return;
  }

  if (message.type === "generate") {
    generateSelected(message.ids || []).catch((error) => {
      figma.notify("Component generation failed: " + error.message, { error: true });
      figma.closePlugin();
    });
  }
};
`;
}

fs.mkdirSync(TOOL_DIR, { recursive: true });
fs.writeFileSync(path.join(TOOL_DIR, 'code.js'), renderPluginCode(specs));
console.log(`Generated tools/figma-component-generator/code.js with ${specs.length} component spec(s).`);
