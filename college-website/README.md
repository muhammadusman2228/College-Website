# 🎓 Greenfield College – Full Stack Web Application

A fully-featured college management website built with **vanilla HTML/CSS/JS** frontend and a **Node.js + Express + SQLite** backend, featuring **Stripe** payment integration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

### 🎓 Student Portal
- **Secure Login** – JWT authentication with bcrypt-hashed passwords
- **Dashboard** – GPA, semester, program overview, quick links
- **Profile** – Personal, academic, and guardian information
- **Results** – Semester-wise academic results with grade progress bars
- **Fee Status** – Summary overview, progress bar, paid/pending/overdue breakdown
- **Pay Fee** – Multi-step payment form with live card preview (Stripe integration)
- **Timetable** – Color-coded weekly class schedule

### 🔐 Admin Panel
- **Dashboard** – Real-time stats (students, announcements, applications)
- **Announcements** – Create, edit, and delete college announcements (appears on public site)
- **Admissions** – Review applications, approve or reject with status filters
- **Students** – Searchable student records directory

### 🌐 Landing Page
- Animated hero section with particle effects
- Programs grid, news, admissions timeline, gallery, contact form
- Fully responsive (mobile-first)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3 (glassmorphism), Vanilla JS |
| Backend | Node.js + Express.js |
| Database | SQLite (via `sql.js`) |
| Auth | JWT + bcryptjs |
| Payments | Stripe SDK + Stripe.js |
| Security | Helmet, CORS, Rate Limiting |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts (Poppins, Playfair Display) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ ([nodejs.org](https://nodejs.org))
- npm
- A free [Stripe](https://stripe.com) account (for real payments; mock mode works without it)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/muhammadusman2228/college-website.git
cd college-website

# 2. Install backend dependencies
cd server
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your JWT secret and Stripe keys

# 4. Seed the database with demo data
node db/seed.js

# 5. Start the server
npm run dev
```

Then open **http://localhost:3001** 🎉

---

## 🔑 Demo Credentials

| Role | Username / Email | Password |
|---|---|---|
| Student | `sara@college.edu` | `password123` |
| Student | `ali@college.edu` | `pass456` |
| Student | `fatima@college.edu` | `khan789` |
| Admin | `admin` | `admin123` |

---

## 💳 Stripe Payments

**Mock mode** is active by default (no keys needed). For real payments:

1. Sign up at [stripe.com](https://stripe.com) → **Developers → API Keys**
2. Add your **Test** keys to `server/.env`
3. Use test card: `4242 4242 4242 4242` · Any future date · Any CVV

---

## 📁 Project Structure

```
college-website/
├── index.html              # Landing page
├── css/
│   ├── style.css           # Design system & global styles
│   ├── animations.css      # Keyframe animations
│   ├── components.css      # Reusable UI components
│   ├── dashboard.css       # Portal layout
│   └── forms.css           # Form & auth styles
├── js/
│   ├── api.js              # API client with JWT auth
│   ├── main.js             # Landing page logic
│   ├── student.js          # Student portal controllers
│   └── admin.js            # Admin portal controllers
├── pages/
│   ├── student-login.html
│   ├── student-dashboard.html
│   ├── profile.html
│   ├── result.html
│   ├── fee-status.html
│   ├── fee-payment.html
│   ├── timetable.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── admin-announcements.html
│   ├── admin-admissions.html
│   └── admin-students.html
└── server/
    ├── server.js           # Express app entry
    ├── .env.example        # Environment template
    ├── db/
    │   ├── database.js     # SQLite setup & helpers
    │   └── seed.js         # Demo data seeder
    ├── middleware/
    │   └── auth.js         # JWT guards
    └── routes/
        ├── auth.routes.js
        ├── student.routes.js
        ├── payment.routes.js
        ├── admin.routes.js
        └── public.routes.js
```

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | None | Health check |
| POST | `/api/auth/student-login` | None | Student JWT login |
| POST | `/api/auth/admin-login` | None | Admin JWT login |
| GET | `/api/student/profile` | Student | Profile data |
| GET | `/api/student/results` | Student | Semester results |
| GET | `/api/student/fee` | Student | Fee records |
| GET | `/api/student/timetable` | Student | Weekly schedule |
| POST | `/api/payment/create-intent` | Student | Stripe PaymentIntent |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET/POST/DELETE | `/api/admin/announcements` | Admin | Announcements CRUD |
| GET/POST/PATCH | `/api/admin/admissions` | Admin | Admissions management |
| GET | `/api/admin/students` | Admin | Student records |

---

## 📄 License

MIT – feel free to use, modify, and distribute.

---

*Built with ❤️ by [Muhammad Usman](https://github.com/muhammadusman2228)*
