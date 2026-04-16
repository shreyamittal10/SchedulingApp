exports.setAvailability = async (req, res, pool) => {
    try {
      const { day_of_week, start_time, end_time } = req.body;
  
      const result = await pool.query(
        `INSERT INTO availability (day_of_week, start_time, end_time)
         VALUES ($1, $2, $3) RETURNING *`,
        [day_of_week, start_time, end_time]
      );
  
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.getAvailability = async (req, res, pool) => {
    try {
      const result = await pool.query(
        "SELECT * FROM availability ORDER BY day_of_week"
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };