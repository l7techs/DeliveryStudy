// ============ Financial data loader (reads Delivery.xlsx live via SheetJS) ============

let financialData = null;
let revenueChartInstance = null;
let cashFlowChartInstance = null;

function fmtUSD(value) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function fmtNum(value) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function fmtPct(value) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return (value * 100).toFixed(0) + "%";
}

function cellVal(sheet, addr) {
  const c = sheet[addr];
  return c ? c.v : null;
}

async function loadFinancialData() {
  const statusEl = document.getElementById("liveStatus");
  try {
    const res = await fetch("data/Delivery.xlsx");
    if (!res.ok) throw new Error("fetch failed: " + res.status);
    const buf = await res.arrayBuffer();
    const workbook = XLSX.read(buf, { type: "array" });

    const mainSheetName = workbook.SheetNames.find(n => n.trim().toLowerCase() === "main") || workbook.SheetNames[0];
    const cashSheetName = workbook.SheetNames.find(n => n.trim().toLowerCase().replace(/\s+/g, " ") === "cash flow")
      || workbook.SheetNames.find(n => n.toLowerCase().includes("cash"))
      || workbook.SheetNames[1];

    const main = workbook.Sheets[mainSheetName];
    const cash = cashSheetName ? workbook.Sheets[cashSheetName] : null;

    const years = ["L", "M", "N", "O", "P"];

    const assumptions = {
      commission: cellVal(main, "D7"),
      deliveryFee: cellVal(main, "D8"),
      orderValue: cellVal(main, "D9"),
      ordersPerRider: cellVal(main, "D10")
    };

    const yearly = years.map((col, idx) => ({
      year: idx + 1,
      riders: cellVal(main, col + "7"),
      locations: cellVal(main, col + "3"),
      revenue: cellVal(main, col + "15"),
      profit: cellVal(main, col + "62"),
      sytraShare: cellVal(main, col + "5")
    }));

    const initialInvestment = cellVal(main, "E28") ?? cellVal(main, "D28");

    let cashFlowMonths = [];
    if (cash) {
      for (let row = 9; row <= 68; row++) {
        const month = cellVal(cash, "A" + row);
        const ending = cellVal(cash, "N" + row);
        if (month !== null && ending !== null) {
          cashFlowMonths.push({ month, ending });
        }
      }
    }

    financialData = { assumptions, yearly, initialInvestment, cashFlowMonths };

    statusEl.classList.remove("error");
    statusEl.innerHTML = `<span class="live-dot"></span><span data-i18n="liveLoaded">${t("liveLoaded")}</span>`;
    document.getElementById("finContent").hidden = false;
    document.getElementById("finError").hidden = true;

    renderFinancial();
  } catch (err) {
    console.error("Failed to load financial data:", err);
    statusEl.classList.add("error");
    statusEl.innerHTML = `<span class="live-dot"></span><span data-i18n="finErrorMsg">${t("finErrorMsg")}</span>`;
    document.getElementById("finError").hidden = false;
    document.getElementById("finContent").hidden = true;
  }
}

function renderFinancial() {
  if (!financialData) return;
  renderAssumptionStats();
  renderInitialInvestment();
  renderYearlyTable();
  renderSytraTable();
  renderRevenueChart();
  renderCashFlowChart();
}

function renderAssumptionStats() {
  const { assumptions } = financialData;
  const el = document.getElementById("assumptionStats");
  el.innerHTML = `
    <div class="stat-card">
      <span class="stat-value">${fmtPct(assumptions.commission)}</span>
      <span class="stat-label">${t("statCommission")}</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${fmtNum(assumptions.deliveryFee)} SYP</span>
      <span class="stat-label">${t("statDeliveryFee")}</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${fmtUSD(assumptions.orderValue)}</span>
      <span class="stat-label">${t("statOrderValue")}</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${fmtNum(assumptions.ordersPerRider)}</span>
      <span class="stat-label">${t("statOrdersPerRider")}</span>
    </div>
  `;
}

function renderInitialInvestment() {
  document.getElementById("initialInvestment").textContent = fmtUSD(financialData.initialInvestment);
}

function renderYearlyTable() {
  const table = document.getElementById("yearlyTable");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  thead.innerHTML = `<tr>
    <th>${t("tableYear")}</th>
    <th>${t("tableRiders")}</th>
    <th>${t("tableLocations")}</th>
    <th>${t("tableRevenue")}</th>
    <th>${t("tableProfit")}</th>
  </tr>`;

  tbody.innerHTML = financialData.yearly.map(y => `
    <tr>
      <td>${t("tableYear")} ${y.year}</td>
      <td>${fmtNum(y.riders)}</td>
      <td>${fmtNum(y.locations)}</td>
      <td>${fmtUSD(y.revenue)}</td>
      <td>${fmtUSD(y.profit)}</td>
    </tr>
  `).join("");
}

function renderSytraTable() {
  const table = document.getElementById("sytraTable");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  thead.innerHTML = `<tr><th>${t("sytraYear")}</th><th>${t("sytraShare")}</th></tr>`;
  tbody.innerHTML = financialData.yearly.map(y => `
    <tr><td>${t("tableYear")} ${y.year}</td><td>${fmtPct(y.sytraShare)}</td></tr>
  `).join("");
}

function renderRevenueChart() {
  const ctx = document.getElementById("revenueChart");
  const labels = financialData.yearly.map(y => `${t("tableYear")} ${y.year}`);
  const revenueData = financialData.yearly.map(y => y.revenue);
  const profitData = financialData.yearly.map(y => y.profit);

  if (revenueChartInstance) revenueChartInstance.destroy();

  revenueChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: t("tableRevenue"),
          data: revenueData,
          backgroundColor: "#0f4c81",
          borderRadius: 6
        },
        {
          label: t("tableProfit"),
          data: profitData,
          backgroundColor: "#f97316",
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 12, weight: "600" } } },
        tooltip: {
          callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmtUSD(ctx.parsed.y)}` }
        }
      },
      scales: {
        y: { ticks: { callback: (v) => fmtUSD(v) } }
      }
    }
  });
}

function renderCashFlowChart() {
  const ctx = document.getElementById("cashFlowChart");
  const months = financialData.cashFlowMonths;
  if (!months.length) return;

  const labels = months.map(m => m.month);
  const data = months.map(m => m.ending);

  if (cashFlowChartInstance) cashFlowChartInstance.destroy();

  cashFlowChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: t("chartCashHeading"),
        data,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.12)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx) => fmtUSD(ctx.parsed.y) }
        }
      },
      scales: {
        y: { ticks: { callback: (v) => fmtUSD(v) } },
        x: { ticks: { maxTicksLimit: 12 } }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", loadFinancialData);
document.addEventListener("langChanged", () => {
  if (financialData) renderFinancial();
});
