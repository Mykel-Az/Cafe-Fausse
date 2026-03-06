import { useState, useMemo } from "react";
import {
    checkCustomer,
    getCustomerReservations,
    createCustomer,
    updateCustomer,
    createReservation,
    getAvailability,
    getReservationById,
    cancelReservationById,
    updateReservation
} from "../services/reservationService";

export function useReservationFlow() {

    const initialFormState = {
        name: "",
        email: "",
        phone: "",
        guests: "",
        date: "",
        time: "",
    };

    const [formData, setFormData] = useState(initialFormState);
    const [step, setStep] = useState(1);
    const [customerId, setCustomerId] = useState(null);
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);
    const [completeProfile, setCompleteProfile] = useState(false);
    const [message, setMessage] = useState("");         // general / submit errors
    const [dateError, setDateError] = useState("");     // inline error under the date field
    const [availableSlots, setAvailableSlots] = useState([]);
    const [fullyBookedSlots, setFullyBookedSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const [viewingReservation, setViewingReservation] = useState(false);
    const [activeReservations, setActiveReservations] = useState([]);
    const [showReservationOptions, setShowReservationOptions] = useState(false);
    const [editingReservationId, setEditingReservationId] = useState(null);

    const allSlots = useMemo(() => {
        return [
            ...availableSlots.map(slot => ({ time: slot, available: true })),
            ...fullyBookedSlots.map(slot => ({ time: slot, available: false }))
        ].sort((a, b) => a.time.localeCompare(b.time));
    }, [availableSlots, fullyBookedSlots]);

    // True only when every required field is filled and there are no blocking errors
    const canSubmit = !!(
        formData.date &&
        formData.time &&
        formData.guests &&
        !dateError &&
        !loadingSlots &&
        (isExistingCustomer && completeProfile ? true : formData.name)
    );

    function handleChange(e) {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    function handleNewReservation() {
        setConfirmation(null);
        setFormData(initialFormState);
        setStep(1);
        setCustomerId(null);
        setIsExistingCustomer(false);
        setCompleteProfile(false);
        setActiveReservations([]);
        setShowReservationOptions(false);
        setViewingReservation(false);
        setAvailableSlots([]);
        setFullyBookedSlots([]);
        setMessage("");
        setDateError("");
        setEditingReservationId(null);
    }

    function handleBack() {
        setViewingReservation(false);
        setShowReservationOptions(false);
        setSelectedReservation(null);
        setStep(1);
        setMessage("");
        setDateError("");
        setCustomerId(null);
        setIsExistingCustomer(false);
        setCompleteProfile(false);
        setActiveReservations([]);
        setAvailableSlots([]);
        setFullyBookedSlots([]);
        setEditingReservationId(null);
        setFormData(initialFormState);
    }

    async function fetchAvailability(date, id = customerId, reservationId = null) {
        if (!date) return;

        setLoadingSlots(true);
        setDateError("");
        setAvailableSlots([]);
        setFullyBookedSlots([]);

        try {
            const data = await getAvailability(date, id, reservationId);
            setAvailableSlots(data.time_slots.available_slots);
            setFullyBookedSlots(data.time_slots.fully_booked_slots);
        } catch (error) {
            // Show inline under the date field — keeps the error close to what caused it
            setDateError(error.message || "Could not load availability for this date.");
        } finally {
            setLoadingSlots(false);
        }
    }

    async function startEditing(reservation) {
        const date = reservation.time_slot.split("T")[0];
        const time = reservation.time_slot.split("T")[1].slice(0, 5);

        setEditingReservationId(reservation.id);
        setFormData(prev => ({
            ...prev,
            guests: reservation.guest_count,
            date,
            time
        }));
        setShowReservationOptions(false);
        setStep(2);

        await fetchAvailability(date, customerId, reservation.id);
    }

    async function handleEmailCheck(e) {
        e.preventDefault();
        setMessage("");

        if (!formData.email) {
            setMessage("Please enter a valid email address");
            return;
        }

        setLoadingEmail(true);
        try {
            const data = await checkCustomer(formData.email);

            if (!data.exists) {
                setIsExistingCustomer(false);
                setCompleteProfile(false);
                setStep(2);
                return;
            }

            setCustomerId(data.customer_id);
            setIsExistingCustomer(true);
            setCompleteProfile(data.profile_complete);

            // Pre-fill name/phone from the customer record so "Update My Details"
            // shows what is currently on file rather than blank fields
            setFormData(prev => ({
                ...prev,
                name: data.name || "",
                phone: data.phone || "",
            }));

            if (!data.profile_complete) {
                setStep(2);
                return;
            }

            const resData = await getCustomerReservations(data.customer_id);

            if (resData.reservations.length > 0) {
                setActiveReservations(resData.reservations);
                setShowReservationOptions(true);
            } else {
                setStep(2);
            }

        } catch (error) {
            setMessage(error.message || "Server error. Please try again.");
        } finally {
            setLoadingEmail(false);
        }
    }

    async function handleDateChange(e) {
        const selectedDate = e.target.value;
        // Clear the time immediately when date changes
        setFormData(prev => ({ ...prev, date: selectedDate, time: "" }));
        await fetchAvailability(selectedDate, customerId, editingReservationId);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        if (!canSubmit) return;

        let id = customerId;

        try {
            if (!isExistingCustomer) {
                const response = await createCustomer(formData.name, formData.email, formData.phone);
                id = response.customer.id;
                setCustomerId(id);
            }

            // Save profile changes when creating a new reservation (not when editing)
            // Covers both: completing an incomplete profile AND updating an existing one
            if (isExistingCustomer && !editingReservationId) {
                await updateCustomer(id, formData.name, formData.phone);
            }

            let data;

            if (editingReservationId) {
                data = await updateReservation(
                    editingReservationId,
                    formData.date,
                    formData.time,
                    formData.guests
                );
            } else {
                data = await createReservation(
                    id,
                    formData.date,
                    formData.time,
                    formData.guests
                );
            }

            setConfirmation(data.reservation);
            setEditingReservationId(null);

        } catch (error) {
            setMessage(error.message || "An error occurred while submitting your reservation.");
        }
    }

    const [selectedReservation, setSelectedReservation] = useState(null);

    async function openReservation(reservationId) {
        if (!reservationId) { setSelectedReservation(null); return; }
        try {
            const data = await getReservationById(reservationId);
            setSelectedReservation(data.reservation);
        } catch (error) {
            setMessage(error.message || "Server error. Please try again.");
        }
    }

    async function goToReservations() {
        // Clear confirmation and go to explorer, refreshing the list first
        setConfirmation(null);
        setMessage("");
        try {
            const resData = await getCustomerReservations(customerId);
            setActiveReservations(resData.reservations);
        } catch (_) { /* keep existing list if refresh fails */ }
        setShowReservationOptions(true);
    }

    function closeViewedReservation() {
        setConfirmation(null);
        setViewingReservation(false);
        setShowReservationOptions(true);
    }

    async function cancelReservation(reservationId) {
        try {
            await cancelReservationById(reservationId);
            const updated = activeReservations.filter(r => r.id !== reservationId);
            setActiveReservations(updated);
            setSelectedReservation(prev => prev?.id === reservationId ? null : prev);

            if (updated.length === 0) {
                setShowReservationOptions(false);
                setStep(2);
            }
        } catch (error) {
            setMessage(error.message || "Server error. Please try again.");
        }
    }

    return {
        formData,
        step,
        isExistingCustomer,
        completeProfile,
        message,
        dateError,
        loadingSlots,
        loadingEmail,
        confirmation,
        activeReservations,
        showReservationOptions,
        allSlots,
        canSubmit,
        editingReservationId,
        viewingReservation,
        selectedReservation,

        handleChange,
        handleBack,
        handleEmailCheck,
        handleDateChange,
        handleSubmit,
        openReservation,
        cancelReservation,
        handleNewReservation,
        goToReservations,
        closeViewedReservation,
        setStep,
        setShowReservationOptions,
        startEditing
    };
}