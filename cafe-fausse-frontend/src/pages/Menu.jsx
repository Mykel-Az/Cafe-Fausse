import React, { useState } from "react";

const MENU = {
  Starters: [
    {
      name: "Bruschetta",
      price: "$8.50",
      desc: "Fresh tomatoes, basil, olive oil on toasted baguette",
      img: "/Menu_img/starters_img/Bruschetta.png",
    },
    {
      name: "Caesar Salad",
      price: "$9.00",
      desc: "Crisp romaine with homemade Caesar dressing",
      img: "/Menu_img/starters_img/Caesar-Salad.png",
    },
  ],
  Mains: [
    {
      name: "Grilled Salmon",
      price: "$22.00",
      desc: "Lemon butter sauce and seasonal vegetables",
      img: "/Menu_img/mains_img/Grilled-Salmon.png",
      imgAlt: "Grilled salmon",
    },
    {
      name: "Ribeye Steak",
      price: "$28.00",
      desc: "12 oz prime cut with garlic mashed potatoes",
      img: "/gallery-ribeye-steak.webp",
      imgAlt: "Ribeye steak",
    },
    {
      name: "Vegetable Risotto",
      price: "$18.00",
      desc: "Creamy Arborio rice with wild mushrooms",
      img: "/Menu_img/mains_img/Vegetable-Risotto.png",
      imgAlt: "Vegetable risotto",
    },
  ],
  Desserts: [
    {
      name: "Tiramisu",
      price: "$7.50",
      desc: "Classic Italian dessert with mascarpone",
      img: "/Menu_img/desserts_img/Tiramisu.png",
    },
    {
      name: "Cheesecake",
      price: "$7.00",
      desc: "Creamy cheesecake with berry compote",
      img: "/Menu_img/desserts_img/Cheesecake.png",
    },
  ],
  Beverages: [
    {
      name: "Red Wine (Glass)",
      price: "$10.00",
      desc: "Chef's curated selection",
      img: "/Menu_img/beverages_img/Red-Wine.png",
    },
    {
      name: "White Wine (Glass)",
      price: "$9.00",
      desc: "Crisp and refreshing",
      img: "/Menu_img/beverages_img/White-Wine.png",
    },
    {
      name: "Craft Beer",
      price: "$6.00",
      desc: "Locally brewed selection",
      img: "/Menu_img/beverages_img/Craft-Beer.png",
    },
    {
      name: "Espresso",
      price: "$3.00",
      desc: "Rich, bold Italian espresso",
      img: "/Menu_img/beverages_img/Espresso.png",
    },
  ],
};

const TABS = Object.keys(MENU);

export default function Menu() {
  const [active, setActive] = useState("Starters");

  return (
    <main id="main" className="has-hero">
      {/* Page hero */}
      <div className="page-hero" aria-hidden="true">
        <div
          className="page-hero-bg"
          style={{
            backgroundImage: "url('/gallery_img/Grand-Dining-Hall.png')",
          }}
        />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Café Fausse</span>
          <h1 className="page-hero-title">Our Menu</h1>
        </div>
      </div>

      <div className="page-container">
        <div className="sec-head centered">
          <span className="eyebrow">Thoughtfully Crafted</span>
          <h2>Seasonal ingredients, refined technique.</h2>
          <span className="sec-rule" />
        </div>

        <div className="menu-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              className={`menu-tab${active === t ? " active" : ""}`}
              aria-selected={active === t}
              onClick={() => setActive(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="menu-list">
          {MENU[active].map((item) => (
            <div key={item.name} className="menu-row">
              <div className="menu-row-left">
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.imgAlt || item.name}
                    className="menu-row-img"
                    loading="lazy"
                    width={72}
                    height={72}
                  />
                )}
                <div>
                  <div className="menu-row-name">{item.name}</div>
                  <p className="menu-row-desc">{item.desc}</p>
                </div>
              </div>
              <div className="menu-row-price">{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
