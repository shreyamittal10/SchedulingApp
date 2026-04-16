const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
  
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  
  const formatTime = (timeStr) => {
    return timeStr.slice(0, 5); 
  };

exports.createBooking = async (req, res, pool) => {
    try {
      const { event_id, name, email, date, time, notes } = req.body;
  
      const existing = await pool.query(
        "SELECT * FROM bookings WHERE event_id=$1 AND date=$2 AND time=$3",
        [event_id, date, time]
      );
  
      if (existing.rows.length > 0) {
        return res.json({ error: "Slot already booked" });
      }
  
      const result = await pool.query(
        `INSERT INTO bookings (event_id, name, email, date, time, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [event_id, name, email, date, time, notes]
      );

      const booking = result.rows[0];

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: booking.email,
  subject: "Booking Confirmed 🎉",
  html: `
    <h2>Booking Confirmed 🎉</h2>
    <p><b>Name:</b> ${booking.name}</p>
    <p><b>Date:</b> ${formatDate(booking.date)}</p>
    <p><b>Time:</b> ${formatTime(booking.time)}</p>
  `
});
  
      res.json(booking);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.getBookings = async (req, res, pool) => {
    const result = await pool.query(`
      SELECT b.*, e.title, e.slug
      FROM bookings b
      JOIN event_types e ON b.event_id = e.id
      ORDER BY b.date ASC
    `);
  
    res.json(result.rows);
  };

  exports.deleteBooking = async (req, res, pool) => {
    const { id } = req.params;
  
    await pool.query(
      "DELETE FROM bookings WHERE id = $1",
      [id]
    );
  
    res.json({ message: "Booking cancelled" });
  };