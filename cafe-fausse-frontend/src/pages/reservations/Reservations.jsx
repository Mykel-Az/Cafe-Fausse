import ActiveReservations from "./ActiveReservation";
import ReservationConfirmation from "./ReservationConfirmation";
import EmailStep from "./EmailStep";
import CustomerDetailsForm from "./CustomerDetailsForm";
import { useReservationFlow } from "../../hooks/useReservationFlow";

export default function Reservations() {
    const {
        formData, step, isExistingCustomer, completeProfile,
        message, loadingSlots, confirmation, activeReservations,
        showReservationOptions, allSlots,
        handleChange, handleEmailCheck, handleDateChange, handleSubmit,
        openReservation, cancelReservation, handleNewReservation,
        setStep, setShowReservationOptions, startEditing
    } = useReservationFlow();

    return (
        <main id="main">
            <div className="page-container">
                <div className="res-page">
                    <div className="sec-head centered" style={{ marginBottom: "40px" }}>
                        <span className="eyebrow">Dining</span>
                        <h1>Make a Reservation</h1>
                        <span className="sec-rule" />
                    </div>

                    {!confirmation && !showReservationOptions && (
                        <>
                            {step === 1 && (
                                <EmailStep email={formData.email} onChange={handleChange} onSubmit={handleEmailCheck} />
                            )}
                            {step === 2 && (
                                <CustomerDetailsForm
                                    formData={formData}
                                    isExistingCustomer={isExistingCustomer}
                                    completeProfile={completeProfile}
                                    handleChange={handleChange}
                                    handleDateChange={handleDateChange}
                                    handleSubmit={handleSubmit}
                                    loadingSlots={loadingSlots}
                                    allSlots={allSlots}
                                />
                            )}
                        </>
                    )}

                    {showReservationOptions && (
                        <ActiveReservations
                            activeReservations={activeReservations}
                            openReservation={openReservation}
                            cancelReservation={cancelReservation}
                            startEditing={startEditing}
                            onCreateNew={() => { setShowReservationOptions(false); setStep(2); }}
                        />
                    )}

                    {confirmation && (
                        <ReservationConfirmation confirmation={confirmation} onNewReservation={handleNewReservation} />
                    )}

                    {message && <p className="res-error" role="alert" style={{ marginTop: "16px" }}>{message}</p>}
                </div>
            </div>
        </main>
    );
}