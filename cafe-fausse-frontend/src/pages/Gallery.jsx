import React, { useState, useEffect, useCallback } from "react";

const IMAGES = [
  {
    src: "/gallery_img/Grand-Dining-Hall.png",
    alt: "Bright luxury grand dining hall with chandeliers",
    label: "Interior Ambiance",
    group: "Interior Ambiance",
  },
  {
    src: "/gallery_img/Chandelier-Ceiling-Detail.png",
    alt: "Crystal chandelier hanging from ornate carved ceiling",
    label: "Chandelier Detail",
    group: "Interior Ambiance",
  },
  {
    src: "/gallery-cafe-interior.webp",
    alt: "Elegant dining room",
    label: "Dining Room",
    group: "Interior Ambiance",
  },

  {
    src: "/gallery_img/Formal-Private-Dinner Event.png",
    alt: "Formal private dinner event in luxury hall",
    label: "Private Dinner",
    group: "Special Events",
  },
  {
    src: "/gallery_img/Wedding-Reception.png",
    alt: "Elegant daytime wedding reception",
    label: "Wedding Reception",
    group: "Special Events",
  },
  {
    src: "/gallery_img/Wine-Pairing-Event.png",
    alt: "Afternoon wine pairing event",
    label: "Wine Pairing",
    group: "Special Events",
  },
  {
    src: "/gallery-special-event.webp",
    alt: "Special event evening at Café Fausse",
    label: "Special Event",
    group: "Special Events",
  },

  {
    src: "/gallery_img/Chef-Plating-in-Elegant-Kitchen.png",
    alt: "Chef carefully plating gourmet dish",
    label: "Chef at Work",
    group: "Behind the Scenes",
  },
  {
    src: "/gallery_img/Dessert-Finishing-Touch.png",
    alt: "Pastry chef adding final garnish to plated dessert",
    label: "Dessert Detail",
    group: "Behind the Scenes",
  },
  {
    src: "/gallery_img/Floral-Arrangement-Prep.png",
    alt: "Staff arranging floral centerpiece in sunlit dining hall",
    label: "Table Prep",
    group: "Behind the Scenes",
  },

  {
    src: "/gallery-ribeye-steak.webp",
    alt: "Signature ribeye steak, beautifully plated",
    label: "Ribeye Steak",
    group: "Cuisine",
  },
  {
    src: "/Menu_img/mains_img/Grilled-Salmon.png",
    alt: "Grilled salmon with seasonal vegetables",
    label: "Grilled Salmon",
    group: "Cuisine",
  },
  {
    src: "/Menu_img/desserts_img/Tiramisu.png",
    alt: "Classic tiramisu",
    label: "Tiramisu",
    group: "Cuisine",
  },
  {
    src: "/Menu_img/desserts_img/Cheesecake.png",
    alt: "Cheesecake with berry compote",
    label: "Cheesecake",
    group: "Cuisine",
  },
];

const GROUPS = ["All", ...Array.from(new Set(IMAGES.map((img) => img.group)))];

export default function Gallery() {
  const [idx, setIdx] = useState(null);
  const [activeGroup, setActiveGroup] = useState("All");

  const filtered =
    activeGroup === "All"
      ? IMAGES
      : IMAGES.filter((img) => img.group === activeGroup);

  const prev = useCallback(
    () => setIdx((i) => (i - 1 + filtered.length) % filtered.length),
    [filtered.length],
  );
  const next = useCallback(
    () => setIdx((i) => (i + 1) % filtered.length),
    [filtered.length],
  );
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
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [idx, prev, next]);

  const handleGroupChange = (group) => {
    setIdx(null);
    setActiveGroup(group);
  };

  return (
    <main id="main" className="has-hero">
      {/* Page hero */}
      <div className="page-hero" aria-hidden="true">
        <div
          className="page-hero-bg"
          style={{
            backgroundImage:
              "url('/gallery_img/Chandelier-Ceiling-Detail.png')",
          }}
        />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Gallery</span>
          <h1 className="page-hero-title">A Glimpse Inside</h1>
        </div>
      </div>

      <div className="page-container">
        {/* Category filter tabs */}
        <div
          className="menu-tabs"
          role="tablist"
          aria-label="Gallery categories"
          style={{ marginBottom: "32px" }}
        >
          {GROUPS.map((g) => (
            <button
              key={g}
              role="tab"
              className={`menu-tab${activeGroup === g ? " active" : ""}`}
              aria-selected={activeGroup === g}
              onClick={() => handleGroupChange(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="gallery-sec">
          <div className="gallery-grid">
            {filtered.map((img, i) => (
              <button
                key={img.src}
                className="gallery-thumb"
                onClick={() => setIdx(i)}
                aria-label={`View ${img.label}`}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-overlay">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
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
          <blockquote>
            "Exceptional ambiance and unforgettable flavors." — Gourmet Review
          </blockquote>
          <blockquote>
            "A must-visit restaurant for food enthusiasts." — The Daily Bite
          </blockquote>
        </div>
      </div>

      {idx !== null && (
        <div
          className="lb-backdrop"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div className="lb-wrap" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={close} aria-label="Close">
              ✕
            </button>
            <img src={filtered[idx].src} alt={filtered[idx].alt} />
            <button
              className="lb-btn lb-prev"
              onClick={prev}
              aria-label="Previous"
            >
              ‹
            </button>
            <button className="lb-btn lb-next" onClick={next} aria-label="Next">
              ›
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
