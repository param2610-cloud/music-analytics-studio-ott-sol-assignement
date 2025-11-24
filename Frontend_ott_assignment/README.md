# Music Analytics Dashboard

A modern, production-ready frontend-only dashboard for music analytics data visualization.

## Features

- **Dashboard Home**: Displays various charts including month-wise revenue, DSP reports, streaming trends, caller tune overview, and country trends.
- **Reports**: DSP and Caller Tune reports with charts and CSV data tables.
- **Repertoire**: Paginated tables for Artists, Albums, and Tracks.
- **Account**: Dummy login page.
- **Responsive Design**: Built with TailwindCSS for a premium look.
- **Animations**: Smooth page transitions and micro-interactions with Framer Motion.
- **Data Loading**: CSV files loaded using PapaParse.
- **Dark Mode**: Toggle between light and dark themes.
- **Export Features**: Download CSV tables and print dashboard.

## Tech Stack

- React + Vite
- TailwindCSS
- PapaParse
- Framer Motion
- React Router DOM

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5174](http://localhost:5174) in your browser.

## Project Structure

```
src/
  components/
    Table.jsx
  layouts/
    Layout.jsx
  pages/
    Dashboard.jsx
    DSPReport.jsx
    CallerTuneReport.jsx
    ArtistRepertoire.jsx
    AlbumRepertoire.jsx
    TrackRepertoire.jsx
    Account.jsx
  utils/
    csvLoader.js
public/
  data/
    # CSV files
  images/
    # HTML chart files
```

## Data Sources

- CSV files are loaded from `/public/data/`
- Charts are displayed from HTML files in `/public/images/`

## Build

```bash
npm run build
```

## Deployment

This is a static frontend application that can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.
