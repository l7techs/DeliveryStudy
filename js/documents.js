// ============ Documents tab (lists whatever is in data/documents/ on GitHub) ============

const DOCS_REPO = "l7techs/DeliveryStudy";
const DOCS_PATH = "data/documents";

let documentsCache = null;

function fmtFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function fileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  const icons = {
    pdf: "📕", doc: "📘", docx: "📘", xls: "📗", xlsx: "📗",
    ppt: "📙", pptx: "📙", zip: "🗜️", png: "🖼️", jpg: "🖼️", jpeg: "🖼️",
    xml: "🗂️", txt: "📄"
  };
  return icons[ext] || "📄";
}

async function loadDocuments() {
  const statusEl = document.getElementById("documentsStatus");
  const listEl = document.getElementById("documentsList");
  const emptyEl = document.getElementById("documentsEmpty");
  const errorEl = document.getElementById("documentsError");

  try {
    const res = await fetch(`https://api.github.com/repos/${DOCS_REPO}/contents/${DOCS_PATH}`);
    if (!res.ok) throw new Error("fetch failed: " + res.status);
    const items = await res.json();

    const files = items
      .filter(item => item.type === "file")
      .sort((a, b) => a.name.localeCompare(b.name));

    documentsCache = files;
    renderDocuments(files);

    statusEl.innerHTML = `<span class="live-dot"></span><span data-i18n="documentsLoaded">${t("documentsLoaded")}</span>`;
    errorEl.hidden = true;

    if (files.length) {
      listEl.hidden = false;
      emptyEl.hidden = true;
    } else {
      listEl.hidden = true;
      emptyEl.hidden = false;
    }
  } catch (err) {
    console.error("Documents load failed:", err);
    statusEl.classList.add("error");
    listEl.hidden = true;
    emptyEl.hidden = true;
    errorEl.hidden = false;
  }
}

function renderDocuments(files) {
  const listEl = document.getElementById("documentsList");
  listEl.innerHTML = files.map(file => `
    <div class="doc-card">
      <span class="doc-icon">${fileIcon(file.name)}</span>
      <div class="doc-info">
        <span class="doc-name">${escapeHtml(file.name)}</span>
        <span class="doc-size">${fmtFileSize(file.size)}</span>
      </div>
      <a class="btn-download doc-download" href="${DOCS_PATH}/${encodeURIComponent(file.name)}" download>
        <span data-i18n="downloadLabel">${t("downloadLabel")}</span> ⬇
      </a>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", loadDocuments);
document.addEventListener("langChanged", () => {
  if (documentsCache) renderDocuments(documentsCache);
});
