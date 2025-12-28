# Singapore 2026 Calendar (Monthly) + Photos per Day

A lightweight web app that shows a **monthly 2026 calendar**, preloads **Singapore public holidays**, and lets you **attach up to 4 photos per day tile** (stored locally in your browser).

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

## Features

- **Monthly view for 2026** (week starts Monday)
- **Default Singapore public holidays**
  - Loads from the public `date.nager.at` API when available
  - Falls back to a bundled list if offline
- **Up to 4 photos per day**
  - Click `＋` on a day tile to upload images
  - Click a photo thumbnail to remove it
  - Stored in `localStorage` (no backend)

## Notes

- If you upload many large photos, you may hit browser storage limits. Use smaller images for best results.

