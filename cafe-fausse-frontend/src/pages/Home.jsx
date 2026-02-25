import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function useFade() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
            { threshold: 0.12 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return ref;
}

export default function Home() {
    const r1 = useFade(), r2 = useFade();

    return (
        <>
            <section className="hero" aria-label="Café Fausse hero">
                <div className="hero-bg" role="img" aria-label="Elegant interior of Café Fausse" />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <span className="hero-eyebrow">Washington, DC</span>
                    <h1>Café Fausse</h1>
                    <p className="hero-sub">Fine dining · Timeless taste</p>
                    <div className="hero-actions">
                        <Link to="/reservations" className="btn btn-dark">Reserve a Table</Link>
                        <Link to="/menu" className="btn btn-ghost">View Menu</Link>
                    </div>
                </div>
            </section>

            <main id="main">
                <div className="home-body">
                    <div className="home-grid">
                        <div className="home-card fade-in" ref={r1}>
                            <h2>Welcome</h2>
                            <p>
                                Café Fausse blends traditional Italian flavors with modern culinary
                                innovation. Every dish is crafted with locally-sourced, seasonal
                                ingredients chosen by Chef Antonio Rossi.
                            </p>
                            <p style={{ marginTop: "16px" }}>
                                <Link to="/about" className="link-inline">Our story →</Link>
                            </p>
                        </div>

                        <div className="home-card fade-in" ref={r2}>
                            <h2>Find Us</h2>
                            <p><a href="tel:+12025554567" className="link-inline">(202) 555-4567</a></p>
                            <p>1234 Culinary Ave, Suite 100<br />Washington, DC 20002</p>
                            <p style={{ marginTop: "12px" }}>Mon – Sat &nbsp;5:00 PM – 11:00 PM</p>
                            <p>Sunday &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5:00 PM – 9:00 PM</p>
                            <div className="home-map">
                                <iframe
                                    title="Café Fausse map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3104.8!2d-77.0369!3d38.8977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDUzJzUxLjciTiA3N8KwMDInMTIuOCJX!5e0!3m2!1sen!2sus!4v1"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}