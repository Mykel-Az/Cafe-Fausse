const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function CustomerDetailsForm({
    formData,
    isExistingCustomer,
    completeProfile,
    handleChange,
    handleDateChange,
    handleSubmit,
    handleBack,
    loadingSlots,
    allSlots,
    dateError,
    canSubmit,
}) {
    function selectTime(time) {
        handleChange({ target: { name: "time", value: time } });
    }

    function selectGuests(num) {
        handleChange({ target: { name: "guests", value: num } });
    }

    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    const showTimeSlots = formData.date && !dateError && (loadingSlots || allSlots.length > 0);

    const showGuests = formData.date && !dateError && formData.time;

    return (
        <form className="res-form" onSubmit={handleSubmit} noValidate>

            <div className="res-email-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{formData.email}</span>
                <button
                    type="button"
                    className="res-email-pill-change"
                    onClick={handleBack}
                    aria-label="Change email address"
                >
                    Change
                </button>
            </div>

            {(!isExistingCustomer || !completeProfile) && (
                <>
                    <div className="field">
                        <label htmlFor="res-name">Full Name</label>
                        <input
                            id="res-name"
                            type="text"
                            name="name"
                            placeholder="e.g. Jane Smith"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="res-phone">Phone Number</label>
                        <input
                            id="res-phone"
                            type="tel"
                            name="phone"
                            placeholder="e.g. (202) 555-0100"
                            value={formData.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                        />
                        <span className="field-hint">Optional — helpful if we need to reach you</span>
                    </div>
                </>
            )}

            <div className="field">
                <label htmlFor="res-date">Date</label>
                <input
                    id="res-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    min={today}
                    max={maxDateStr}
                    required
                    className={dateError ? "field-input-error" : ""}
                />
                {dateError && (
                    <span className="field-error" role="alert">{dateError}</span>
                )}
                {!dateError && (
                    <span className="field-hint">Bookings available up to 60 days in advance</span>
                )}
            </div>

            {showTimeSlots && (
                <div className="field">
                    <span className="time-slots-label">Select a Time</span>
                    {loadingSlots ? (
                        <div className="time-slots-loading">
                            <span className="spinner" />
                            Checking availability…
                        </div>
                    ) : allSlots.length === 0 ? (
                        <p className="field-error" role="alert">
                            No available time slots for this date. Please choose another day.
                        </p>
                    ) : (
                        <>
                            <div className="time-slots-grid" role="group" aria-label="Available time slots">
                                {allSlots.map(slot => (
                                    <button
                                        key={slot.time}
                                        type="button"
                                        disabled={!slot.available}
                                        onClick={() => selectTime(slot.time)}
                                        className={[
                                            "time-slot-btn",
                                            formData.time === slot.time ? "selected" : "",
                                            !slot.available ? "booked" : ""
                                        ].filter(Boolean).join(" ")}
                                        aria-pressed={formData.time === slot.time}
                                        aria-label={`${slot.time}${!slot.available ? " — fully booked" : ""}`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                            <span className="field-hint">
                                Strikethrough slots are fully booked — each reservation blocks 1 hours
                            </span>
                        </>
                    )}
                </div>
            )}

            {showGuests && (
                <div className="field">
                    <span className="time-slots-label">Number of Guests</span>
                    <div className="guest-grid" role="group" aria-label="Number of guests">
                        {GUEST_OPTIONS.map(num => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => selectGuests(num)}
                                className={[
                                    "guest-btn",
                                    Number(formData.guests) === num ? "selected" : ""
                                ].filter(Boolean).join(" ")}
                                aria-pressed={Number(formData.guests) === num}
                                aria-label={`${num} guest${num > 1 ? "s" : ""}`}
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            type="button"
                            className={[
                                "guest-btn guest-btn-wide",
                                Number(formData.guests) > 10 ? "selected" : ""
                            ].filter(Boolean).join(" ")}
                            onClick={() => {
                                const n = window.prompt("Enter number of guests (max 30):");
                                if (n && !isNaN(n)) selectGuests(Number(n));
                            }}
                            aria-label="More than 10 guests"
                        >
                            10+
                        </button>
                    </div>
                    <span className="field-hint">Maximum 10 guests — call us for larger groups</span>
                </div>
            )}

           
            <div className="res-form-actions">
                <button
                    type="button"
                    className="res-back-btn"
                    onClick={handleBack}
                    aria-label="Go back to email step"
                >
                    ← Back
                </button>
                <button
                    type="submit"
                    className={`res-submit${!canSubmit ? " disabled" : ""}`}
                    disabled={!canSubmit}
                    aria-disabled={!canSubmit}
                    title={!canSubmit ? "Please fill in all required fields" : undefined}
                >
                    Confirm Reservation
                </button>
            </div>

        </form>
    );
}