exports.getSlots = async (req, res, pool) => {
    try {
      const { event_id, date } = req.query;
  
      const eventResult = await pool.query(
        "SELECT duration FROM event_types WHERE id = $1",
        [event_id]
      );
  
      if (eventResult.rows.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      const duration = eventResult.rows[0].duration;
  
      const day = new Date(date).getDay();
  
      const availResult = await pool.query(
        "SELECT * FROM availability WHERE day_of_week = $1",
        [day]
      );
  
      if (availResult.rows.length === 0) {
        return res.json([]);
      }
  
      const { start_time, end_time } = availResult.rows[0];
  
      let slots = [];
  
      let current = new Date(`1970-01-01T${start_time}`);
      let end = new Date(`1970-01-01T${end_time}`);
  
      while (current < end) {
        let hours = current.getHours().toString().padStart(2, "0");
        let minutes = current.getMinutes().toString().padStart(2, "0");
  
        slots.push(`${hours}:${minutes}`);
  
        const buffer = 10; 

current.setMinutes(current.getMinutes() + duration + buffer);
      }
  
      const bookedResult = await pool.query(
        `SELECT time FROM bookings
         WHERE event_id = $1 AND date = $2`,
        [event_id, date]
      );
  
      const bookedTimes = bookedResult.rows.map(b =>
        b.time.toString().slice(0, 5)
      );
  
      const availableSlots = slots.filter(
        slot => !bookedTimes.includes(slot)
      );

      console.log("EVENT ID:", event_id);
console.log("EVENT RESULT:", eventResult.rows);
  
      res.json(availableSlots);
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };