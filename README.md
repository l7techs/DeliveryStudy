# Delivery App Launch Study — Syria

A bilingual (Arabic/English) website presenting the licensing requirements and financial feasibility study for launching a delivery-app business in Syria.

- **Registration & Licensing** — step-by-step checklist (with done/date tracking, saved in your browser) for the two regulatory tracks: the SyTRA delivery-platform license and the electronic app accreditation.
- **Financial Study** — key assumptions, 5-year revenue/profit projections, and a 60-month cash flow chart, all read **live** from [`data/Delivery.xlsx`](data/Delivery.xlsx) in the browser. Update the spreadsheet, push it, and the page reflects the new numbers on next load.

## Live site

Published via GitHub Pages from the `main` branch.

## Updating the numbers

1. Edit `data/Delivery.xlsx` locally (the `Main` and `Cash FLow` sheets).
2. Replace the file in this repo and push:
   ```bash
   git add data/Delivery.xlsx
   git commit -m "Update financial model"
   git push
   ```
3. Reload the site — the Financial Study section re-reads the file directly (no rebuild step needed).

## Local development

Because the page fetches the `.xlsx` file via `fetch()`, it must be served over HTTP (not opened as a local `file://` path). Any static server works, e.g.:

```bash
npx http-server . -p 8080
```

---

*This study is for guidance only and is based on regulations issued by the Syrian Telecommunications & Post Regulatory Authority (SyTRA). Consult an accountant and legal advisor before making a final decision.*
