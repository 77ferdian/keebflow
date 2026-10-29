# Keebflow

<div align="left">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router v7" />
  <img src="https://img.shields.io/badge/Lucide_React-0F172A?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React" />
  <img src="https://img.shields.io/badge/PWA-Ready-4A90E2?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/version-0.1.0--beta-blue?style=for-the-badge" alt="Version" />
</div>

&nbsp;

Keebflow is a keyboard typing practice application built with React 19, focused on helping users improve typing speed, accuracy, and muscle memory through an adaptive and distraction-free interface.

---

## Overview

Keebflow offers a structured typing practice experience with real-time performance metrics, adaptive weak-key drill mode, and a clean command-driven interface. The application is designed around the needs of keyboard enthusiasts and developers who want focused, data-driven practice sessions.

---

## Features

- Multiple typing modes: timed, word count, curated quotes, real code syntax, and custom text
- Quote mode with rich curated quotes in Indonesian and English, with author attribution and length filters
- Punctuation and numbers toggles for natural punctuation, capitalization, and numeric exercises
- Custom word list allowing users to type their own text, with preset options and word shuffle
- Historical progress chart tracking speed (WPM), accuracy, and consistency trends over time
- Progressive Web App (PWA) with full offline support and installability on desktop and mobile
- Adaptive weak-key drill engine with automatic healing and decay tracking
- Real-time WPM, accuracy, and raw error statistics
- Backspace-to-previous-word correction
- Auto-finish on last character with no trailing space required
- Personal best tracking and session streak system
- Command palette for fast navigation and configuration
- Bilingual support: Indonesian and English for both UI and word bank
- Fully customizable themes via a settings panel
- Watch replay feature to review a completed session keystroke by keystroke
- Responsive layout optimized for desktop and tablet use

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite |
| Language | JavaScript (ES2022+) |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | Lucide React |
| State | React Context API + localStorage |
| Offline & PWA | Web App Manifest + Service Worker |

---

## Project Structure

```
keebflow/
  public/
    manifest.webmanifest
    sw.js
    favicon.svg
    logos/
  src/
    components/      UI components (CommandHub, ModeSelector, ProgressHistoryChart, CustomTextModal, etc.)
    contexts/        React context providers (LocaleContext, ThemeContext)
    pages/           Route-level pages (HomePage, TypingPage)
    utils/           Helpers: i18n, storage, words, themes, soundEngine
    App.jsx          Root component and route definitions
    main.jsx         Entry point and service worker registration
  index.html
  package.json
  vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
git clone https://github.com/77ferdian/keebflow.git
cd keebflow
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run linter (oxlint) |

---

## Architecture Notes

- **Two-language system**: `locale` controls UI language; `settings.language` controls the typing word bank. These are intentionally independent.
- **Adaptive drill engine**: Weak keys are scored by error frequency, session hits, and drill accuracy. Keys heal automatically over time and are removed from the drill list once the score reaches zero.
- **Local-first analytics**: All state, personal bests, and test history are stored locally in the browser (`localStorage`), enabling offline-ready functionality without backend dependencies.
- **Prop-types enforced**: All components declare prop types following Dicoding React development standards.

---

## License

MIT License. See `LICENSE` for details.

---

## Author

[77ferdian](https://github.com/77ferdian)
