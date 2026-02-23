export default function EmailStep({ email, onChange, onSubmit }) {
    return (
        <form className="reservation-form" onSubmit={onSubmit}>
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={onChange}
            />
            <button type="submit">Continue</button>
        </form>
    );
}