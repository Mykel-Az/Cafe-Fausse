import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home         from "./pages/Home";
import About        from "./pages/About";
import Menu         from "./pages/Menu";
import Reservations from "./pages/reservations/Reservations";
import Gallery      from "./pages/Gallery";

import AdminLogin        from "./pages/admin/AdminLogin";
import AdminLayout       from "./pages/admin/AdminLayout";
import Dashboard         from "./pages/admin/Dashboard";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminCustomers    from "./pages/admin/AdminCustomers";


function App() {
    return (
        <Router>
            <Routes>
                {/* Public site  */}
                <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
                <Route path="/menu" element={<><Navbar /><Menu /><Footer /></>} />
                <Route path="/reservations" element={<><Navbar /><Reservations /><Footer /></>} />
                <Route path="/gallery" element={<><Navbar /><Gallery /><Footer /></>} />

                {/* Admin portal */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard"    element={<Dashboard />} />
                    <Route path="reservations" element={<AdminReservations />} />
                    <Route path="customers"    element={<AdminCustomers />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;