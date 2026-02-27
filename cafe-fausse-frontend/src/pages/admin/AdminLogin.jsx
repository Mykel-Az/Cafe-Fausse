import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/adminService";

export default function AdminLogin() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(form.username, form.password);
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-brand">
                    <span className="admin-login-eyebrow">Staff Portal</span>
                    <h1>Café Fausse</h1>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
                    <div className="field">
                        <label htmlFor="al-username">Username</label>
                        <input
                            id="al-username" type="text" name="username"
                            value={form.username} onChange={handleChange}
                            autoComplete="username" required autoFocus
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="al-password">Password</label>
                        <input
                            id="al-password" type="password" name="password"
                            value={form.password} onChange={handleChange}
                            autoComplete="current-password" required
                        />
                    </div>

                    {error && <p className="res-error" role="alert">{error}</p>}

                    <button
                        type="submit"
                        className={`res-submit${loading ? " disabled" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}