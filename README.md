# 📅 Scheduling Platform (Cal.com Clone)

A full-stack scheduling and booking application inspired by Cal.com.
Users can create event types, set availability, and allow others to book meetings through a public link.

---

## 🚀 Tech Stack

**Frontend:**

* React.js (Vite)
* CSS (custom styling)

**Backend:**

* Node.js
* Express.js

**Database:**

* PostgreSQL

---

## ✨ Features

### 1. Event Types Management

* Create, edit, delete event types
* Each event has a unique booking link (`/book/:slug`)
* Includes title, description, duration, and slug

### 2. Availability Settings

* Set availability based on day of the week (0–6)
* Define start and end time for each day

### 3. Public Booking Page

* Calendar-based date selection
* Dynamic time slot generation
* Prevents double booking
* Booking form (name, email, notes)
* Booking confirmation page

### 4. Bookings Dashboard

* View upcoming bookings
* View past bookings
* Cancel bookings
* Reschedule bookings (basic implementation)

### 5. Email Notifications

* Booking confirmation email sent using Nodemailer

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/shreyamittal10/SchedulingApp.git
cd SchedulingApp
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`


Run backend:

```bash
nodemon index.js
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Assumptions & Design Decisions

* Single user system (no authentication required)
* Availability is stored per day (0–6) for simplicity
* Timezone assumed as Asia/Kolkata
* Rescheduling is implemented
* Buffer time between slots is fixed (10 minutes)

---

## 📦 Database Design (Overview)

Tables used:

* **event_types**

  * id, title, description, duration, slug

* **availability**

  * id, day_of_week, start_time, end_time

* **bookings**

  * id, event_id, name, email, date, time, notes


---

## 🌍 Deployment

* Frontend: Render
* Backend: Render 

---

## 📌 Notes

* UI is inspired by Cal.com design patterns
* Focused on functionality + clean UX
* Built as part of SDE Intern Fullstack Assignment

---

## 🙌 Author

Shreya Mittal
