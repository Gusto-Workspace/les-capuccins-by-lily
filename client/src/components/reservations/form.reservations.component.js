import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Loader2, ChevronDown } from "lucide-react";
import RevealOnScrollComponent from "../_shared/motion/reveal-on-scroll.component";
import SectionHeadingComponent from "../_shared/section-heading.component";
import {
  formatReservationDateForApi,
  getAvailableReservationTimes,
  getReservationTimeOptions,
  isReservationDateClosed,
  parseReservationDateValue,
} from "@/utils/reservations";
export default function FormReservationComponent({
  apiBaseUrl,
  restaurant,
  onBooked,
  dataLoading,
}) {
  const router = useRouter();
  const [reservationData, setReservationData] = useState({
    reservationDate: new Date(),
    reservationTime: "",
    numberOfGuests: "2",
    customerFirstName: "",
    customerLastName: "",
    customerEmail: "",
    customerPhone: "",
    commentary: "",
    table: "",
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [
    resolvedAvailabilitySelectionKey,
    setResolvedAvailabilitySelectionKey,
  ] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState({});
  const [reservationsList, setReservationsList] = useState([]);
  const [reservationsListLoading, setReservationsListLoading] = useState(false);
  const [hasAppliedQueryPrefill, setHasAppliedQueryPrefill] = useState(false);
  const [pendingPrefilledTime, setPendingPrefilledTime] = useState("");
  const parameters =
    restaurant?.reservationsSettings ||
    restaurant?.reservations?.parameters ||
    {};
  const manage = !!parameters.manage_disponibilities;
  const [idempotencyKey] = useState(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `resa_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  });
  const PENDING_BANK_HOLD_STORAGE_KEY = "gm_pending_bank_hold";
  const [pendingBankHoldReservation, setPendingBankHoldReservation] =
    useState(null);
  const [showPendingBankHoldModal, setShowPendingBankHoldModal] =
    useState(false);
  const [isCancelingPendingBankHold, setIsCancelingPendingBankHold] =
    useState(false);
  const fetchReservationsList = useCallback(async () => {
    if (!apiBaseUrl || !restaurant?._id) {
      setReservationsList([]);
      return [];
    }
    try {
      setReservationsListLoading(true);
      const res = await fetch(
        `${apiBaseUrl}/public/restaurants/${restaurant._id}/reservations`,
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.message || "Impossible de charger les réservations.",
        );
      }
      const nextReservations = Array.isArray(data?.reservations)
        ? data.reservations
        : [];
      setReservationsList(nextReservations);
      return nextReservations;
    } catch (error) {
      console.error("[fetchReservationsList]", error);
      setReservationsList([]);
      return [];
    } finally {
      setReservationsListLoading(false);
    }
  }, [apiBaseUrl, restaurant?._id]);
  useEffect(() => {
    setReservationData((prev) => ({ ...prev, table: manage ? "auto" : "" }));
  }, [manage]);

  useEffect(() => {
    fetchReservationsList();
  }, [fetchReservationsList]);

  useEffect(() => {
    if (!router.isReady || hasAppliedQueryPrefill) return;

    const nextDate = parseReservationDateValue(router.query.reservationDate);
    const nextTime = normalizeReservationTimeValue(
      router.query.reservationTime,
    );
    const nextGuests = normalizeGuestsValue(router.query.numberOfGuests);

    if (!nextDate && !nextTime && !nextGuests) {
      setHasAppliedQueryPrefill(true);
      return;
    }

    setReservationData((prev) => ({
      ...prev,
      reservationDate: nextDate || prev.reservationDate,
      reservationTime: nextTime || "",
      numberOfGuests: nextGuests || prev.numberOfGuests,
    }));
    setPendingPrefilledTime(nextTime || "");
    setHasAppliedQueryPrefill(true);
  }, [
    hasAppliedQueryPrefill,
    router.isReady,
    router.query.numberOfGuests,
    router.query.reservationDate,
    router.query.reservationTime,
  ]);

  useEffect(() => {
    async function restorePendingBankHold() {
      try {
        const raw = localStorage.getItem(PENDING_BANK_HOLD_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed?.reservationId || !parsed?.restaurantId) {
          localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
          return;
        }
        if (String(parsed.restaurantId) !== String(restaurant?._id)) {
          return;
        }
        const res = await fetch(
          `${apiBaseUrl}/reservations/${parsed.reservationId}`,
        );
        if (!res.ok) {
          localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
          return;
        }
        const data = await res.json();
        const reservation = data?.reservation;
        if (!reservation) {
          localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
          return;
        }
        const isAwaiting =
          String(reservation.status) === "AwaitingBankHold" &&
          Boolean(reservation?.bankHold?.enabled);
        const isExpired =
          reservation?.bankHold?.expiresAt &&
          new Date(reservation.bankHold.expiresAt).getTime() <= Date.now();
        if (!isAwaiting || isExpired) {
          localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
          return;
        }
        setPendingBankHoldReservation({
          reservationId: String(reservation._id),
          restaurantId: String(reservation.restaurant_id),
          customerFirstName: reservation.customerFirstName || "",
          reservationDate: reservation.reservationDate,
          reservationTime: reservation.reservationTime,
          numberOfGuests: reservation.numberOfGuests,
          expiresAt: reservation?.bankHold?.expiresAt || null,
        });
        setShowPendingBankHoldModal(true);
      } catch (error) {
        console.error("[restorePendingBankHold]", error);
        localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
      }
    }
    if (restaurant?._id && apiBaseUrl) {
      restorePendingBankHold();
    }
  }, [apiBaseUrl, restaurant?._id]);
  useEffect(() => {
    if (!restaurant?._id || !reservationData.reservationDate || dataLoading) {
      setAvailableTimes([]);
      setTimeOptions([]);
      setResolvedAvailabilitySelectionKey("");
      setIsLoading(Boolean(dataLoading));
      return;
    }
    if (reservationsListLoading) {
      setIsLoading(true);
      return;
    }

    const nextSelectionKey = getAvailabilitySelectionKey({
      reservationDate: reservationData.reservationDate,
      numberOfGuests: reservationData.numberOfGuests,
    });

    setIsLoading(true);
    const nextAvailableTimes = getAvailableReservationTimes({
      reservationDate: reservationData.reservationDate,
      numberOfGuests: reservationData.numberOfGuests,
      restaurant,
      reservationsList,
    });
    setAvailableTimes(nextAvailableTimes);
    setTimeOptions(
      getReservationTimeOptions({
        reservationDate: reservationData.reservationDate,
        numberOfGuests: reservationData.numberOfGuests,
        restaurant,
        reservationsList,
      }),
    );
    setResolvedAvailabilitySelectionKey(nextSelectionKey);
    setIsLoading(false);
  }, [
    dataLoading,
    restaurant,
    reservationData.reservationDate,
    reservationData.numberOfGuests,
    reservationsList,
    reservationsListLoading,
  ]);
  useEffect(() => {
    if (
      !pendingPrefilledTime ||
      !restaurant?._id ||
      dataLoading ||
      reservationsListLoading ||
      isLoading ||
      resolvedAvailabilitySelectionKey !==
        getAvailabilitySelectionKey({
          reservationDate: reservationData.reservationDate,
          numberOfGuests: reservationData.numberOfGuests,
        })
    ) {
      return;
    }

    if (reservationData.reservationTime !== pendingPrefilledTime) {
      setPendingPrefilledTime("");
      return;
    }
    if (timeOptions.some((option) => option.time === pendingPrefilledTime)) {
      setInvalidFields((prev) => {
        if (!prev.reservationTime) return prev;

        const nextInvalidFields = { ...prev };
        delete nextInvalidFields.reservationTime;
        return nextInvalidFields;
      });
      setPendingPrefilledTime("");
      return;
    }

    setReservationData((prev) => ({
      ...prev,
      reservationTime: "",
    }));
    setInvalidFields((prev) => ({
      ...prev,
      reservationTime: true,
    }));
    setError(
      "Le créneau transmis par la booking bar n’est plus disponible. Merci d’en choisir un autre.",
    );
    setPendingPrefilledTime("");
  }, [
    timeOptions,
    dataLoading,
    isLoading,
    pendingPrefilledTime,
    reservationsListLoading,
    resolvedAvailabilitySelectionKey,
    restaurant?._id,
    reservationData.numberOfGuests,
    reservationData.reservationDate,
    reservationData.reservationTime,
  ]);
  function formatTimeDisplay(time) {
    const [h, m] = time.split(":");
    return `${h}h${m}`;
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    setError(null);
    setSuccessMessage("");
    setReservationData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "numberOfGuests" ? { reservationTime: "" } : {}),
    }));
    setInvalidFields((prev) => {
      if (!prev[name] && !(name === "numberOfGuests" && prev.reservationTime)) {
        return prev;
      }

      const nextInvalidFields = { ...prev };
      delete nextInvalidFields[name];

      if (name === "numberOfGuests") {
        delete nextInvalidFields.reservationTime;
      }

      return nextInvalidFields;
    });
  }
  function handleDateChange(d) {
    setError(null);
    setSuccessMessage("");
    setReservationData((prev) => ({
      ...prev,
      reservationDate: d,
      reservationTime: "",
    }));
    setInvalidFields((prev) => {
      if (!prev.reservationTime) return prev;

      const nextInvalidFields = { ...prev };
      delete nextInvalidFields.reservationTime;
      return nextInvalidFields;
    });
  }
  function disableClosedDays({ date, view }) {
    if (view !== "month") return false;
    return isReservationDateClosed({ reservationDate: date, restaurant });
  }
  function handleResumePendingBankHold() {
    if (!pendingBankHoldReservation?.reservationId) return;
    window.location.href = `/reservations/${pendingBankHoldReservation.reservationId}/bank-hold`;
  }
  async function handleCancelPendingBankHold() {
    if (!pendingBankHoldReservation?.reservationId) return;
    try {
      setIsCancelingPendingBankHold(true);
      const res = await fetch(
        `${apiBaseUrl}/reservations/${pendingBankHoldReservation.reservationId}/cancel-pending-bank-hold`,
        { method: "POST", headers: { "Content-Type": "application/json" } },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.message || "Impossible d’annuler la réservation en attente.",
        );
      }
      localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
      setPendingBankHoldReservation(null);
      setShowPendingBankHoldModal(false);
      await fetchReservationsList();
    } catch (err) {
      setError(
        err?.message || "Impossible d’annuler la réservation en attente.",
      );
    } finally {
      setIsCancelingPendingBankHold(false);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
    const nextInvalidFields =
      getMissingRequiredReservationFields(reservationData);

    if (Object.keys(nextInvalidFields).length > 0) {
      setInvalidFields((prev) => ({
        ...prev,
        ...nextInvalidFields,
      }));
      return;
    }
    const selectedTimeOption = timeOptions.find(
      (option) => option.time === reservationData.reservationTime,
    );
    const isWaitlistRequest = selectedTimeOption?.type === "waitlist";

    if (!selectedTimeOption) {
      setInvalidFields((prev) => ({
        ...prev,
        reservationTime: true,
      }));
      setError("Veuillez sélectionner un horaire proposé.");
      return;
    }

    setInvalidFields({});
    setIsSubmitting(true);
    let tablePayload = null;
    if (manage) {
      if (reservationData.table && reservationData.table !== "auto") {
        tablePayload = reservationData.table;
      }
    } else {
      tablePayload = reservationData.table || null;
    }
    const payload = {
      reservationDate: formatReservationDateForApi(
        reservationData.reservationDate,
      ),
      reservationTime: reservationData.reservationTime,
      numberOfGuests: reservationData.numberOfGuests,
      customerFirstName: reservationData.customerFirstName.trim(),
      customerLastName: reservationData.customerLastName.trim(),
      customerEmail: reservationData.customerEmail.trim(),
      customerPhone: reservationData.customerPhone.trim(),
      commentary: reservationData.commentary,
      table: tablePayload || undefined,
      returnUrl: `${window.location.origin}/reservations`,
      idempotencyKey,
    };
    try {
      const endpoint = isWaitlistRequest
        ? `${apiBaseUrl}/restaurants/${restaurant._id}/reservations/waitlist`
        : `${apiBaseUrl}/restaurants/${restaurant._id}/reservations`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Erreur lors de la réservation");
      }
      const data = await res.json();
      if (data?.requiresAction && data?.redirectUrl && data?.reservationId) {
        localStorage.setItem(
          PENDING_BANK_HOLD_STORAGE_KEY,
          JSON.stringify({
            reservationId: String(data.reservationId),
            restaurantId: String(restaurant._id),
            customerFirstName: reservationData.customerFirstName.trim(),
            reservationDate: formatReservationDateForApi(
              reservationData.reservationDate,
            ),
            reservationTime: reservationData.reservationTime,
            numberOfGuests: reservationData.numberOfGuests,
          }),
        );
        window.location.href = data.redirectUrl;
        return;
      }
      await fetchReservationsList();
      onBooked?.(data.restaurant || restaurant);
      setReservationData((prev) => ({
        ...prev,
        reservationTime: "",
        customerFirstName: "",
        customerLastName: "",
        customerEmail: "",
        customerPhone: "",
        commentary: "",
        table: manage ? "auto" : "",
      }));
      setInvalidFields({});
      setSuccessMessage(
        isWaitlistRequest
          ? "Votre demande a été ajoutée à la liste d’attente. Vous recevrez un email si une place se libère."
          : "Votre réservation a bien été effectuée. Nous avons bien reçu votre demande.",
      );
      if (router.query.reservationDate || router.query.reservationTime) {
        await router.replace("/reservations", undefined, { shallow: true });
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }
  const peopleOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => String(i + 1));
  }, []);
  const isReservationFormComplete = useMemo(() => {
    return (
      Boolean(reservationData.numberOfGuests) &&
      Boolean(reservationData.reservationTime) &&
      Boolean(reservationData.customerFirstName.trim()) &&
      Boolean(reservationData.customerLastName.trim()) &&
      Boolean(reservationData.customerEmail.trim()) &&
      Boolean(reservationData.customerPhone.trim())
    );
  }, [
    reservationData.customerEmail,
    reservationData.customerFirstName,
    reservationData.customerLastName,
    reservationData.customerPhone,
    reservationData.numberOfGuests,
    reservationData.reservationTime,
  ]);
  const selectedTimeOption = timeOptions.find(
    (option) => option.time === reservationData.reservationTime,
  );
  const isWaitlistSelection = selectedTimeOption?.type === "waitlist";
  return (
    <>
      {showPendingBankHoldModal && pendingBankHoldReservation && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(39,20,12,0.55)] px-4">
          <div className="site-card w-full max-w-[620px] rounded-[30px] p-6 tablet:p-8">
            <p className="script-font text-[38px] leading-none text-[var(--site-orange-deep)]">
              Paiement
            </p>
            <h3 className="yeseva-one-regular -mt-1 text-[42px] leading-[0.9] text-[var(--site-ink)] tablet:text-[50px]">
              Réservation en attente
            </h3>
            <p className="mt-4 text-[15px] leading-[1.8] text-[var(--site-ink-soft)] tablet:text-[17px]">
              {pendingBankHoldReservation.customerFirstName
                ? `${pendingBankHoldReservation.customerFirstName}, `
                : ""}
              vous avez une réservation en attente de validation d’empreinte
              bancaire.
            </p>
            <div className="mt-6 rounded-[22px] border border-[var(--site-line)] bg-white/80 p-4 tablet:p-5">
              <div className="grid gap-4 text-[14px] text-[var(--site-ink-soft)] tablet:text-[15px] desktop:grid-cols-3">
                <p>
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.28em]">
                    Date
                  </span>
                  {format(
                    new Date(pendingBankHoldReservation.reservationDate),
                    "dd/MM/yyyy",
                  )}
                </p>
                <p>
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.28em]">
                    Heure
                  </span>
                  {pendingBankHoldReservation.reservationTime}
                </p>
                <p>
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.28em]">
                    Personnes
                  </span>
                  {pendingBankHoldReservation.numberOfGuests}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 tablet:flex-row tablet:justify-end">
              <button
                type="button"
                onClick={handleCancelPendingBankHold}
                disabled={isCancelingPendingBankHold}
                className="flex h-[52px] items-center justify-center rounded-[14px] border border-[var(--site-line)] px-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--site-ink)] transition hover:opacity-80 disabled:opacity-50 tablet:px-6 tablet:text-[13px] tablet:tracking-[0.22em]"
              >
                {isCancelingPendingBankHold
                  ? "Annulation..."
                  : "Annuler la réservation"}
              </button>
              <button
                type="button"
                onClick={handleResumePendingBankHold}
                className="site-button tablet:text-[13px] tablet:tracking-[0.22em]"
              >
                Finaliser
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="site-shell px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
        <div className="mx-auto max-w-[1500px]">
          <SectionHeadingComponent
            eyebrow="Réservation"
            title="Préparez votre venue"
            description="Choisissez votre date, votre horaire et renseignez vos informations pour finaliser votre réservation."
          />

          <div className="mx-auto mt-14 max-w-[1380px]">
            {!dataLoading ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <RevealOnScrollComponent
                  variant="left"
                  className="site-card rounded-[30px] p-5 tablet:max-w-[360px] tablet:p-6"
                >
                  <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]">
                    Personnes
                  </label>
                  <div className="relative">
                    <select
                      name="numberOfGuests"
                      value={reservationData.numberOfGuests}
                      onChange={handleInputChange}
                      aria-invalid={invalidFields.numberOfGuests}
                      className={`site-select h-[56px] appearance-none px-4 pr-11 text-[15px] tablet:px-5 tablet:pr-12 tablet:text-[17px] ${invalidFields.numberOfGuests ? "border-[#c55050] bg-[#fff4f1] focus:border-[#c55050]" : ""}`}
                    >
                      {peopleOptions.map((value) => (
                        <option key={value} value={value}>
                          {value} {Number(value) > 1 ? "personnes" : "personne"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.4}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--site-ink-soft)]"
                    />
                  </div>
                </RevealOnScrollComponent>

                <div className="grid gap-6 desktop:grid-cols-[1fr_1fr]">
                  <RevealOnScrollComponent
                    variant="left"
                    className="site-card rounded-[30px] p-5 tablet:p-6 desktop:p-7"
                  >
                    <div className="mb-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]">
                        Calendrier
                      </p>
                      <h3 className="yeseva-one-regular mt-3 text-[38px] leading-[0.92] text-[var(--site-ink)] tablet:text-[46px]">
                        Choisissez votre date
                      </h3>
                    </div>
                    <div className="reservation-calendar-wrapper overflow-hidden">
                      <Calendar
                        onChange={handleDateChange}
                        value={reservationData.reservationDate}
                        view="month"
                        locale="fr-FR"
                        tileDisabled={disableClosedDays}
                        minDate={new Date()}
                        className="reservation-calendar w-full border-none bg-transparent"
                      />
                    </div>
                  </RevealOnScrollComponent>

                  <RevealOnScrollComponent
                    delay={120}
                    variant="right"
                    className={`site-card relative rounded-[30px] p-5 tablet:p-6 desktop:p-7 ${
                      invalidFields.reservationTime
                        ? "border-[#c55050] bg-[#fff4f1]"
                        : ""
                    }`}
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]">
                          Disponibilités
                        </p>
                        <h3 className="yeseva-one-regular mt-3 text-[38px] leading-[0.92] text-[var(--site-ink)] tablet:text-[46px]">
                          Sélectionnez un horaire
                        </h3>
                      </div>
                      {isLoading && (
                        <div className="absolute left-1/2 top-[80%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-[13px] text-[var(--site-ink-soft)] tablet:top-1/2 tablet:text-[14px]">
                          <Loader2 size={16} className="animate-spin" />
                          Chargement...
                        </div>
                      )}
                    </div>
                    {!isLoading && timeOptions.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4">
                        {timeOptions.map((option) => {
                          const time = option.time;
                          const isActive =
                            reservationData.reservationTime === time;
                          const isWaitlist = option.type === "waitlist";
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setError(null);
                                setSuccessMessage("");
                                setInvalidFields((prev) => {
                                  if (!prev.reservationTime) return prev;

                                  const nextInvalidFields = { ...prev };
                                  delete nextInvalidFields.reservationTime;
                                  return nextInvalidFields;
                                });
                                setReservationData((prev) => ({
                                  ...prev,
                                  reservationTime: time,
                                }));
                              }}
                              disabled={!reservationData.numberOfGuests}
                              aria-label={
                                isWaitlist
                                  ? `${formatTimeDisplay(time)} complet, liste d’attente`
                                  : formatTimeDisplay(time)
                              }
                              className={`min-w-0 rounded-[14px] border px-3 py-3 text-[14px] transition tablet:px-4 tablet:text-[15px] ${
                                isActive
                                  ? "border-[var(--site-orange)] bg-[var(--site-orange)] text-white"
                                  : isWaitlist
                                    ? "border-dashed border-[var(--site-orange)]/70 bg-white/70 text-[var(--site-orange-deep)]"
                                    : "border-[var(--site-line)] bg-white/90 text-[var(--site-ink)] hover:border-[var(--site-orange)] hover:text-[var(--site-orange-deep)]"
                              }`}
                            >
                              {formatTimeDisplay(time)}
                              {isWaitlist ? (
                                <span className="mt-1 block text-[10px] uppercase tracking-[0.12em]">
                                  Complet
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      !isLoading && (
                        <p className="text-[15px] leading-[1.8] text-[var(--site-ink-soft)] tablet:text-[17px]">
                          Aucun créneau disponible pour cette date.
                        </p>
                      )
                    )}
                    {isWaitlistSelection ? (
                      <p className="mt-4 text-[14px] leading-[1.7] text-[var(--site-ink-soft)] tablet:text-[15px]">
                        Ce créneau est complet. Vous pouvez vous inscrire en
                        liste d’attente et nous vous préviendrons si une place
                        se libère.
                      </p>
                    ) : null}
                  </RevealOnScrollComponent>
                </div>

                <RevealOnScrollComponent
                  delay={180}
                  variant="up"
                  className="site-card rounded-[30px] p-5 tablet:p-6 desktop:p-7"
                >
                  <div className="mb-7 tablet:mb-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]">
                      Vos informations
                    </p>
                    <h3 className="yeseva-one-regular mt-3 text-[38px] leading-[0.92] text-[var(--site-ink)] tablet:text-[46px]">
                      Finalisez la réservation
                    </h3>
                  </div>
                  <div className="grid gap-5 tablet:grid-cols-2">
                    <Field
                      label="Prénom*"
                      fieldId="reservation-customer-first-name"
                      name="customerFirstName"
                      value={reservationData.customerFirstName}
                      onChange={handleInputChange}
                      type="text"
                      invalid={invalidFields.customerFirstName}
                    />
                    <Field
                      label="Nom*"
                      fieldId="reservation-customer-last-name"
                      name="customerLastName"
                      value={reservationData.customerLastName}
                      onChange={handleInputChange}
                      type="text"
                      invalid={invalidFields.customerLastName}
                    />
                    <Field
                      label="Email*"
                      fieldId="reservation-customer-email"
                      name="customerEmail"
                      value={reservationData.customerEmail}
                      onChange={handleInputChange}
                      type="email"
                      invalid={invalidFields.customerEmail}
                    />
                    <Field
                      label="Téléphone*"
                      fieldId="reservation-customer-phone"
                      name="customerPhone"
                      value={reservationData.customerPhone}
                      onChange={handleInputChange}
                      type="tel"
                      invalid={invalidFields.customerPhone}
                    />
                    <div className="tablet:col-span-2">
                      <label
                        htmlFor="reservation-commentary"
                        className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]"
                      >
                        Commentaire
                      </label>
                      <textarea
                        id="reservation-commentary"
                        name="commentary"
                        value={reservationData.commentary}
                        onChange={handleInputChange}
                        rows={5}
                        className="site-textarea w-full resize-none px-4 py-4 text-[15px] text-[var(--site-ink)] tablet:px-5 tablet:text-[16px]"
                        placeholder="Une demande particulière ?"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="mt-6 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 tablet:text-[15px]">
                      {error}
                    </div>
                  )}
                  {successMessage && (
                    <div className="mt-6 rounded-[18px] border border-[var(--site-line)] bg-[#edf4e8] px-4 py-3 text-[14px] text-[#2f5c1a] tablet:text-[15px]">
                      {successMessage}
                    </div>
                  )}
                  <div className="mt-8 flex justify-start tablet:justify-end">
                    <button
                      type="submit"
                      disabled={
                        !isReservationFormComplete || isLoading || isSubmitting
                      }
                      className="site-button w-full disabled:cursor-not-allowed disabled:opacity-50 tablet:w-auto tablet:min-w-[220px] tablet:text-[13px] tablet:tracking-[0.28em]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={18} className="animate-spin" />
                          {isWaitlistSelection ? "Inscription..." : "Envoi..."}
                        </span>
                      ) : isWaitlistSelection ? (
                        "Liste d’attente"
                      ) : (
                        "Confirmer"
                      )}
                    </button>
                  </div>
                </RevealOnScrollComponent>
              </form>
            ) : (
              <p className="flex h-[320px] w-full items-center justify-center gap-2 text-[var(--site-ink-soft)] tablet:h-[400px]">
                Chargement <Loader2 size={18} className="animate-spin" />
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
function Field({
  label,
  fieldId,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  invalid = false,
}) {
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]"
      >
        {label}
      </label>
      <input
        id={fieldId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={invalid}
        placeholder={placeholder}
        className={`site-input h-[52px] px-4 text-[15px] text-[var(--site-ink)] tablet:h-[56px] tablet:px-5 tablet:text-[16px] ${invalid ? "border-[#c55050] bg-[#fff4f1] focus:border-[#c55050]" : ""}`}
      />
    </div>
  );
}

function getMissingRequiredReservationFields(reservationData) {
  const nextInvalidFields = {};

  if (!reservationData.numberOfGuests) {
    nextInvalidFields.numberOfGuests = true;
  }

  if (!reservationData.reservationTime) {
    nextInvalidFields.reservationTime = true;
  }

  if (!reservationData.customerFirstName.trim()) {
    nextInvalidFields.customerFirstName = true;
  }

  if (!reservationData.customerLastName.trim()) {
    nextInvalidFields.customerLastName = true;
  }

  if (!reservationData.customerEmail.trim()) {
    nextInvalidFields.customerEmail = true;
  }

  if (!reservationData.customerPhone.trim()) {
    nextInvalidFields.customerPhone = true;
  }

  return nextInvalidFields;
}

function getSingleQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeGuestsValue(value) {
  const normalizedValue = String(getSingleQueryValue(value) || "").trim();
  if (!/^\d+$/.test(normalizedValue)) return "";
  return Number(normalizedValue) > 0 ? normalizedValue : "";
}

function normalizeReservationTimeValue(value) {
  const normalizedValue = String(getSingleQueryValue(value) || "").trim();
  const match = normalizedValue.match(/^(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : "";
}

function getAvailabilitySelectionKey({ reservationDate, numberOfGuests }) {
  return `${formatReservationDateForApi(reservationDate)}|${String(numberOfGuests || "").trim()}`;
}
