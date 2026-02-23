import React from "react"

export default function Menu(){
    return (
        <>
        <section className="menu-header">
            <h1>Our Menu</h1>
            <p>Thoughtfully crafted dishes using the finest ingredients.</p>
        </section>

        <section className="menu-category">
            <h2>Starters</h2>

            <div className="menu-item">
            <span>Bruschetta</span>
            <span>$8.50</span>
            </div>
            <p className="menu-description">
            Fresh tomatoes, basil, olive oil, and toasted baguette slices
            </p>

            <div className="menu-item">
            <span>Caesar Salad</span>
            <span>$9.00</span>
            </div>
            <p className="menu-description">
            Crisp romaine with homemade Caesar dressing
            </p>
        </section>

        <section className="menu-category">
            <h2>Main Courses</h2>

            <div className="menu-item">
            <span>Grilled Salmon</span>
            <span>$22.00</span>
            </div>
            <p className="menu-description">
            Served with lemon butter sauce and seasonal vegetables
            </p>

            <div className="menu-item">
            <span>Ribeye Steak</span>
            <span>$28.00</span>
            </div>
            <p className="menu-description">
            12 oz prime cut with garlic mashed potatoes
            </p>

            <div className="menu-item">
            <span>Vegetable Risotto</span>
            <span>$18.00</span>
            </div>
            <p className="menu-description">
            Creamy Arborio rice with wild mushrooms
            </p>
        </section>

        <section className="menu-category">
            <h2>Desserts</h2>

            <div className="menu-item">
            <span>Tiramisu</span>
            <span>$7.50</span>
            </div>
            <p className="menu-description">
            Classic Italian dessert with mascarpone
            </p>

            <div className="menu-item">
            <span>Cheesecake</span>
            <span>$7.00</span>
            </div>
            <p className="menu-description">
            Creamy cheesecake with berry compote
            </p>
        </section>

        <section className="menu-category">
            <h2>Beverages</h2>

            <div className="menu-item">
            <span>Red Wine (Glass)</span>
            <span>$10.00</span>
            </div>

            <div className="menu-item">
            <span>White Wine (Glass)</span>
            <span>$9.00</span>
            </div>

            <div className="menu-item">
            <span>Craft Beer</span>
            <span>$6.00</span>
            </div>

            <div className="menu-item">
            <span>Espresso</span>
            <span>$3.00</span>
            </div>
        </section>
        </>
    );
}