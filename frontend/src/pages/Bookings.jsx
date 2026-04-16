import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("upcoming");

  const navigate = useNavigate();

  const fetchBookings = async () => {
    const res = await fetch("https://schedular-backend-pqgd.onrender.com/bookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    const confirmDelete = window.confirm("Cancel this booking?");
    if (!confirmDelete) return;
  
    await fetch(`https://schedular-backend-pqgd.onrender.com/bookings/${id}`, {
      method: "DELETE"
    });
  
    alert("Booking cancelled");
    fetchBookings();
  };

  const reschedule = (booking) => {
    navigate(`/book/${booking.slug}`, {
        state: { booking }
      });
  };

  const today = new Date();

  const upcoming = bookings.filter(b => new Date(b.date) >= today);
const past = bookings.filter(b => new Date(b.date) < today);

return(
<div className="bookings-container">
  <div className="header">
    <div>
      <h1>Bookings</h1>
      <p>See upcoming and past events booked.</p>
    </div>
  </div>

  <div className="tabs">
  <button
    className={tab === "upcoming" ? "active" : ""}
    onClick={() => setTab("upcoming")}
  >
    Upcoming
  </button>

  <button
    className={tab === "past" ? "active" : ""}
    onClick={() => setTab("past")}
  >
    Past
  </button>
</div>

  {tab === "upcoming" && (
  <>
    {upcoming.length === 0 ? (
      <p className="empty">No upcoming bookings</p>
    ) : (
      <div className="booking-group">
        <div className="group-title">NEXT</div>

        {upcoming.map((b) => (
          <div key={b.id} className="booking-item">
            <div className="left">
              <div className="date">
                {new Date(b.date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div className="time">{b.time.slice(0, 5)}</div>
            </div>

            <div className="middle">
              <div className="title">{b.title}</div>
              {b.notes && <div className="notes">"{b.notes}"</div>}
              <div className="meta">Admin and {b.name}</div>
            </div>

            <div className="right">
              <button onClick={() => reschedule(b)}>Reschedule</button>
              <button className="danger" onClick={() => cancelBooking(b.id)}>
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)}

  {tab === "past" && (
  <>
    {past.length === 0 ? (
      <div className="empty-state">
        <div className="empty-box">
          <div className="empty-icon">📅</div>
          <h3>No past bookings</h3>
          <p>
            You have no past bookings. Your past bookings will show up here.
          </p>
        </div>
      </div>
    ) : (
      <div className="booking-group">
        {past.map((b) => (
          <div key={b.id} className="booking-item past">
            <div className="left">
              <div className="date">
                {new Date(b.date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div className="time">{b.time.slice(0, 5)}</div>
            </div>

            <div className="middle">
              <div className="title">{b.title}</div>
              {b.notes && <div className="notes">"{b.notes}"</div>}
              <div className="meta">Admin and {b.name}</div>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)}
</div>
);
}
