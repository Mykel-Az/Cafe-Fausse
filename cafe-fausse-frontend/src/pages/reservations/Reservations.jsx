import ActiveReservations from "./ActiveReservation";
import ReservationConfirmation from "./ReservationConfirmation";
import EmailStep from "./EmailStep";
import CustomerDetailsForm from "./CustomerDetailsForm";
import { useReservationFlow } from "../../hooks/useReservationFlow";

function StepIndicator({ step }) {
    const steps = ["Your Email", "Details & Time"];
    return (
        <div className="res-steps" aria-label="Reservation progress">
            {steps.map((label, i) => {
                const num = i + 1;
                const active = num === step;
                const done = num < step;
                return (
                    <div key={label} className="res-step-item">
                        <div className={`res-step-circle${active ? " active" : done ? " done" : ""}`}>
                            {done ? (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <span>{num}</span>
                            )}
                        </div>
                        <span className={`res-step-label${active ? " active" : ""}`}>{label}</span>
                        {i < steps.length - 1 && <div className={`res-step-line${done ? " done" : ""}`} />}
                    </div>
                );
            })}
        </div>
    );
}

export default function Reservations() {
    const {
        formData,
        step,
        isExistingCustomer,
        completeProfile,
        message,
        dateError,
        loadingSlots,
        confirmation,
        activeReservations,
        showReservationOptions,
        allSlots,
        canSubmit,

        handleChange,
        handleBack,
        handleEmailCheck,
        handleDateChange,
        handleSubmit,
        openReservation,
        cancelReservation,
        handleNewReservation,
        setStep,
        setShowReservationOptions,
        startEditing
    } = useReservationFlow();

    const showStepper = !confirmation && !showReservationOptions;

    return (
        <main id="main" className="has-hero">
            {/* Page hero */}
            <div className="page-hero" aria-hidden="true">
                <div
                    className="page-hero-bg"
                    style={{ backgroundImage: "url('/src/assets/images/gallery_img/Formal-Private-Dinner Event.png')" }}
                />
                <div className="page-hero-overlay" />
                <div className="page-hero-content">
                    <span className="page-hero-eyebrow">Dining</span>
                    <h1 className="page-hero-title">Make a Reservation</h1>
                </div>
            </div>

            <div className="page-container">
                <div className="res-page">

                    {showStepper && <StepIndicator step={step} />}

                    {!confirmation && !showReservationOptions && (
                        <>
                            {step === 1 && (
                                <EmailStep
                                    email={formData.email}
                                    onChange={handleChange}
                                    onSubmit={handleEmailCheck}
                                />
                            )}

                            {step === 2 && (
                                <CustomerDetailsForm
                                    formData={formData}
                                    isExistingCustomer={isExistingCustomer}
                                    completeProfile={completeProfile}
                                    handleChange={handleChange}
                                    handleDateChange={handleDateChange}
                                    handleSubmit={handleSubmit}
                                    handleBack={handleBack}
                                    loadingSlots={loadingSlots}
                                    allSlots={allSlots}
                                    dateError={dateError}
                                    canSubmit={canSubmit}
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
                            onCreateNew={() => {
                                setShowReservationOptions(false);
                                setStep(2);
                            }}
                        />
                    )}

                    {confirmation && (
                        <ReservationConfirmation
                            confirmation={confirmation}
                            onNewReservation={handleNewReservation}
                        />
                    )}

                    {message && (
                        <p className="res-error" role="alert" style={{ marginTop: "16px" }}>
                            {message}
                        </p>
                    )}

                </div>
            </div>
        </main>
    );
}