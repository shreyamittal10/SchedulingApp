import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Admin</h2>

        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Event types
        </Link>

        <Link to="/bookings" className={location.pathname === "/bookings" ? "active" : ""}>
          Bookings
        </Link>

        <Link to="/availability" className={location.pathname === "/availability" ? "active" : ""}>
          Availability
        </Link>
      </div>

      <div className="main">{children}</div>
    </div>
  );
}