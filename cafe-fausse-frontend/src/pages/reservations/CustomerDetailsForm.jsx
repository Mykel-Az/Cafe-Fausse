const GUEST_OPTIONS = [1, 2, 3, 4, 5];

/** Convert "18:00" → "6:00 PM", "09:30" → "9:30 AM" */
function to12hr(time24) {
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour   = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function CustomerDetailsForm({
    formData,
    isExistingCustomer,
    completeProfile,
    handleChange,
    handleDateChange,
    handleSubmit,
    handleBack,
    handleChangeEmail,
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

    const today      = new Date().toISOString().split("T")[0];
    const maxDate    = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    const showTimeSlots = formData.date && !dateError && (loadingSlots || allSlots.length > 0);
    const showGuests    = formData.date && !dateError && formData.time;

    return (
        <form className="res-form" onSubmit={handleSubmit} noValidate>

            {/* Email pill */}
            <div className="res-email-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{formData.email}</span>
                <button type="button" className="res-email-pill-change" onClick={handleChangeEmail || handleBack} aria-label="Change email">
                    Change
                </button>
            </div>

            {/* Name + phone — new or incomplete customers only */}
            {(!isExistingCustomer || !completeProfile) && (
                <div className="res-form-section">
                    <span className="res-form-section-label">Your Details</span>
                    <div className="field">
                        <label htmlFor="res-name">Full Name</label>
                        <input id="res-name" type="text" name="name"
                            placeholder="e.g. Jane Smith"
                            value={formData.name} onChange={handleChange}
                            autoComplete="name" required />
                    </div>
                    <div className="field">
                        <label htmlFor="res-phone">Phone Number</label>
                        <input id="res-phone" type="tel" name="phone"
                            placeholder="e.g. (202) 555-0100"
                            value={formData.phone} onChange={handleChange}
                            autoComplete="tel" />
                        <span className="field-hint">Optional — helpful if we need to reach you</span>
                    </div>
                </div>
            )}

            {/* Date */}
            <div className="res-form-section">
                <span className="res-form-section-label">Date &amp; Time</span>
                <div className="field">
                    <label htmlFor="res-date">Date</label>
                    <input id="res-date" type="date" name="date"
                        value={formData.date} onChange={handleDateChange}
                        min={today} max={maxDateStr} required
                        className={dateError ? "field-input-error" : ""} />
                    {dateError && <span className="field-error" role="alert">{dateError}</span>}
                    {!dateError && <span className="field-hint">Bookings available up to 60 days in advance</span>}
                </div>

                {/* Time slots — revealed after date */}
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
                                        <button key={slot.time} type="button"
                                            disabled={!slot.available}
                                            onClick={() => selectTime(slot.time)}
                                            className={[
                                                "time-slot-btn",
                                                formData.time === slot.time ? "selected" : "",
                                                !slot.available ? "booked" : ""
                                            ].filter(Boolean).join(" ")}
                                            aria-pressed={formData.time === slot.time}
                                            aria-label={`${to12hr(slot.time)}${!slot.available ? " — fully booked" : ""}`}
                                        >
                                            {to12hr(slot.time)}
                                        </button>
                                    ))}
                                </div>
                                <span className="field-hint">
                                    Strikethrough slots are fully booked — each reservation blocks 2 hours
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Guest count — revealed after time */}
            {showGuests && (
                <div className="res-form-section">
                    <span className="res-form-section-label">Party Size</span>
                    <div className="field">
                        <div className="guest-grid" role="group" aria-label="Number of guests">
                            {GUEST_OPTIONS.map(num => (
                                <button key={num} type="button"
                                    onClick={() => selectGuests(num)}
                                    className={["guest-btn", Number(formData.guests) === num ? "selected" : ""].filter(Boolean).join(" ")}
                                    aria-pressed={Number(formData.guests) === num}
                                    aria-label={`${num} guest${num > 1 ? "s" : ""}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <span className="field-hint">Maximum 5 guests — call us for larger groups</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="res-form-actions">
                <button type="button" className="res-back-btn" onClick={handleBack} aria-label="Go back">
                    ← Back
                </button>
                <button type="submit"
                    className={`res-submit${!canSubmit ? " disabled" : ""}`}
                    disabled={!canSubmit}
                    title={!canSubmit ? "Please fill in all required fields" : undefined}
                >
                    Confirm Reservation
                </button>
            </div>

        </form>
    );
}