# 🧅 Onion Grading — Quality Assessment Tool

A multilingual onion quality assessment web application built with **React + Vite + Tailwind CSS**. Designed for field inspectors and suppliers to record, evaluate, and summarise onion batches efficiently.

---

## Features

- **Supplier & Source Details** — capture supplier name, phone number, and state of origin
- **Crop Details** — variety (e.g. Nashik Red), grade picker, and size classification
- **Quality Metrics** — moisture %, sprouting %, damage %, and doubles % with 0–100 clamping
- **Photo Evidence** — drag-and-drop image upload with 12 MB cap and automatic URL revocation
- **Inspector Notes** — free-form notes and certifier name
- **Summary Card** — instant printable/shareable assessment summary
- **Multilingual UI** — English, Marathi (मराठी), Hindi (हिंदी), and Gujarati (ગુજરાતી)

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Framework  | React 19 + Vite 8                 |
| Styling    | Tailwind CSS 3                    |
| Linting    | Oxlint                            |
| Build tool | Vite                              |

---

## Getting Started

### Prerequisites

- Node.js **≥ 18**
- npm **≥ 9**

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
onion-grading/
├── public/                         # Static assets
├── src/
│   ├── components/
│   │   └── OnionAssessmentForm/
│   │       ├── index.jsx           # Main form component
│   │       ├── constants.js        # Grade, variety, size constants
│   │       ├── translations.js     # i18n strings (EN, MR, HI, GU)
│   │       ├── hooks/              # Custom React hooks
│   │       ├── sections/           # Form section sub-components
│   │       │   ├── SourceSection.jsx
│   │       │   ├── OnionDetailsSection.jsx
│   │       │   ├── QualitySection.jsx
│   │       │   ├── NotesSection.jsx
│   │       │   ├── ImageDropzone.jsx
│   │       │   └── SummaryCard.jsx
│   │       └── ui/                 # Shared UI primitives & icons
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .oxlintrc.json
└── package.json
```

---

## Usage

1. Select your preferred language from the dropdown (EN / MR / HI / GU).
2. Fill in supplier details and state of origin.
3. Choose the onion variety, grade, and size class.
4. Enter quality metrics (moisture, sprouting, damage, doubles).
5. Upload photo evidence by dragging images into the dropzone.
6. Add inspector name and any additional notes.
7. Review the **Summary Card** and share or print as needed.

---

## License

This project is private and not licensed for public distribution.
