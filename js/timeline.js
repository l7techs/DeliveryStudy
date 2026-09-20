// ============ Timeline / Gantt loader (reads the MS Project XML live) ============

let timelineTasks = null;
let ganttHoursPerDay = 8; // overwritten from the file's own <MinutesPerDay> on load — never assume a fixed calendar

function parseIsoDuration(iso) {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const s = parseInt(m[3] || "0", 10);
  return h + min / 60 + s / 3600;
}

function formatDurationDays(hours) {
  let days = hours / ganttHoursPerDay;
  days = Math.round(days * 8) / 8; // nearest eighth of a day (preserves values like 4.625)
  if (Math.abs(days - Math.round(days)) < 0.01) days = Math.round(days);
  return days;
}

function parseTaskDate(s) {
  if (!s) return null;
  return new Date(s);
}

function fmtDate(d) {
  if (!d) return "—";
  return d.toLocaleDateString(currentLang === "ar" ? "ar-SY" : "en-US", { year: "numeric", month: "short", day: "numeric" });
}

function xmlText(el, tag) {
  const nodes = el.getElementsByTagName(tag);
  return nodes.length ? nodes[0].textContent : null;
}

async function loadTimelineData() {
  const statusEl = document.getElementById("timelineStatus");
  try {
    const res = await fetch("data/Delivery-Launch-Plan.xml");
    if (!res.ok) throw new Error("fetch failed: " + res.status);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    if (doc.getElementsByTagName("parsererror").length) throw new Error("XML parse error");

    const minutesPerDayNodes = doc.getElementsByTagName("MinutesPerDay");
    if (minutesPerDayNodes.length) {
      const mpd = parseInt(minutesPerDayNodes[0].textContent, 10);
      if (mpd > 0) ganttHoursPerDay = mpd / 60;
    }

    const taskEls = Array.from(doc.getElementsByTagName("Task"));
    const tasks = taskEls.map(el => {
      const uid = parseInt(xmlText(el, "UID"), 10);
      const outlineLevel = parseInt(xmlText(el, "OutlineLevel") || "0", 10);
      const summary = xmlText(el, "Summary") === "1";
      const milestone = xmlText(el, "Milestone") === "1";
      const durHours = parseIsoDuration(xmlText(el, "Duration"));
      const preds = Array.from(el.getElementsByTagName("PredecessorLink")).map(p => xmlText(p, "PredecessorUID"));
      return {
        uid,
        id: xmlText(el, "ID"),
        name: (xmlText(el, "Name") || "").trim(),
        outlineLevel,
        summary,
        milestone,
        start: parseTaskDate(xmlText(el, "Start")),
        finish: parseTaskDate(xmlText(el, "Finish")),
        durationDays: formatDurationDays(durHours),
        preds
      };
    }).filter(t => t.uid !== 0); // drop the root project-summary row

    if (!tasks.length) throw new Error("no tasks found");

    timelineTasks = tasks;
    renderTimelineStats(tasks);
    renderGantt(tasks);

    document.getElementById("timelineContent").hidden = false;
    document.getElementById("timelineError").hidden = true;
    statusEl.classList.remove("error");
    statusEl.innerHTML = `<span class="live-dot"></span><span data-i18n="timelineLoaded">${t("timelineLoaded")}</span>`;
  } catch (err) {
    console.error("Timeline load failed:", err);
    document.getElementById("timelineContent").hidden = true;
    document.getElementById("timelineError").hidden = false;
    statusEl.classList.add("error");
  }
}

function renderTimelineStats(tasks) {
  const minStart = tasks.reduce((min, t) => (t.start && (!min || t.start < min) ? t.start : min), null);
  const maxFinish = tasks.reduce((max, t) => (t.finish && (!max || t.finish > max) ? t.finish : max), null);
  const launchTask = tasks.find(t => t.milestone && /commercial launch/i.test(t.name)) || null;
  const workingDaysTotal = tasks.filter(t => t.outlineLevel === 1 && t.summary).reduce((sum, t) => sum + t.durationDays, 0);
  const phaseCount = tasks.filter(t => t.outlineLevel === 1 && t.summary).length;

  const stats = [
    { label: t("statStartDate"), value: fmtDate(minStart) },
    { label: t("statLaunchDate"), value: fmtDate(launchTask ? launchTask.finish : maxFinish) },
    { label: t("statTotalDays"), value: Math.round(workingDaysTotal) + " " + t("ganttDays") },
    { label: t("statPhases"), value: phaseCount }
  ];

  const grid = document.getElementById("timelineStats");
  grid.innerHTML = stats.map(s => `
    <div class="stat-card">
      <span class="stat-value">${s.value}</span>
      <span class="stat-label">${s.label}</span>
    </div>
  `).join("");
}

function renderGantt(tasks) {
  const minStart = tasks.reduce((min, t) => (t.start && (!min || t.start < min) ? t.start : min), null);
  const maxFinish = tasks.reduce((max, t) => (t.finish && (!max || t.finish > max) ? t.finish : max), null);
  const totalMs = maxFinish - minStart;

  const pct = (d) => ((d - minStart) / totalMs) * 100;

  // Month gridlines/labels
  const scaleEl = document.getElementById("ganttScale");
  const months = [];
  let cursor = new Date(minStart.getFullYear(), minStart.getMonth(), 1);
  while (cursor <= maxFinish) {
    months.push(new Date(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  const monthsHtml = months.map(m => {
    const left = Math.max(0, pct(m));
    const label = m.toLocaleDateString(currentLang === "ar" ? "ar-SY" : "en-US", { year: "numeric", month: "short" });
    return `<div class="gantt-month" style="left:${left}%"><span>${label}</span></div>`;
  }).join("");
  scaleEl.innerHTML = `<div class="gantt-scale-spacer"></div><div class="gantt-scale-track">${monthsHtml}</div>`;

  const rowsEl = document.getElementById("ganttRows");
  rowsEl.innerHTML = tasks.map(task => {
    const left = pct(task.start).toFixed(3);
    const rawWidth = ((task.finish - task.start) / totalMs) * 100;
    const width = Math.max(rawWidth, 0.3).toFixed(3);
    const indent = (task.outlineLevel - 1) * 18;
    const rowClass = task.summary ? "gantt-row phase" : task.milestone ? "gantt-row milestone-row" : "gantt-row";
    const nameClass = task.summary ? "gantt-name phase-name" : "gantt-name";

    let barHtml;
    if (task.milestone) {
      barHtml = `<div class="gantt-milestone" style="left:${left}%" title="${escapeHtml(task.name)} — ${fmtDate(task.start)}"></div>`;
    } else {
      const barClass = task.summary ? "gantt-bar phase-bar" : "gantt-bar";
      barHtml = `<div class="${barClass}" style="left:${left}%; width:${width}%" title="${escapeHtml(task.name)} — ${fmtDate(task.start)} → ${fmtDate(task.finish)} (${task.durationDays} ${t("ganttDays")})"></div>`;
    }

    return `
      <div class="${rowClass}">
        <div class="${nameClass}" style="padding-inline-start:${indent}px">${escapeHtml(task.name)}</div>
        <div class="gantt-dates">${fmtDate(task.start)} → ${fmtDate(task.finish)}</div>
        <div class="gantt-dur">${task.milestone ? "—" : task.durationDays}</div>
        <div class="gantt-track">${barHtml}</div>
      </div>
    `;
  }).join("");
}

function escapeHtml(s) {
  return (s || "").replace(/&amp;/g, "&").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

document.addEventListener("DOMContentLoaded", loadTimelineData);
document.addEventListener("langChanged", () => {
  if (timelineTasks) {
    renderTimelineStats(timelineTasks);
    renderGantt(timelineTasks);
  }
});
