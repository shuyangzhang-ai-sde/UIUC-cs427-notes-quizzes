# CS427 Study

Static study site for **CS 427: Software Engineering** (UIUC)—weekly notes with tabs, embedded mind maps, and interactive quizzes. Content is maintained in **Chinese** (`zh/`) and **English** (`en/`) with a shared navigation shell.

## Features

- **Home (`index.html`)** — Left rail lists course weeks; the main area loads the selected week in an **iframe**. URL hash `#week-id` selects the week (e.g. `#week-8`).
- **Per-week pages** — Split layout: notes (left) and quiz (right). Tabs for topics; some weeks embed a mind map under `mindmap/`.
- **study-lang** — Language switch (**中文** / **English**). On the index page, preference is stored in `localStorage` under `cs427-study-lang`. On `zh/…` or `en/…` pages, language follows the folder; switching navigates to the same week in the other language.
- **Single source of weeks** — `js/study-weeks-config.js` defines `window.STUDY_WEEKS` (id, week number, HTML filename, label). Both the index nav and each week’s sidebar use this list.

## Run locally

No build step. Open `index.html` in your browser (double-click the file or drag it into a tab).

If anything fails under `file://` in your environment, run a static server from the repo root instead, e.g. `python3 -m http.server 8080`, then visit `http://localhost:8080/index.html`.

## Project layout

| Path | Role |
|------|------|
| `index.html` | Shell: week nav + iframe + language switch |
| `zh/*.html`, `en/*.html` | Localized week pages (paired by filename) |
| `mindmap/*.html` | Mind maps embedded in some weeks |
| `js/study-weeks-config.js` | Week list and labels |
| `js/study-lang.js` | `getStudyLang`, `setStudyLang`, `switchStudyPageLang`, `mountStudyLangSwitch` |
| `js/study-index.js` | Index: hash routing, iframe `src`, reacts to `study-lang-change` |
| `js/study-sidebar.js` | Sidebar + language switch on week pages |
| `js/study-week-common.js` | Shared tab helpers for week pages |
| `js/quiz-pane.js` | Quiz UI |
| `css/study-*.css`, `css/quiz-pane.css` | Layout and components |
| `source/` | Older or reference materials (not the main app shell) |
| `tools/` | Helper scripts (e.g. bulk EN string replacement) |

## Adding or editing a week

1. Add or update rows in `js/study-weeks-config.js` (`id`, `num`, `file`, `label`; use `file: null` and optional `soon: true` for placeholders).
2. Keep **the same filename** in both `zh/` and `en/` when the week exists in both languages.
3. Each week HTML should set `data-study-week` on `<body>` to the **same `id`** as in the config (e.g. `week-8`).
4. Include scripts at the bottom in line with existing weeks: `study-weeks-config.js`, `study-lang.js`, `study-sidebar.js` (and quiz scripts as needed).

## Tools

- `tools/translate_en_weeks.py` — Applies batched find/replace pairs to `en/*.html` (useful after copying from `zh/`; always review diffs and polish prose by hand).

## Course & license

Course materials belong to the university and instructors; this repo is a personal study organization project. Use respectfully and in line with your course’s academic integrity rules.
