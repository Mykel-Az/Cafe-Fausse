import { useState } from "react";
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
        const num    = i + 1;
        const active = num === step;
        const done   = num < step;
        return (
          <div key={label} className="res-step-item">
            <div className={`res-step-circle${active ? " active" : done ? " done" : ""}`}>
              {done ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : <span>{num}</span>}
            </div>
            {/* Always show active label; show others only on wider screens via CSS */}
            <span className={`res-step-label${active ? " active always-show" : ""}`}>{label}</span>
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
    loadingEmail,
    selectedReservation,
    editingReservationId,

    handleChange,
    handleBack,
    handleEmailCheck,
    handleDateChange,
    handleSubmit,
    openReservation,
    cancelReservation,
    handleNewReservation,
    handleChangeEmail,
    goToReservations,
    setStep,
    setShowReservationOptions,
    setCameFromExplorer,
    startEditing,
  } = useReservationFlow();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const showStepper = !confirmation && !showReservationOptions;



  return (
    <main id="main" className="has-hero">
      <div className="page-hero" aria-hidden="true">
        <div className="page-hero-bg"
          style={{ backgroundImage: "url('/gallery_img/Formal-Private-Dinner Event.png')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Dining</span>
          <h1 className="page-hero-title">Make a Reservation</h1>
        </div>
      </div>

      <div className="page-container">
        <div className="res-page">
          {showStepper && <StepIndicator step={step} />}

          {/* Step 1 */}
          {!confirmation && !showReservationOptions && step === 1 && (
            <EmailStep
              email={formData.email}
              onChange={handleChange}
              onSubmit={handleEmailCheck}
              loading={loadingEmail}
            />
          )}

          {/* Step 2 */}
          {!confirmation && !showReservationOptions && step === 2 && (
            <>
              {/* Update details bar — only for returning complete-profile customers on a NEW reservation */}
              {isExistingCustomer && completeProfile && !editingReservationId && (
                <div className="res-edit-profile-bar">
                  <div className="res-edit-profile-bar-left">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="res-edit-profile-hint">
                      Welcome back — your details are on file.
                    </span>
                  </div>
                  <button type="button" className="res-edit-profile-btn"
                    onClick={() => setShowEditProfile(v => !v)}>
                    {showEditProfile ? "Hide" : "Update Details"}
                  </button>
                </div>
              )}

              {isExistingCustomer && completeProfile && !editingReservationId && showEditProfile && (
                <div className="res-edit-profile-form">
                  <p className="res-edit-profile-onfile">
                    Editing below will update your saved details when you confirm this reservation.
                  </p>
                  <div className="field">
                    <label htmlFor="ep-name">Full Name</label>
                    <input id="ep-name" type="text" name="name" value={formData.name}
                      onChange={handleChange} autoComplete="name" placeholder="Your full name" />
                  </div>
                  <div className="field">
                    <label htmlFor="ep-phone">Phone Number</label>
                    <input id="ep-phone" type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} autoComplete="tel" placeholder="e.g. (202) 555-0100" />
                  </div>
                </div>
              )}

              <CustomerDetailsForm
                formData={formData}
                isExistingCustomer={isExistingCustomer}
                completeProfile={completeProfile}
                handleChange={handleChange}
                handleDateChange={handleDateChange}
                handleSubmit={handleSubmit}
                handleBack={handleBack}
                handleChangeEmail={handleChangeEmail}
                loadingSlots={loadingSlots}
                allSlots={allSlots}
                dateError={dateError}
                canSubmit={canSubmit}
              />
            </>
          )}

          {/* Active reservations */}
          {showReservationOptions && (
            <ActiveReservations
              activeReservations={activeReservations}
              selectedReservation={selectedReservation}
              openReservation={openReservation}
              cancelReservation={cancelReservation}
              startEditing={startEditing}
              onCreateNew={() => { setShowReservationOptions(false); setCameFromExplorer(true); setStep(2); }}
              onBack={handleBack}
            />
          )}

          {/* Post-booking confirmation */}
          {confirmation && !showReservationOptions && (
            <ReservationConfirmation
              confirmation={confirmation}
              onNewReservation={handleNewReservation}
              onViewReservations={goToReservations}
            />
          )}

          {message && (
            <p className="res-error" role="alert" style={{ marginTop: "16px" }}>{message}</p>
          )}
        </div>
      </div>
    </main>
  );
}