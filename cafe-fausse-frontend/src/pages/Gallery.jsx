import React from "react"

export default function Gallery(){
    return(
        <>
        <section className="gallery-header">
            <h1>Gallery</h1>
        </section>

        <section className="gallery-section">
            <h2>Our space & Cuisine</h2>
        </section>

        <div className="gallery-grid">
            <div className="gallery-item">Image 1</div>
            <div className="gallery-item">Image 2</div>
            <div className="gallery-item">Image 3</div>
            <div className="gallery-item">Image 4</div>
        </div>

        <section className="gallery-section">
            <h2>Awards</h2>
            <ul>
            <li>Culinary Excellence Award – 2022</li>
            <li>Restaurant of the Year – 2023</li>
            <li>Best Fine Dining Experience – Foodie Magazine, 2023</li>
            </ul>
        </section>

        <section className="gallery-section">
            <h2>Customer Reviews</h2>
            <blockquote>
            “Exceptional ambiance and unforgettable flavors.” – Gourmet Review
            </blockquote>
            <blockquote>
            “A must-visit restaurant for food enthusiasts.” – The Daily Bite
            </blockquote>
        </section>
        </>
    );
}