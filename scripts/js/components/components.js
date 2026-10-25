
/** FNF sayfasının HTML bileşenleri. */

export function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

export function renderMeta(meta = []) {
  if (!meta.length) return "";

  return `<ul class="mod-meta">${meta.map((item) => `
    <li>
      <i class="${escapeHTML(item.icon)}" aria-hidden="true"></i>
      ${escapeHTML(item.text)}
    </li>
  `).join("")}</ul>`;
}

export function renderFeatures(features = []) {
  if (!features.length) return "";

  return `<div class="feature-grid">${features.map((feature) => `
    <div class="feature-item">
      <i class="${escapeHTML(feature.icon)}" aria-hidden="true"></i>
      <div>
        <strong>${escapeHTML(feature.title)}</strong>
        <span>${escapeHTML(feature.desc)}</span>
      </div>
    </div>
  `).join("")}</div>`;
}

export function renderEvents(events = []) {
  if (!events.length) return "";

  return `
    <div class="event-list">
      <div class="event-list-header">
        <i class="fa-solid fa-scroll" aria-hidden="true"></i>
        <span>Özel Eventler</span>
      </div>
      <ul>
        ${events.map((event) => `
          <li>
            <i class="fa-solid fa-file-code" aria-hidden="true"></i>
            ${escapeHTML(event)}
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

export function renderInfo(info) {
  if (!info) return "";

  return `
    <div class="engine-info" role="note">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
      <span>${escapeHTML(info)}</span>
    </div>
  `;
}

export function renderNote(note) {
  if (!note) return "";

  return `
    <div class="engine-note">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      <span>${escapeHTML(note)}</span>
    </div>
  `;
}

export function renderWarn(warn) {
  if (!warn) return "";

  return `
    <div class="engine-warn">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      <span>${warn}</span>
    </div>
  `;
}

export function renderProgress(progress) {
  if (!Number.isFinite(progress)) return "";

  const value = Math.max(0, Math.min(100, progress));

  return `
    <div class="progress" style="--progress:${value}%">
      <div class="progress-label">
        <span>Geliştirme Durumu</span>
        <span>%${value}</span>
      </div>
      <div class="progress-bar">
        <i></i>
      </div>
    </div>
  `;
}

export function renderTags(tags = []) {
  if (!tags.length) return "";

  return `
    <div class="tags">
      ${tags.map((tag) => `
        <span>${escapeHTML(tag)}</span>
      `).join("")}
    </div>
  `;
}

export function renderSingleButton(button) {
  const variant = escapeHTML(button.variant || "primary");
  const classes = `mod-btn mod-btn-${variant}`;

  const icon = button.icon
    ? `<i class="${escapeHTML(button.icon)}" aria-hidden="true"></i> `
    : "";

  if (button.disabled) {
    return `
      <button
        type="button"
        class="${classes} is-disabled"
        aria-disabled="true"
        data-reason="${escapeHTML(
          button.reason || "Bu bağlantı henüz kullanılamıyor."
        )}"
      >
        ${icon}
        <span>${escapeHTML(button.label)}</span>
      </button>
    `;
  }

  const url = typeof button.url === "string" ? button.url : "#";

  const external = /^https?:\/\//i.test(url)
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";

  return `
    <a href="${escapeHTML(url)}" class="${classes}"${external}>
      ${icon}
      <span>${escapeHTML(button.label)}</span>
    </a>
  `;
}

export function renderActions(mod) {
  const buttons = (mod.buttons || [])
    .map(renderSingleButton)
    .join("");

  const detail = mod.details
    ? `
      <button
        type="button"
        class="mod-btn mod-btn-detail"
        data-detail="${escapeHTML(mod.id)}"
      >
        <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
        <span>Detay</span>
      </button>
    `
    : "";

  return `<div class="card-actions">${buttons}${detail}</div>`;
}

export function renderCard(mod, statusLabels = {}) {
  return `
    <article
      class="fnf-card"
      data-status="${escapeHTML(mod.status)}"
      data-id="${escapeHTML(mod.id)}"
    >
      <div class="card-cover">
        <span class="status-badge">
          <i class="fa-solid fa-circle" aria-hidden="true"></i>
          ${escapeHTML(statusLabels[mod.status] || mod.status)}
        </span>

        ${
          mod.version
            ? `<span class="version-badge">${escapeHTML(mod.version)}</span>`
            : ""
        }

        <div class="cover-icon">
          <i class="${escapeHTML(mod.icon)}" aria-hidden="true"></i>
        </div>
      </div>

      <div class="card-body">
        <h3>
          <i class="${escapeHTML(mod.icon)}" aria-hidden="true"></i>
          ${escapeHTML(mod.name)}
        </h3>

        <p>${escapeHTML(mod.tagline)}</p>

        ${renderMeta(mod.meta)}
        ${renderFeatures(mod.features)}
        ${renderEvents(mod.events)}
        ${renderNote(mod.note)}
        ${renderWarn(mod.warning)}
        ${renderInfo(mod.info)}
        ${renderProgress(mod.progress)}
        ${renderTags(mod.tags)}
        ${renderActions(mod)}
      </div>
    </article>
  `;
}
