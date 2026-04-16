import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BookingPage from "./pages/BookingPage";
import SuccessPage from "./pages/SuccessPage"
import Bookings from "./pages/Bookings";
import Layout from "./components/Layout";
import Availability from "./pages/Availability"


function App() {
  return (
      <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/availability" element={<Layout><Availability /></Layout>} />
      <Route path="/bookings" element={<Layout><Bookings /></Layout>} />

      <Route path="/book/:slug" element={<BookingPage />} />
      <Route path="/success" element={<SuccessPage />} />
      </Routes>
  );
}

export default App;