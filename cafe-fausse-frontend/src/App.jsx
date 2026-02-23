import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from  "./pages/About";
import Menu from "./pages/Menu";
import Reservations from "./pages/reservations/Reservations";
import Gallery from "./pages/Gallery";

function App(){
  return(
    <Router>
      <Navbar/>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/menu" element={<Menu/>}/>
          <Route path="/reservations" element={<Reservations/>} />
          <Route path="/gallery" element={<Gallery/>} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;