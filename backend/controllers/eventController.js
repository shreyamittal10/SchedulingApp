
exports.createEvent = async (req, res, pool) => {
    try {
      const { title, description, duration, slug } = req.body;
  
      const result = await pool.query(
        `INSERT INTO event_types (title, description, duration, slug)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, description, duration, slug]
      );
  
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.getEvents = async (req, res, pool) => {
    try {
      const result = await pool.query("SELECT * FROM event_types ORDER BY id DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.updateEvent = async (req, res, pool) => {
    try {
      const { id } = req.params;
      const { title, description, duration, slug } = req.body;
  
      const result = await pool.query(
        `UPDATE event_types
         SET title=$1, description=$2, duration=$3, slug=$4
         WHERE id=$5 RETURNING *`,
        [title, description, duration, slug, id]
      );
  
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.deleteEvent = async (req, res, pool) => {
    try {
      const { id } = req.params;
  
      await pool.query("DELETE FROM event_types WHERE id=$1", [id]);
  
      res.json({ message: "Event deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.getEventBySlug = async (req, res, pool) => {
    try {
      const { slug } = req.params;
  
      const result = await pool.query(
        "SELECT * FROM event_types WHERE slug = $1",
        [slug.trim()]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      res.json(result.rows[0]);
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.deleteEvent = async (req, res, pool) => {
    const { id } = req.params;
  
    await pool.query("DELETE FROM event_types WHERE id = $1", [id]);
  
    res.json({ message: "Deleted" });
  };