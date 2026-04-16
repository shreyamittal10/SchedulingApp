import { useState, useEffect } from "react";

export default function Availability() {
  const [showModal, setShowModal] = useState(false);
  
  const [availability, setAvailability] = useState({
    day_of_week: "",
    start_time: "",
    end_time: ""
  });

  const [data, setData] = useState([]);

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const fetchAvailability = async () => {
    const res = await fetch("http://localhost:5000/availability");
    const d = await res.json();
    setData(d);
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const createAvailability = async () => {
   
    if (!availability.day_of_week || !availability.start_time || !availability.end_time) {
      alert("Please fill all fields");
      return;
    }
  
    await fetch("http://localhost:5000/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        day_of_week: Number(availability.day_of_week), 
        start_time: availability.start_time,
        end_time: availability.end_time
      })
    });
  
    setShowModal(false);
  
    setAvailability({
      day_of_week: "",
      start_time: "",
      end_time: ""
    });
  
    fetchAvailability();
  };

  const formatTime = (time) => {
    if (!time) return "";
  
    const [h, m] = time.split(":");
  
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
    
  };

  return (
    <div>

      <div className="header">
        <div>
          <h1>Availability</h1>
          <p>Configure times when you are available for bookings.</p>
        </div>

        <button
          className="new-btn"
          onClick={() => {
            setAvailability({
              day_of_week: "",
              start_time: "",
              end_time: ""
            });
          
            setShowModal(true);
          }}
        >
          + New
        </button>
      </div>


<div className="event-list">
  {data.map((a) => (
    <div className="event-card" key={a.id}>
      <div>
        <h3>{days[a.day_of_week]}</h3>

        <p className="slug">
          {formatTime(a.start_time)} - {formatTime(a.end_time)}
        </p>
      </div>
    </div>
  ))}
</div>

      {showModal && (
  <div className="modal-overlay">
    <div className="modal">

      <h2>Set your availability</h2>
      <p className="modal-sub">
        Choose a day and time when you're available.
      </p>

      <label>Day</label>
      <select
        value={availability.day_of_week}
        onChange={(e) =>
          setAvailability({
            ...availability,
            day_of_week: e.target.value
          })
        }
      >
        <option value="">Select day</option>
        <option value="0">Sunday</option>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
      </select>

      <div className="time-row">
        <div>
          <label>Start</label>
          <input
            type="time"
            value={availability.start_time}
            onChange={(e) =>
              setAvailability({
                ...availability,
                start_time: e.target.value
              })
            }
          />
        </div>

        <div>
          <label>End</label>
          <input
            type="time"
            value={availability.end_time}
            onChange={(e) =>
              setAvailability({
                ...availability,
                end_time: e.target.value
              })
            }
          />
        </div>
      </div>

      <div className="modal-actions">
        <button
          className="cancel"
          onClick={() => {
            setShowModal(false);
            setAvailability({
              day_of_week: "",
              start_time: "",
              end_time: ""
            });
          }}
        >
          Cancel
        </button>

        <button
          className="continue"
          onClick={createAvailability}
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}