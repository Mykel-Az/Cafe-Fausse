import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Reservations from "./pages/reservations/Reservations";
import Gallery from "./pages/Gallery";

// Inner pages need top offset for the fixed navbar (68px)
const Padded = ({ children }) => (
    <div style={{ paddingTop: "68px" }}>{children}</div>
);

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/about"        element={<Padded><About /></Padded>} />
                <Route path="/menu"         element={<Padded><Menu /></Padded>} />
                <Route path="/reservations" element={<Padded><Reservations /></Padded>} />
                <Route path="/gallery"      element={<Padded><Gallery /></Padded>} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;