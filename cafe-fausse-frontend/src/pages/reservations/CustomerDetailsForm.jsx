export default function CustomerDetailsForm({
    formData,
    isExistingCustomer,
    completeProfile,
    handleChange,
    handleDateChange,
    handleSubmit,
    loadingSlots,
    allSlots
}) {
    // The hook's handleChange reads e.target.name and e.target.value,
    // so we dispatch a real synthetic-compatible object for time slot clicks
    function selectTime(time) {
        handleChange({ target: { name: "time", value: time } });
    }

    return (
        <form className="res-form" onSubmit={handleSubmit}>

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
                />
            </div>

            {/* Time slots — horizontal pill grid instead of dropdown */}
            {(loadingSlots || allSlots.length > 0) && (
                <div>
                    <span className="time-slots-label">Select a Time</span>

                    {loadingSlots ? (
                        <p className="time-slots-loading">Checking availability…</p>
                    ) : (
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
                    )}
                </div>
            )}

            {formData.date && (
                <div className="field">
                    <label htmlFor="res-guests">Number of Guests</label>
                    <input
                        id="res-guests"
                        type="number"
                        name="guests"
                        placeholder="e.g. 2"
                        min="1"
                        max="10"
                        value={formData.guests}
                        onChange={handleChange}
                    />
                </div>
            )}

            <button type="submit" className="res-submit">Continue</button>
        </form>
    );
}