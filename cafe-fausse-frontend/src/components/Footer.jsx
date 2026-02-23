import { useState } from "react";

export default function Footer(){
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e){
        e.preventDefault();

        if (!email.includes("@")){
            setMessage("Please enter a valid Email Address")
            return;
        }

        console.log("email:", email)

        try {
            const newsletterReponse = await fetch('http://localhost:5000/newsletter-signup', {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({email: email})
            });

            if (newsletterReponse.ok) {
                setMessage("Thank You for subscribing!")
            } else {
                setMessage("Failed to signup for newsletter");
            }
        } catch(error) {
            console.error("Error signing up for newsletter:", error);
            setMessage("An error occurred while signing-up, please try again")
        }
        console.log(email)
        setEmail("")
    }

    return(
        <footer className="footer">
            <div className="footer-content">
                <div>
                <h3>Café Fausse</h3>
                <p>Fine dining. Timeless taste.</p>
                </div>

                <div>
                <h4>Newsletter</h4>
                <form onSubmit={handleSubmit} className="footer-form">
                    <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit">Subscribe</button>
                </form>
                {message && <p className="footer-message">{message}</p>}
                </div>
            </div>
        </footer>
    )
}