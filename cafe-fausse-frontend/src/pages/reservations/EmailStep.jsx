export default function EmailStep({ email, onChange, onSubmit }) {
    return (
        <form className="res-form" onSubmit={onSubmit}>
            <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={onChange}
                    autoComplete="email"
                    required
                />
            </div>
            <button type="submit" className="res-submit">Continue</button>
        </form>
    );
}