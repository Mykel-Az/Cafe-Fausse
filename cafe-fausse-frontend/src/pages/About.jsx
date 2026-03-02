import React from "react";

export default function About() {
    return (
        <main id="main" className="has-hero">
            {/* Page hero */}
            <div className="page-hero" aria-hidden="true">
                <div
                    className="page-hero-bg"
                    style={{ backgroundImage: "url('/gallery_img/Chef-Plating-in-Elegant-Kitchen.png')" }}
                />
                <div className="page-hero-overlay" />
                <div className="page-hero-content">
                    <span className="page-hero-eyebrow">Our Story</span>
                    <h1 className="page-hero-title">About Café Fausse</h1>
                </div>
            </div>

            <div className="page-container">
                <div className="about-intro fade-in visible">
                    <p>
                        Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez,
                        Café Fausse blends traditional Italian flavors with modern culinary
                        innovation. Our mission is to provide an unforgettable dining
                        experience that reflects both quality and creativity.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Our Founders</h2>
                    <div className="founders-grid">
                        <div className="founder-card">
                            <h3>Chef Antonio Rossi</h3>
                            <p>
                                Antonio brings decades of experience in Italian cuisine, focusing on
                                refined techniques and bold flavors. Trained in Florence and Rome, he
                                has earned recognition from some of the world's most prestigious
                                culinary institutions.
                            </p>
                        </div>
                        <div className="founder-card">
                            <h3>Maria Lopez</h3>
                            <p>
                                Maria is the visionary restaurateur behind Café Fausse, committed
                                to hospitality, excellence, and locally sourced ingredients. Her
                                background in luxury hospitality management ensures every guest
                                receives an exceptional experience.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Our Philosophy</h2>
                    <p>
                        We believe great food starts with great ingredients. Café Fausse is
                        dedicated to quality, creativity, and providing an atmosphere where every
                        guest feels welcome. We partner with local farms and artisans to bring
                        the freshest seasonal produce to your table.
                    </p>
                </div>
            </div>
        </main>
    );
}