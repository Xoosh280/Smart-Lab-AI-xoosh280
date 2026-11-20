# SMART LAB AI

Responsive biomedical engineering and hospital equipment management frontend built with React and Vite.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). To create and preview a production build:

```bash
npm run build
npm run preview
```

## Included modules

- Responsive biomedical operations dashboard
- Laboratory, hospital, and medical imaging equipment inventories
- Preventive maintenance scheduling
- Calibration records
- Corrective repair history
- Spare parts inventory and low-stock indicators
- AI troubleshooting interface with general, safety-oriented demonstration guidance
- Technical reports with equipment CSV export
- Searchable tables and add-record forms
- Responsive mobile navigation

## Demonstration data and persistence

The initial records are **demonstration data**, not real hospital data. The dashboard identifies them as sample records. Use **Reset demo data** at the bottom of the app to restore the original examples. New records and changes are saved to the current browser using `localStorage` and remain on that browser/device. This is a frontend persistence layer only; it is not shared across users or devices and is not a production database or backup. Do not store patient-identifiable or sensitive clinical information in this demo.

The troubleshooting view uses local example guidance; it does not connect to a generative AI service or replace manufacturer documentation or qualified technical judgment.

## Architecture

- `src/App.jsx` — reusable layout, tables, forms, module pages, local persistence, assistant, and reports
- `src/data.js` — navigation and clearly identified sample dataset
- `src/styles.css` — responsive application styling
- `src/main.jsx` — React entry point

## Production considerations

This repository currently provides the frontend only. A production deployment should add a secured API and database, user authentication/authorization, audit logging, backups, and appropriate privacy/security controls before storing operational or patient-related data.
