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
    return (
        <form className="reservation-form" onSubmit={handleSubmit}>
            {(!isExistingCustomer || !completeProfile) && (
                <>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </>
            )}

            <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleDateChange}
            />

            {loadingSlots && <p>Checking availability...</p>}

            {allSlots.length > 0 && (
                <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                >
                    <option value="">Select a time slot</option>
                    {allSlots.map((slot) => (
                        <option
                            key={slot.time}
                            value={slot.time}
                            disabled={!slot.available}
                        >
                            {slot.time} {slot.available ? "" : "(Fully Booked)"}
                        </option>
                    ))}
                </select>
            )}

            {formData.date && (
                <input
                    type="number"
                    name="guests"
                    placeholder="Number of Guests"
                    value={formData.guests}
                    onChange={handleChange}
                />
            )}

            <button type="submit">Next</button>
        </form>
    );
}