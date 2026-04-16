const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    duration INTEGER,
    slug TEXT UNIQUE
  );
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS availability (
    id SERIAL PRIMARY KEY,
    day TEXT,
    start_time TEXT,
    end_time TEXT
  );
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    date DATE,
    time TEXT,
    event_id INTEGER REFERENCES events(id),
    notes TEXT
  );
`);


app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("API running...");
});

const eventController = require("./controllers/eventController");


app.post("/events", (req, res) => {
  eventController.createEvent(req, res, pool);
});

app.get("/events", (req, res) => {
  eventController.getEvents(req, res, pool);
});

app.put("/events/:id", (req, res) => {
  eventController.updateEvent(req, res, pool);
});

app.delete("/events/:id", (req, res) => {
  eventController.deleteEvent(req, res, pool);
});

app.get("/events/:slug", (req, res) => {
    eventController.getEventBySlug(req, res, pool);
  });

  app.delete("/events/:id", (req, res) => {
    eventController.deleteEvent(req, res, pool);
  });

const availabilityController = require("./controllers/availabilityController");

app.post("/availability", (req, res) => {
  availabilityController.setAvailability(req, res, pool);
});

app.get("/availability", (req, res) => {
  availabilityController.getAvailability(req, res, pool);
});

const slotController = require("./controllers/slotController");

app.get("/slots", (req, res) => {
  slotController.getSlots(req, res, pool);
});

const bookingController = require("./controllers/bookingController");

app.post("/bookings", (req, res) => {
  bookingController.createBooking(req, res, pool);
});

app.get("/bookings", (req, res) => {
    bookingController.getBookings(req, res, pool);
  });
  
  app.delete("/bookings/:id", (req, res) => {
    bookingController.deleteBooking(req, res, pool);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
