# Onion Assessment & Grading System

A modern, high-precision onion grading and defect evaluation system. It features a React 19 frontend dashboard for agricultural inspectors and a robust Django backend with a highly customized Jazzmin admin panel for data management, reporting, and Excel export.

---

## Key Features

- **Origin & Traceability Dashboard**:

  - Record supplier credentials, verified contact details, and origin state.
  - Interactive cultivar selection featuring 12+ standard Indian onion varieties (*Nashik Red, Bhima Super, Bellary Red, Pune Fursungi, Bangalore Rose, Agrifound Dark Red*, etc.) with high-definition specimen previews and origin details on hover.
  - Standardized grade classification (`Grade A`, `Grade B`, `Grade C`, `Reject`) and size caliber picker (`Small`, `Medium`, `Large`, `Extra Large`).
- **Real-time Quality Metric Hub & Grade Certificate**:

  - Animated dynamic SVG circular gauge displaying a mathematically rigorous agronomic quality score (0 - 100%).
  - APEDA/AGMARK compliant status ratings (`CERTIFIED`, `STANDARD`, `CONDITIONAL`, `REJECTED`).
  - Automated discrepancy detection if manual grade selection conflicts with telemetry readings.
- **Defect Tolerance Calibration (Telemetry)**:

  - Synchronized sliders and numeric steppers with color-coded tolerance thresholds.
  - Real-time quantitative calibration for:
    - **Sprouting Rate (%)** (Tolerance: 0% - 5% export, >8% reject)
    - **Doubles & Splits (%)** (Tolerance: 0% - 4% standard, >6% industrial)
    - **Moisture Content (%)** (Benchmarked: 12% - 14%)
    - **Mechanical Damage & Cuts (%)** (Tolerance: 0% - 3% clean, >7% blemish)
  - Real-time cumulative defect load calculation with live telemetry feedback.
- **Interactive Photo Evidence & Visual Intake**:

  - Drag-and-drop image upload supporting JPEG, PNG, and WebP (up to 12 MB per photo).
  - Photographic reference library showcasing live defect specimens (*Sprouted Bulb*, *Pristine Export Grade A*, *Twin / Split Bulb*).
- **Expert Quality Analysis & Log Actions**:

  - Automatically synthesized agricultural expert analysis and storage advisories.
  - Assessment record saving and PDF export readiness.
- **Powerful Django Admin Backend (Jazzmin)**:

  - Custom themed, responsive admin dashboard matching frontend aesthetics.
  - One-click bulk export of grading and assessment reports to Excel (.xlsx).
  - Centralized management of defect samples, varieties, and user permissions.
- **Multilingual Support (8 Indian Languages)**:

  - English, मराठी (Marathi), हिन्दी (Hindi), ગુજરાતી (Gujarati), ಕನ್ನಡ (Kannada), తెలుగు (Telugu), தமிழ் (Tamil), and ਪੰਜਾਬੀ (Punjabi).
- **Responsive Bento QC Architecture**:

  - Modern Bento grid layout, mobile-optimized 2-column navigation pills, and clean minimal aesthetic.

---

## Tech Stack

| Layer                        | Technology                                                             |
| ---------------------------- | ---------------------------------------------------------------------- |
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)           |
| **Backend Framework**  | [Django 6.1](https://www.djangoproject.com/) + Django Rest Framework    |
| **Admin Panel**        | [Django-Jazzmin](https://django-jazzmin.readthedocs.io/)                |
| **Styling**            | [Tailwind CSS 3](https://tailwindcss.com/) (Custom Bento Design System) |
| **Icons**              | Custom Lucide-compatible vector SVG icon suite                         |
| **Language Support**   | Built-in reactive dictionary (8 languages)                             |
| **Database**           | SQLite3 (Configured for easy local setup)                              |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Python** ≥ 3.10

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/onion-grading.git
cd onion-grading
```

#### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

#### 2. Backend Setup

```bash
cd backend
python -m venv env
# Activate environment (Windows: env\Scripts\activate | Mac/Linux: source env/bin/activate)

pip install -r requirements.txt
# Ensure django-jazzmin and openpyxl are installed
pip install django-jazzmin openpyxl

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

Open [http://localhost:8000/admin](http://localhost:8000/admin) to access the Django Admin panel.

---

## Project Architecture

```
onion-grading/
├── frontend/                                # React Frontend
│   ├── public/                              # High-resolution specimen & variety assets
│   │   ├── samples/                         # Authentic defect photos
│   │   └── varieties/                       # Authentic onion cultivar photos
│   ├── src/
│   │   ├── components/
│   │   │   └── OnionAssessmentForm/
│   │   │       ├── index.jsx                # Primary Bento Dashboard controller
│   │   │       ├── constants.js             # Grades, varieties, states, and sizing standards
│   │   │       ├── translations.js          # Comprehensive 8-language localization dictionaries
│   │   │       ├── onionImagesData.js       # Cultivar & defect specimen reference dataset
│   │   │       ├── sections/
│   │   │       │   ├── OriginTraceabilitySection.jsx   # Section 01: Supplier & Cultivar Picker
│   │   │       │   ├── QualitySection.jsx              # Section 02: Telemetry calibration sliders
│   │   │       │   ├── ImageDropzone.jsx               # Section 03: Photo intake & live samples
│   │   │       │   └── ExpertOpinionSection.jsx        # Section 04: Agronomic summary & export logs
│   │   │       └── ui/
│   │   │           ├── BentoGradeBadge.jsx  # Dynamic Certificate Hub & Circular Gauge
│   │   │           ├── FormPrimitives.jsx   # Custom text inputs, selects, and steppers
│   │   │           ├── Pickers.jsx          # Grade & caliber selection buttons
│   │   │           └── icons.jsx            # Vector icon components
│   │   ├── App.jsx                          # Root shell, responsive navbar, and minimal footer
│   │   ├── index.css                        # Tailored design tokens, glassmorphism, animations
│   │   └── main.jsx                         # Application bootstrap
│   ├── index.html                           # HTML5 entry with Inter typography
│   ├── tailwind.config.js                   # Palette, shadows, and animation configuration
│   ├── vite.config.js                       # Vite configuration
│   └── package.json                         # Dependencies and scripts
└── backend/                                 # Django Backend
    ├── backend/                             # Core Django settings & configurations
    │   ├── settings.py                      # Contains Jazzmin custom UI & Excel export settings
    │   └── urls.py
    ├── grading/                             # Main application logic
    │   ├── models.py                        # Assessment, DefectReferenceSample, OnionVariety schemas
    │   ├── admin.py                         # Excel export logic & Jazzmin ModelAdmin registration
    │   └── views.py                         # API endpoints
    ├── media/                               # Uploaded images & PDF reports
    └── manage.py                            # Django management script
```

---

## License

This project is proprietary and maintained for standardized onion grading and quality certification.
