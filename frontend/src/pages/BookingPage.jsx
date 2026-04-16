import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function BookingPage() {
  const { slug } = useParams();

  const { state } = useLocation();

  const location = useLocation();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
  
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };

const existingBooking = location.state?.booking;

  const [event, setEvent] = useState(null);
  const [date, setDate] = useState(
  state?.booking?.date ? formatDate(state.booking.date) : ""
);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(
    state?.booking?.time?.slice(0,5) || null
  );
  const [name, setName] = useState(state?.booking?.name || "");
  const [email, setEmail] = useState(state?.booking?.email || "");
  const [notes, setNotes] = useState(existingBooking?.notes || "");
  const [step, setStep] = useState(1);
  
const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`https://schedular-backend-pqgd.onrender.com/events/${slug}`);
      const data = await res.json();
      setEvent(data);
    };

    fetchEvent();
  }, [slug]);

  useEffect(() => {
    if (date && event) {
      getSlots();
    }
  }, [date, event]);

  const getSlots = async () => {
    if (!event) {
      alert("Event not loaded yet");
      return;
    }

    console.log("Using event id:", event.id);

    const res = await fetch(
      `https://schedular-backend-pqgd.onrender.com/slots?event_id=${event.id}&date=${date}`
    );

    const data = await res.json();
    setSlots(data);
  };


const bookSlot = async () => {
    if (existingBooking) {
      await fetch(`https://schedular-backend-pqgd.onrender.com/bookings/${existingBooking.id}`, {
        method: "DELETE"
      });
    }
  
    const res = await fetch("https://schedular-backend-pqgd.onrender.com/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_id: event.id,
        name,
        email,
        date,
        time: selectedSlot,
        notes
      })
    });
  
    const data = await res.json();

if (data.error) {
  alert(data.error);
} else {

  if (existingBooking) {
    alert("Booking rescheduled successfully");

    navigate("/bookings"); 
  } else {
    navigate("/success", {
      state: {
        id: data.id,
        slug: event.slug,        
        event: event.title,
        name: name,
        email: email,
        date: date,
        time: selectedSlot
      }
    });
  }

}
  };

  const formatTime = (time) => {
    if (!time) return "";
  
    let [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
  
    return `${hour}:${m} ${ampm}`;
  };


return (
  <div className="booking-container">
    <div className={`booking-card ${step === 2 ? "form-view" : ""}`}>

      <div className="booking-left">
        <div className="avatar">A</div>
        <h3>Admin</h3>
        <h2>{event?.title}</h2>

        <p>⏱ {event?.duration}m</p>
        <p>📞 Cal Video</p>

        {selectedSlot && (
          <p className="selected-info">
            {date} • {formatTime(selectedSlot)}
          </p>
        )}
      </div>

      {step === 1 && (
        <>
          <div className="booking-middle">
            <Calendar
              onChange={(value) => {
                const selected =
                  value.getFullYear() +
                  "-" +
                  String(value.getMonth() + 1).padStart(2, "0") +
                  "-" +
                  String(value.getDate()).padStart(2, "0");

                setDate(selected);
              }}
              value={date ? new Date(date) : new Date()}
              minDate={new Date()}
            />
          </div>

          <div className="booking-right">
            <h3>Available Slots</h3>

            <div className="slots">
              {date === "" && <p>Select a date</p>}
              {slots.length === 0 && date && <p>No slots available</p>}

              {slots.map((slot, i) => (
                <button
                  key={i}
                  className={`slot ${selectedSlot === slot ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStep(2);
                  }}
                >
                  ● {formatTime(slot)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="booking-form">
          <h3>Enter Details</h3>

          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            placeholder="Additional notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="form-actions">
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={bookSlot}>Confirm</button>
          </div>
        </div>
      )}

    </div>
  </div>
);
}
