// ============ Tab switching ============
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");

      // Chart.js can't measure a canvas while its panel is display:none,
      // so charts created while hidden end up with zero size. Re-render
      // them now that the Financial panel is actually visible.
      if (btn.dataset.tab === "financial" && typeof financialData !== "undefined" && financialData) {
        renderRevenueChart();
        renderCashFlowChart();
      }
    });
  });
});
