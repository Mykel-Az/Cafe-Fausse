import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../services/api";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email.includes("@")) {
            setMessage("Please enter a valid email address.");
            return;
        }

        try {
            const response = await apiFetch("/newsletter-signup", {
                method: "POST",
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage("Thank you for subscribing!");
            } else {
                const data = await response.json();
                setMessage(data.error || "Failed to sign up. Please try again.");
            }
        } catch (error) {
            console.error("Newsletter signup error:", error);
            setMessage("An error occurred. Please try again.");
        }

        setEmail("");
    }

    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-top">

                    {/* Brand */}
                    <div className="footer-brand">
                        <h3>Café Fausse</h3>
                        <span className="tagline">Fine dining · Timeless taste</span>
                        <address>
                            <a href="tel:+12025554567">(202) 555-4567</a><br />
                            1234 Culinary Ave, Suite 100<br />
                            Washington, DC 20002<br /><br />
                            Mon – Sat &nbsp;5 PM – 11 PM<br />
                            Sunday &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 PM – 9 PM
                        </address>
                        <div className="footer-social" aria-label="Social media">
                            <a href="#" aria-label="Instagram">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <rect x="2" y="2" width="20" height="20" rx="5" />
                                    <circle cx="12" cy="12" r="5" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Facebook">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="TripAdvisor">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <circle cx="6.5" cy="15" r="3" />
                                    <circle cx="17.5" cy="15" r="3" />
                                    <path d="M12 8C8.7 8 5.8 9.4 3.7 11.6L12 8zm0 0c3.3 0 6.2 1.4 8.3 3.6L12 8z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <nav className="footer-nav" aria-label="Footer navigation">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/menu">Menu</Link></li>
                            <li><Link to="/reservations">Reservations</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/gallery">Gallery</Link></li>
                        </ul>
                    </nav>

                    {/* Newsletter */}
                    <div className="footer-nl">
                        <h4>Newsletter</h4>
                        <p>Seasonal menus, special events, and exclusive offers.</p>
                        <form onSubmit={handleSubmit} className="footer-form">
                            <label htmlFor="footer-email" className="sr-only">Email address</label>
                            <input
                                id="footer-email"
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                            <button type="submit">Subscribe</button>
                        </form>
                        {message && <p className="footer-msg" role="status">{message}</p>}
                    </div>

                </div>

                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} Café Fausse. All rights reserved.</span>
                    <span>1234 Culinary Ave, Washington, DC</span>
                </div>
            </div>
        </footer>
    );
}