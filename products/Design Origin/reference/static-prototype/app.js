const data = window.SYSTEM_VISUALIZER_DATA;

const metricGrid = document.querySelector("#metricGrid");
const automationStrip = document.querySelector("#automationStrip");
const foundationList = document.querySelector("#foundationList");
const foundationDetail = document.querySelector("#foundationDetail");
const componentGrid = document.querySelector("#componentGrid");
const guidelineBoard = document.querySelector("#guidelineBoard");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderMetrics() {
  if (!metricGrid) return;
  metricGrid.innerHTML = "";
  data.metrics.forEach((metric) => {
    const card = el("article", "metric-card");
    card.append(el("span", "metric-label", metric.label));
    card.append(el("strong", "metric-value", String(metric.value).padStart(2, "0")));
    card.append(el("p", "metric-caption", metric.caption));
    metricGrid.append(card);
  });
}

function renderAutomation() {
  if (!automationStrip) return;
  automationStrip.innerHTML = "";
  data.repo.automation.forEach((item) => {
    const card = el("article", "automation-card");
    const status = el("span", `status-pill ${item.status}`, item.status);
    card.append(status);
    card.append(el("h3", "", item.label));
    card.append(el("p", "", item.detail));
    card.append(el("code", "", item.source));
    automationStrip.append(card);
  });
}

function renderFoundationDetail(index) {
  if (!foundationList || !foundationDetail) return;
  const item = data.foundation[index];
  foundationDetail.innerHTML = "";
  foundationDetail.append(el("p", "panel-kicker", item.path));
  foundationDetail.append(el("h3", "", item.name));
  foundationDetail.append(el("p", "panel-copy", item.overview));

  const tokenGrid = el("div", "token-grid");
  item.tokens.forEach((token) => {
    const row = el("div", "token-row");
    const swatch = el("span", "token-swatch");
    if (token.type === "color") swatch.style.background = token.value;
    row.append(swatch);
    const meta = el("div", "token-meta");
    meta.append(el("strong", "", token.name));
    meta.append(el("span", "", token.value));
    row.append(meta);
    row.append(el("em", "", token.type));
    tokenGrid.append(row);
  });

  foundationDetail.append(tokenGrid);

  Array.from(foundationList.children).forEach((button, buttonIndex) => {
    button.setAttribute("aria-selected", String(buttonIndex === index));
  });
}

function renderFoundation() {
  if (!foundationList || !foundationDetail) return;
  foundationList.innerHTML = "";
  data.foundation.forEach((item, index) => {
    const button = el("button", "doc-button");
    button.type = "button";
    button.setAttribute("role", "tab");
    button.innerHTML = `<span>${item.name}</span><small>${item.path}</small>`;
    button.addEventListener("click", () => renderFoundationDetail(index));
    foundationList.append(button);
  });
  renderFoundationDetail(0);
}

function renderComponents() {
  if (!componentGrid) return;
  componentGrid.innerHTML = "";
  data.components.forEach((component) => {
    const card = el("article", "component-card");
    const head = el("div", "component-head");
    head.append(el("h3", "", component.name));
    head.append(el("span", "status-pill documented", component.status));
    card.append(head);
    card.append(el("p", "component-overview", component.overview));

    const paths = el("div", "path-pair");
    paths.append(el("code", "", component.md));
    paths.append(el("code", "", component.code));
    card.append(paths);

    const table = el("table", "property-table");
    table.innerHTML = "<thead><tr><th>Property</th><th>Type</th><th>Default</th></tr></thead>";
    const tbody = el("tbody");
    component.properties.forEach((property) => {
      const row = el("tr");
      row.append(el("td", "", property.name));
      row.append(el("td", "", property.type));
      row.append(el("td", "", property.default));
      tbody.append(row);
    });
    table.append(tbody);
    card.append(table);
    componentGrid.append(card);
  });
}

function renderGuidelines() {
  if (!guidelineBoard) return;
  guidelineBoard.innerHTML = "";
  data.guidelines.forEach((item) => {
    const card = el("article", `guideline-card ${item.status}`);
    card.append(el("span", "status-pill", item.status));
    card.append(el("h3", "", item.name));
    card.append(el("p", "guideline-signal", item.signal));
    card.append(el("p", "guideline-next", item.next));
    guidelineBoard.append(card);
  });
}

renderMetrics();
renderAutomation();
renderFoundation();
renderComponents();
renderGuidelines();
