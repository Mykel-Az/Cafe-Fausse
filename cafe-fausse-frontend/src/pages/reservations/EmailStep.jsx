export default function EmailStep({ email, onChange, onSubmit }) {
    return (
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
                    We'll use this to look up or create your account
                </span>
            </div>
            <button type="submit" className="res-submit">Continue →</button>
        </form>
    );
}