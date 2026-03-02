# Café Fausse — Full-Stack Web Application

A full-stack restaurant website for the fine-dining establishment **Café Fausse**, built with **React (JSX)** on the frontend and **Flask + PostgreSQL** on the backend. The application allows customers to browse the menu, make table reservations, sign up for a newsletter, and learn about the restaurant. A staff admin panel provides reservation management tools.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [Pages Overview](#pages-overview)
- [API Endpoints](#api-endpoints)

---

## Project Structure

```
cafe-fausse/
├── cafe-fausse-backend/
│   ├── app.py                  # Flask app entry point
│   ├── config.py               # App-wide constants (tables, hours, party size)
│   ├── extensions.py           # SQLAlchemy instance
│   ├── models.py               # Database models (Customer, Reservation, Staff)
│   ├── requirements.txt
│   ├── .env                    # Environment variables (not committed)
│   ├── routes/
│   │   ├── reservation_routes.py
│   │   ├── customer_routes.py
│   │   ├── admin_routes.py
│   │   └── newsletter_routes.py
│   └── services/
│       ├── booking_engine.py   # Availability, table assignment, validation
│       ├── reservation_services.py
│       ├── customer_service.py
│       └── utility_services.py
│
└── cafe-fausse-frontend/
    ├── src/
    │   ├── components/         # Navbar, Footer
    │   ├── pages/              # Home, Menu, Reservations, About, Gallery, Admin
    │   ├── hooks/              # Custom React hooks
    │   ├── services/           # API call functions
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## Features

- **Home Page** — Restaurant name, address, phone, opening hours, and navigation
- **Menu Page** — Full menu segmented by Starters, Mains, Desserts, and Beverages
- **Reservations Page** — Multi-step reservation form with real-time availability checking
- **About Us Page** — Restaurant history, founders' bios, and mission statement
- **Gallery Page** — Photo gallery with lightbox, awards, and customer reviews
- **Newsletter Signup** — Email subscription form with validation, stored in the database
- **Reservation System** — Availability checking, random table assignment (30 tables), 1-hour blocking rule, one reservation per customer per day
- **Staff Admin Panel** — Dashboard overview, reservation management, check-in, force cancel, no-show marking, and customer management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, JSX, CSS Flexbox/Grid |
| Backend | Flask, Flask-JWT-Extended, Flask-CORS |
| Database | PostgreSQL, SQLAlchemy ORM |
| Scheduler | APScheduler (auto-expires old reservations every 30 min) |
| Auth | JWT (staff/admin routes) |

---

## Prerequisites

Make sure the following are installed on your machine before proceeding:

- **Node.js** v18 or higher — [https://nodejs.org](https://nodejs.org)
- **Python** 3.10 or higher — [https://python.org](https://python.org)
- **PostgreSQL** 14 or higher — [https://www.postgresql.org/download](https://www.postgresql.org/download)
- **pgAdmin 4** (optional, recommended) — [https://www.pgadmin.org](https://www.pgadmin.org)

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cafe-fausse.git
cd cafe-fausse
```

---

### 2. Backend Setup

#### a) Create and activate a virtual environment

```bash
cd cafe-fausse-backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

#### b) Install dependencies

```bash
pip install -r requirements.txt
```

#### c) Create your `.env` file

Create a file named `.env` inside `cafe-fausse-backend/` with the following content:

```dotenv
FLASK_APP=app
FLASK_DEBUG=True
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cafe_fausse_db
SECRET_KEY=your_secret_key_here
```

> **Note:** If your PostgreSQL password contains special characters (e.g. `@`), URL-encode them.  
> For example, `My@pass` becomes `My%40pass` in the connection string.

---

### 3. Frontend Setup

```bash
cd cafe-fausse-frontend
npm install
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string |
| `SECRET_KEY` | Secret key used for signing JWT tokens |
| `FLASK_APP` | Entry point for Flask (`app`) |
| `FLASK_DEBUG` | Enable debug mode (`True` / `False`) |

---

## Database Configuration

### Step 1 — Create the database

Using **pgAdmin 4:**
1. Open pgAdmin and connect to your local server
2. Right-click **Databases** → **Create** → **Database**
3. Name it `cafe_fausse_db` and click **Save**

Or using the **psql CLI:**

```bash
psql -U postgres -c "CREATE DATABASE cafe_fausse_db;"
```

### Step 2 — Run the application (tables are auto-created)

Flask-SQLAlchemy will create all tables automatically on first run via `db.create_all()` inside `create_app()`. No manual migrations are needed.

### Step 3 — (Optional) Seed test data

A seed script is included to populate the database with realistic test data covering all reservation statuses, customer types, and staff accounts.

```bash
psql -U postgres -d cafe_fausse_db -f seed_cafe_fausse.sql
```

Or open the file in pgAdmin's **Query Tool** and press **F5**.

The script is safe to re-run — it truncates and reseeds cleanly each time.

---

## Running the Application

### Start the Backend

```bash
cd cafe-fausse-backend
# Make sure your virtual environment is active
flask run
```

The backend will be available at: `http://localhost:5000`

### Start the Frontend

Open a new terminal:

```bash
cd cafe-fausse-frontend
npm run dev
```

The frontend will be available at: `http://localhost:5173`

> Make sure both the backend and frontend servers are running at the same time.

---

## Pages Overview

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with contact info and hours |
| Menu | `/menu` | Full menu by category with prices |
| Reservations | `/reservations` | Availability checker and booking form |
| About Us | `/about` | Founders' story and restaurant history |
| Gallery | `/gallery` | Photos, awards, and customer reviews |

**Opening Hours:**
- Monday – Saturday: 5:00 PM – 11:00 PM
- Sunday: 5:00 PM – 9:00 PM

---

## API Endpoints

### Customers
| Method | Endpoint | Description |
|---|---|---|
| POST | `/customers/check` | Check if a customer exists by email |
| POST | `/customers/create` | Create a new customer |
| PUT | `/customers/<id>/update` | Update customer profile |
| GET | `/customers/<id>/reservations` | Get active reservations for a customer |

### Reservations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/availability?date=YYYY-MM-DD` | Get available time slots for a date |
| POST | `/reservations/create` | Create a new reservation |
| GET | `/reservations/<id>` | Get a specific reservation |
| PUT | `/reservations/<id>/update` | Update an existing reservation |
| DELETE | `/reservations/<id>/cancel` | Cancel a reservation |

### Newsletter
| Method | Endpoint | Description |
|---|---|---|
| POST | `/newsletter-signup` | Subscribe an email to the newsletter |

### Staff / Admin *(JWT required)*
| Method | Endpoint | Description |
|---|---|---|
| POST | `/staff/login` | Staff login — returns JWT token |
| GET | `/admin/dashboard` | Dashboard stats overview |
| GET | `/staff/reservations` | List all reservations with filters |
| POST | `/staff/reservations/<id>/check-in` | Check in a customer |
| POST | `/staff/reservations/<id>/force-cancel` | Force cancel any reservation |
| POST | `/staff/reservations/<id>/mark-no-show` | Mark a reservation as expired |
| PATCH | `/admin/reservations/<id>/complete` | Mark a reservation as completed |
| GET | `/admin/customers` | List all customers with optional filters |