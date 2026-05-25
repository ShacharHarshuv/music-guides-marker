# Music Guides Marker

Requires ffmpeg on PATH. `npm install` then `npm run make-audio-guides`.

Configure project paths in `src/projects-config.ts`, then pick the project in `src/make-audio-guides.ts`.

## Audio guides

**Input:** one folder per song under `{stemsFolder}/{track name}/` (track names from `trackList`).

**Naming:** `{Song Name} -- {Role} -- {Track Type}.mp3`

- `Backtrack` — required
- `Dialogue` — optional
- character roles — `Audio` = vocal, anything else (e.g. `MIDI`) = pluck guide

Example: `Who Are You -- Rachel -- Audio.mp3`

**Output:** `{outputBasePath}/{track name}/`

## Combined Score

Requires a newer Node version. Set the folder in `src/combine-score.ts`, then `npm run combine-score`.

**Input:** one script + one or more score PDFs in the same folder. Each score gets its own combined output (e.g. piano-vocal and vocal-only both work).

**Naming:**
- Script: contains `script`, not `combined` — e.g. `Script - Show Name.pdf`
- Score: contains `score`, not `combined` — e.g. `Piano-Vocal Score - Show Name.pdf`, `Vocal Score - Show Name.pdf`
- Output: `Combined {Script Label} & {Score Label} - {Show Name}.pdf`

**Script markers** (must be extractable text in the PDF):
- Song start: `#` + digit (e.g. `#1`)
- Song end: `End of Song`
- Count of starts and ends must match

**Score markers:**
- Song boundaries: `[Rev.` text on each song's first page
