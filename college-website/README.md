# Greenfield College Website

A full-stack college management system I built from scratch. Students can log in to check their results, fee status, and pay fees online. The admin side handles announcements, admissions, and student records. The backend runs on Node.js with a SQLite database and Stripe for payments.

---

## What it does

**Student Portal**
- Login with a verified college email
- View semester results and CGPA
- Check fee breakdown (paid, pending, overdue)
- Pay fees online via Stripe
- View weekly class timetable
- Access personal and academic profile

**Admin Panel**
- See live stats (students, applications, announcements)
- Post and delete college announcements (shows on the main site)
- Review admission applications — approve or reject
- Search through student records

**Main Website**
- Programs offered, latest announcements, admissions info
- Contact form, gallery section
- Fully mobile responsive

---

## Tech used

- **Frontend** — HTML, CSS (glassmorphism design), Vanilla JavaScript
- **Backend** — Node.js, Express.js
- **Database** — SQLite via sql.js
- **Auth** — JWT tokens + bcrypt password hashing
- **Payments** — Stripe API
- **Security** — Helmet, CORS, rate limiting

---

## Running locally

You'll need Node.js v18+ installed.

```bash
git clone https://github.com/muhammadusman2228/College-Website.git
cd College-Website/college-website/server
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Seed the database with sample data:

```bash
node db/seed.js
```

Start the server:

```bash
npm run dev
```

Open **http://localhost:3001** in your browser.

---

## Environment variables

Create a `server/.env` file based on `server/.env.example`. The required variables are:

```
PORT=3001
JWT_SECRET=your_long_random_secret_here
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Get Stripe keys at [stripe.com](https://stripe.com) — use test mode keys for development. The app works without Stripe keys (payments will run in simulation mode).

---

## Deployment

The project includes a `railway.json` file for one-click deployment to [Railway](https://railway.app). Connect the GitHub repo, add the environment variables listed above, and Railway will handle the rest.

---

## Project structure

```
college-website/
├── index.html              # Main landing page
├── css/                    # Stylesheets
├── js/                     # Frontend JavaScript
├── pages/                  # Student and admin pages
└── server/                 # Backend (Node.js)
    ├── db/                 # Database setup and seeder
    ├── middleware/         # JWT auth middleware
    ├── routes/             # API route handlers
    └── server.js           # Entry point
```

---

## Screenshots

*Coming soon — will add once the live deployment is set up.*

---

## License

MIT
