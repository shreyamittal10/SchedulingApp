import { useLocation, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  const { state } = useLocation();

  if (!state) return <p>No booking data</p>;

  const formatTime = (time) => {
    let [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleReschedule = () => {
    navigate(`/book/${state.slug}`, {
      state: {
        booking: state
      }
    });
  };
  
  const handleCancel = async () => {
    try {
      await fetch(`https://schedular-backend-pqgd.onrender.com/bookings/${state.id}`, {
        method: "DELETE"
      });
  
      alert("Booking cancelled");
      navigate("/bookings");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="success-container">
      <div className="success-card">

        <div className="success-icon">✔</div>

        <h2>This meeting is scheduled</h2>
        <p className="success-sub">
          We sent an email with the details.
        </p>

        <hr />

        <div className="success-details">

          <div className="row">
            <span>What</span>
            <span>{state.event}</span>
          </div>

          <div className="row">
            <span>When</span>
            <span>
              {formatDate(state.date)} <br />
              {formatTime(state.time)}
            </span>
          </div>

          <div className="row">
  <span>Who</span>
  <span>
    Admin <br /> 
    <span className="email">admin@gmail.com</span> <br />
    {state.name} <br />
    <span className="email">{state.email}</span>
  </span>
</div>

          <div className="row">
            <span>Where</span>
            <span>Cal Video</span>
          </div>

        </div>

        <hr />

        <p className="success-footer">
  Need to make a change?{" "}
  <span onClick={handleReschedule}>Reschedule</span> or{" "}
  <span onClick={handleCancel}>Cancel</span>
</p>

      </div>
    </div>
  );
}
