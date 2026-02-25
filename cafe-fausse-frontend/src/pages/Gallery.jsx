import React, { useState, useEffect, useCallback } from "react";

const IMAGES = [
    { src: "/gallery-cafe-interior.webp",  alt: "Elegant dining room with crystal chandeliers", label: "Dining Room" },
    { src: "/gallery-special-event.webp",  alt: "Special event evening at Café Fausse",          label: "Special Events" },
    { src: "/home-cafe-fausse.webp",        alt: "Grand hall at Café Fausse",                     label: "The Grand Hall" },
    { src: "/gallery-ribeye-steak.webp",    alt: "Signature ribeye steak, beautifully plated",    label: "Signature Dish" },

    { src: "/Menu_img/starters_img/Bruschetta.png", alt: "Bruschetta", label: "Signature Dish" },
    { src: "/Menu_img/starters_img/Caesar-Salad.png", alt: "Caesar Salad", label: "Signature Dish"},
    { src: "/Menu_img/mains_img/Grilled-Salmon.png", alt: "Grilled salmo", label: "Signature Dish"},
          
    { src: "/Menu_img/mains_img/Vegetable-Risotto.png", alt: "Vegetable", label: "Signature Dish"}, 
    { src: "/Menu_img/desserts_img/Tiramisu.png", alt: "Tiramisu", label: "Signature Dish" },
    
    { src: "/Menu_img/desserts_img/Cheesecake.png", alt: "Cheesecake", label: "Signature Dish" },
    { src: "/Menu_img/beverages_img/Red-Wine.png", alt: "Red Wine", label: "Signature Dish" },
    
    { src: "/Menu_img/beverages_img/White-Wine.png", alt: "White Wine", label: "Signature Dish" },
    { src: "/Menu_img/beverages_img/Craft-Beer.png", alt: "Craft Beer", label: "Signature Dish" },
    { src: "/Menu_img/beverages_img/Espresso.png", alt: "Espresso", label: "Signature Dish" },

    // INTERIOR AMBIANCE
{
  src: "/gallery_img/Grand-Dining-Hall.png",
  alt: "Bright luxury European grand dining hall with chandeliers and ornate ceilings",
  label: "Interior Ambiance"
},
{
  src: "/gallery_img/Chandelier-Ceiling-Detail.png",
  alt: "Crystal chandelier hanging from ornate carved ceiling in luxury restaurant",
  label: "Interior Ambiance"
},

// SPECIAL EVENTS
{
  src: "/gallery_img/Formal-Private-Dinner Event.png",
  alt: "Formal private dinner event in bright luxury European dining hall",
  label: "Special Events"
},
{
  src: "/gallery_img/Wedding-Reception.png",
  alt: "Elegant daytime wedding reception in chandelier-lit restaurant",
  label: "Special Events"
},
{
  src: "/gallery_img/Wine-Pairing-Event.png",
  alt: "Afternoon wine pairing event in bright upscale restaurant",
  label: "Special Events"
},

// BEHIND THE SCENES
{
  src: "/gallery_img/Chef-Plating-in-Elegant-Kitchen.png",
  alt: "Chef carefully plating gourmet dish in bright professional kitchen",
  label: "Behind the Scenes"
},
{
  src: "/gallery_img/Dessert-Finishing-Touch.png",
  alt: "Pastry chef adding final garnish to plated dessert",
  label: "Behind the Scenes"
},
{
  src: "/gallery_img/Floral-Arrangement-Prep.png",
  alt: "Staff arranging floral centerpiece in sunlit luxury dining hall",
  label: "Behind the Scenes"
}
  
];

export default function Gallery() {
    const [idx, setIdx] = useState(null);

    const prev = useCallback(() => setIdx(i => (i - 1 + IMAGES.length) % IMAGES.length), []);
    const next = useCallback(() => setIdx(i => (i + 1) % IMAGES.length), []);
    const close = () => setIdx(null);

    useEffect(() => {
        if (idx === null) return;
        const fn = (e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", fn);
        document.body.style.overflow = "hidden";
        return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
    }, [idx, prev, next]);

    return (
        <main id="main">
            <div className="page-container">
                <div className="sec-head centered">
                    <span className="eyebrow">Gallery</span>
                    <h1>A Glimpse Inside</h1>
                    <span className="sec-rule" />
                </div>

                <div className="gallery-sec">
                    <h2>Our Space &amp; Cuisine</h2>
                    <div className="gallery-grid">
                        {IMAGES.map((img, i) => (
                            <button
                                key={img.src}
                                className="gallery-thumb"
                                onClick={() => setIdx(i)}
                                aria-label={`View ${img.label}`}
                            >
                                <img src={img.src} alt={img.alt} loading="lazy" />
                                <div className="gallery-overlay">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="gallery-sec">
                    <h2>Awards &amp; Recognition</h2>
                    <ul className="awards-list">
                        <li>Culinary Excellence Award – 2022</li>
                        <li>Restaurant of the Year – 2023</li>
                        <li>Best Fine Dining Experience – Foodie Magazine, 2023</li>
                    </ul>
                </div>

                <div className="gallery-sec">
                    <h2>What Our Guests Say</h2>
                    <blockquote>"Exceptional ambiance and unforgettable flavors." — Gourmet Review</blockquote>
                    <blockquote>"A must-visit restaurant for food enthusiasts." — The Daily Bite</blockquote>
                </div>
            </div>

            {idx !== null && (
                <div className="lb-backdrop" onClick={close} role="dialog" aria-modal="true" aria-label="Image lightbox">
                    <div className="lb-wrap" onClick={e => e.stopPropagation()}>
                        <button className="lb-close" onClick={close} aria-label="Close">✕</button>
                        <img src={IMAGES[idx].src} alt={IMAGES[idx].alt} />
                        <button className="lb-btn lb-prev" onClick={prev} aria-label="Previous">‹</button>
                        <button className="lb-btn lb-next" onClick={next} aria-label="Next">›</button>
                    </div>
                </div>
            )}
        </main>
    );
}