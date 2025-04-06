import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Hackathons from "./pages/Hackathons";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import HackathonDetail from "./pages/HackathonsDetail";
import TeamsPage from "./pages/TeamsPage";
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      {/* Barre de navigation */}
      <Navbar />

      {/* Routes de l'application */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hackathons" element={<Hackathons />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hackathons/:id" element={<HackathonDetail />} />
        <Route path="/hackathons/:id/teams" element={<TeamsPage />} />
      </Routes>
    </Router>
  );
}
