# Copilot Instructions for Music Royalty Analysis Project (enhanced)

## Project overview
Analyze streaming reports from Airtel, JioSaavn, and Wynk to compute revenue, royalty and performance KPIs. Normalize platform-specific schemas into a canonical dataset for reporting and dashboarding.

## Files / locations
- Raw CSVs: `data/airtel-report.csv`, `data/jiosaavn-report.csv`, `data/wynk-report.csv`
- Reference PDF: `data/Dashboard - Overview (1).pdf`
- Processed outputs: `outputs/cleaned/`, `outputs/figures/`, `outputs/reports/`
- Logs: `logs/cleaning.log`
- Tests: `tests/`

## Canonical schema (target columns)
`['source', 'activity_period', 'year_month', 'store_name', 'country', 'artist', 'album', 'track', 'revenue', 'stream_count', 'unit_type', 'project_code']`

## Ingestion & normalization rules
1. Load CSVs using `pandas.read_csv()` with encoding fallback (UTF-8, latin1). If file >100MB, use `chunksize` and process incrementally; then write a `parquet` output.
2. Use a `schema_map.yaml` or `schema_map.json` that maps each platform’s raw column names to canonical names. Do not hardcode column names in multiple places.
3. Convert `revenue` to numeric: strip currency symbols, remove commas, coerce non-numeric to `NaN`, then `fillna(0)` only after review.
4. Parse `activity_period` with `pd.to_datetime(errors='coerce')`. Create `year_month` = `activity_period.dt.to_period('M').astype(str)`.
5. Normalize text columns: `.str.strip().str.title()` for display but keep a lower-cased `artist_norm` for joins.

## Data quality & validation (automated)
- Immediately run checks after ingestion:
  - `null_counts = df.isna().sum()`
  - `duplicates = df.duplicated().sum()`
  - `negative_revenue = df[df['revenue'] < 0]`
  - `outlier_months = monthly[monthly['total_revenue'] > mean + 3*std]`
- Write a short `cleaning_log.md` and append key metrics to `logs/cleaning.log`.
- Add assert tests before final export:
  - `assert df.shape[0] == sum(original_rows)`, or verify expected totals per source.
- Save cleaned canonical dataset to `outputs/cleaned/df_all.parquet` (overwrite intentionally, idempotent).

## Matching & merging
- Use exact joins where possible on `project_code` or `isrc`. When exact joins fail, run fuzzy matching with `rapidfuzz` or `fuzzywuzzy`:
  - Use token_set_ratio and require >= 90 for auto-accept.
  - 80–90: add to a `manual_review.csv`.
  - <80: treat as distinct.
- Keep a `mapping_review.csv` documenting manual merges.

## Advanced analyses (notebook 04)
Implement in separate cells with short, clear headings:
- 3-month revenue forecast (Prophet or SARIMAX). Document assumptions.
- K-means clustering of tracks/artists using these features: `total_revenue`, `total_streams`, `revenue_per_stream`, `download_ratio`.
- Attribution: simple uplift calculation; DiD or regression if control group exists.
- Elasticity: log-log OLS regression if price/promo data exists.
- Fraud detection: rule-based filters + IsolationForest for anomalies.
- What-if simulation: slider-driven table showing incremental revenue for 0.5%/1%/2% conversions.

## Deliverables & file outputs
- `outputs/reports/final_report_combined.pdf` — final PDF (include original PDF as appendix).
- `outputs/figures/*` — high-res PNGs for each chart.
- `outputs/cleaned/df_all.parquet` — cleaned canonical dataset.
- `outputs/anomalies_sample.csv` — flagged suspicious rows.
- `outputs/forecast.csv` — forecasted months with CI.

## Code style & readability (important)
- Write **human-readable** code: meaningful function & variable names (`load_and_clean_csv`, `compute_monthly_kpis`), short docstrings, clear control flow.
- Keep comments **sparse and purposeful** (one-line notes where needed). Avoid auto-generated or AI-y bloated comments.
- Prefer explicitness over cleverness. One-liners are fine if still readable.
- Use small helper functions (20–60 lines) with clear inputs/outputs; avoid massive monolith cells.
- Avoid heavy inline code generation patterns; aim for simple, reproducible, copy-paste-ready code that a human can read and maintain.

## Reproducibility & environment
- Provide `requirements.txt`.
- Save key artifacts (cleaned data, logs, mapping files) so the pipeline is reproducible.
- Include a short `README.md` describing how to run notebooks and regenerate `outputs/`.

## Tests & checks
- Add a small `tests/smoke_tests.py` that asserts:
  - cleaned file exists and is non-empty,
  - sum of revenue in cleaned matches sum of source files (within tolerance),
  - forecast produces `n` future rows.
- Run smoke tests before exporting final report.

## Security & privacy
- Remove or hash PII fields before saving or publishing outputs (phone numbers, emails).
- Do not commit raw CSVs to public repos if they contain sensitive data.

## Logging & errors
- Write key events to `logs/cleaning.log` with timestamps (rows dropped, rows changed, mapping applied).
- When coercing errors (e.g., date parsing), create a `bad_rows.csv` with the raw row for manual inspection.

## Idempotency
- Scripts and notebooks must be runnable multiple times without doubling outputs. Overwrite deterministic filenames (e.g., `df_all.parquet`) rather than append.

## Human review outputs
- Create `outputs/manual_review/` for:
  - fuzzy-match candidates
  - flagged anomalies
  - currency conversions
  - April/May spike raw rows (for easy client QA)

## Minimal examples & usage
- Provide short usage examples in `README.md`:
  - `python scripts/clean.py` — runs ingestion and writes `df_all.parquet`
  - `jupyter lab notebooks/03_kpis_and_visuals.ipynb` — open to view charts
  - `python scripts/run_forecast.py` — writes `outputs/forecast.csv`

