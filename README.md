# CS427 Study

Static study site for **CS 427: Software Engineering** (UIUC) — weekly notes with tabs, embedded mind maps, and interactive quizzes. All content is in English under `en/`.

## Features

- **Home (`index.html`)** — Left rail lists course weeks; the main area loads the selected week in an **iframe**. URL hash `#week-id` selects the week (e.g. `#week-8`).
- **Per-week pages** — Split layout: notes (left) and quiz (right). Tabs for topics; some weeks embed a mind map under `mindmap/`.
- **Single source of weeks** — `js/study-weeks-config.js` defines `window.STUDY_WEEKS` (id, week number, HTML filename, label). Both the index nav and each week's sidebar use this list.

## Run locally

No build step. Open `index.html` in your browser (double-click or drag into a tab).

If anything fails under `file://`, run a static server from the repo root:

```
python3 -m http.server 8080
```

then visit `http://localhost:8080/index.html`.

## Project layout

| Path | Role |
|------|------|
| `index.html` | Shell: week nav + iframe |
| `en/*.html` | Week pages |
| `mindmap/*.html` | Mind maps embedded in some weeks |
| `js/study-weeks-config.js` | Week list and labels |
| `js/study-lang.js` | `getWeekFile`, `getWeekNavHref` — path helpers |
| `js/study-index.js` | Index: hash routing, iframe `src` |
| `js/study-sidebar.js` | Sidebar on week pages |
| `js/study-week-common.js` | Shared tab helpers for week pages |
| `js/quiz-pane.js` | Quiz UI |
| `css/study-*.css`, `css/quiz-pane.css` | Layout and components |
| `source/` | Older or reference materials (not the main app shell) |
| `tools/` | Helper scripts |

## Adding or editing a week

1. Add or update rows in `js/study-weeks-config.js` (`id`, `num`, `file`, `label`; use `file: null` and optional `soon: true` for placeholders).
2. Each week HTML should set `data-study-week` on `<body>` to the **same `id`** as in the config (e.g. `week-8`).
3. Include scripts at the bottom in line with existing weeks: `study-weeks-config.js`, `study-lang.js`, `study-sidebar.js` (and quiz scripts as needed).

## Course & license

Course materials belong to the university and instructors; this repo is a personal study organization project. Use respectfully and in line with your course's academic integrity rules.
