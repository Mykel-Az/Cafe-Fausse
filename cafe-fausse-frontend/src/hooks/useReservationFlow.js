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
    const [message, setMessage] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [fullyBookedSlots, setFullyBookedSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const [activeReservations, setActiveReservations] = useState([]);
    const [showReservationOptions, setShowReservationOptions] = useState(false);
    const [editingReservationId, setEditingReservationId] = useState(null);

    const allSlots = useMemo(() => {
        return [
            ...availableSlots.map(slot => ({ time: slot, available: true })),
            ...fullyBookedSlots.map(slot => ({ time: slot, available: false }))
        ].sort((a, b) => a.time.localeCompare(b.time));
    }, [availableSlots, fullyBookedSlots]);

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
        setAvailableSlots([]);
        setFullyBookedSlots([]);
        setMessage("");
        setEditingReservationId(null);
    }

    async function fetchAvailability(date) {
        if (!date) return;

        setLoadingSlots(true);
        setMessage("");

        try {
            const data = await getAvailability(date);
            setAvailableSlots(data.time_slots.available_slots);
            setFullyBookedSlots(data.time_slots.fully_booked_slots);
        } catch (error) {
            setMessage(error.message || "An error occurred while fetching available time slots.");
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

        await fetchAvailability(date);
    }

    async function handleEmailCheck(e) {
        e.preventDefault();
        setMessage("");

        if (!formData.email) {
            setMessage("Please enter a valid email address");
            return;
        }

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
        }
    }

    async function handleDateChange(e) {
        const selectedDate = e.target.value;
        setFormData(prev => ({ ...prev, date: selectedDate, time: "" }));
        await fetchAvailability(selectedDate);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        let id = customerId;

        try {
            if (!isExistingCustomer) {
                const response = await createCustomer(formData.name, formData.email, formData.phone);
                id = response.customer.id;
                setCustomerId(id);
            }

            if (isExistingCustomer && !completeProfile) {
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

    async function openReservation(reservationId) {
        try {
            const data = await getReservationById(reservationId);
            setConfirmation(data.reservation);
        } catch (error) {
            setMessage(error.message || "Server error. Please try again.");
        }
    }

    async function cancelReservation(reservationId) {
        try {
            await cancelReservationById(reservationId);
            const updated = activeReservations.filter(r => r.id !== reservationId);
            setActiveReservations(updated);

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
        loadingSlots,
        confirmation,
        activeReservations,
        showReservationOptions,
        allSlots,
        editingReservationId,

        handleChange,
        handleEmailCheck,
        handleDateChange,
        handleSubmit,
        openReservation,
        cancelReservation,
        handleNewReservation,
        setStep,
        setShowReservationOptions,
        startEditing
    };
}