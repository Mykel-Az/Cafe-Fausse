import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    const isHome = pathname === "/";

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", fn, { passive: true });
        fn();
        return () => window.removeEventListener("scroll", fn);
    }, [pathname]);

    const close = () => setOpen(false);

    const isDark = isHome && !scrolled;

    return (
        <>
            <a href="#main" className="skip-nav">Skip to main content</a>

            <nav
                className={`navbar${isDark ? " over-hero" : " solid"}`}
                aria-label="Main navigation"
            >
                <div className="nav-inner">
                    <Link to="/" className="nav-logo" onClick={close}>
                        Café Fausse
                    </Link>

                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/menu">Menu</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/gallery">Gallery</Link></li>
                        <li><Link to="/reservations" className="nav-cta">Reserve</Link></li>
                    </ul>

                    <button
                        className={`nav-hamburger${open ? " open" : ""}`}
                        onClick={() => setOpen(o => !o)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            <ul className={`nav-mobile${open ? " open" : ""}`}>
                <li><Link to="/" onClick={close}>Home</Link></li>
                <li><Link to="/menu" onClick={close}>Menu</Link></li>
                <li><Link to="/about" onClick={close}>About</Link></li>
                <li><Link to="/gallery" onClick={close}>Gallery</Link></li>
                <li><Link to="/reservations" onClick={close}>Reserve a Table</Link></li>
            </ul>
        </>
    );
}