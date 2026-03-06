export default function EmailStep({ email, onChange, onSubmit, loading = false }) {
    return (
        <div className="res-email-step">
            <p className="res-email-step-intro">
                Enter your email to get started. We'll look up your details automatically if you've dined with us before.
            </p>
            <form className="res-form" onSubmit={onSubmit} noValidate>
                <div className="field">
                    <label htmlFor="res-email">Email Address</label>
                    <input
                        id="res-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={onChange}
                        autoComplete="email"
                        required
                    />
                    <span className="field-hint">
                        We'll use this to manage your reservation
                    </span>
                </div>
                <button
                    type="submit"
                    className={`res-submit${loading ? " disabled" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Checking…" : "Continue →"}
                </button>
            </form>
        </div>
    );
}