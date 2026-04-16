import { useState, useEffect } from "react";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    slug: ""
  });
  
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/events");
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

const createEvent = async () => {
    if (editingId) {
      await fetch(`http://localhost:5000/events/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    } else {
      await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    }
  
    setEditingId(null);
  
    setForm({
      title: "",
      description: "",
      duration: "",
      slug: ""
    });
  
    fetchEvents();
  };

  
  const deleteEvent = async (id) => {
    await fetch(`http://localhost:5000/events/${id}`, {
      method: "DELETE"
    });
  
    fetchEvents();
  };

  const editEvent = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      duration: event.duration,
      slug: event.slug
    });
  
    setEditingId(event.id);
    setShowModal(true);
  };


return (
  <div>

    <div className="header">
      <div>
        <h1>Event types</h1>
        <p>Configure different events for people to book on your calendar.</p>
      </div>

      <div className="header-right">
      <button
  className="new-btn"
  onClick={() => {
    setEditingId(null); 
    setForm({
      title: "",
      description: "",
      duration: "",
      slug: ""
    });
    setShowModal(true);
  }}
>
  + New
</button>
</div>
    </div>

    <div className="event-list">
      {events.map((e) => (
        <div key={e.id} className="event-card">

          <div className="event-left">
            <h3>{e.title}</h3>
            <p className="slug">/{e.slug}</p>
            <span className="badge">{e.duration}m</span>
          </div>

          <div className="event-right">
  <a href={`/book/${e.slug}`} target="_blank">↗</a>
  <button onClick={() => editEvent(e)}>✏️</button>
  <button onClick={() => deleteEvent(e.id)}>🗑️</button>
</div>
        </div>
      ))}
    </div>
    {showModal && (
  <div className="modal-overlay">

    <div className="modal">

      <h2>Add a new event type</h2>
      <p className="modal-sub">
        Set up event types to offer different types of meetings.
      </p>

      <label>Title</label>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Quick chat"
      />

      <label>URL</label>
      <input
        name="slug"
        value={form.slug}
        onChange={handleChange}
        placeholder="quick-chat"
      />

      <label>Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="A quick meeting"
      />

      <label>Duration</label>
      <input
        name="duration"
        value={form.duration}
        onChange={handleChange}
        placeholder="15"
      />

      <div className="modal-actions">
        <button className="cancel" onClick={() => setShowModal(false)}>
          Close
        </button>

        <button
  className="continue"
  onClick={async () => {
    await createEvent();
    setShowModal(false);
  }}
>
  {editingId ? "Update" : "Continue"}
</button>
      </div>

    </div>
  </div>
)}

  </div>
);

}