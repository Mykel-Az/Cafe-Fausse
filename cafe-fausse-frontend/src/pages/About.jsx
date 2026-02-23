import React from "react"

export default function About(){
    return(
        <>
        <section className="about-header">
            <h1>About cafe Fausse</h1>
        </section>

        <section className="about-section">
            <p>
            Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez,
            Café Fausse blends traditional Italian flavors with modern culinary
            innovation. Our mission is to provide an unforgettable dining
            experience that reflects both quality and creativity.
            </p>
        </section>

        <section className="about-section">
            <h2> Our Founders </h2>
            <p>
            <strong>Chef Antonio Rossi</strong> brings decades of experience in
            Italian cuisine, focusing on refined techniques and bold flavors.
            </p>

            <p>
            <strong>Maria Lopez</strong> is the visionary restaurateur behind Café
            Fausse, committed to hospitality, excellence, and locally sourced
            ingredients.
            </p>
        </section>

        <section className="about-section">
            <h2>Our Philosophy</h2>
            <p>
            We believe great food starts with great ingredients. Café Fausse is
            dedicated to quality, creativity, and providing an atmosphere where
            every guest feels welcome.
            </p>
        </section>
        </>
    );
}