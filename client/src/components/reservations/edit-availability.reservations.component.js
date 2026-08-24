import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Loader2 } from "lucide-react";
import {
  formatReservationDateForApi,
  getReservationTimeOptions,
  isReservationDateClosed,
  parseReservationDateValue,
} from "@/utils/reservations";
import { RESERVATION_SEATING_OPTIONS } from "@/utils/reservation-commentary";

const peopleOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1),
);

export default function EditReservationAvailability({
  apiBaseUrl,
  manageToken,
  restaurant,
  reservation,
  editData,
  setEditData,
}) {
  const [reservationsList, setReservationsList] = useState([]);
  const [slotCoverUsage, setSlotCoverUsage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadAvailability() {
      if (
        !apiBaseUrl ||
        !manageToken ||
        !restaurant?._id ||
        !reservation?._id
      ) {
        if (isCurrent) {
          setReservationsList([]);
          setSlotCoverUsage([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setAvailabilityError("");

        const query = new URLSearchParams({
          excludeReservationId: String(reservation._id),
          token: manageToken,
          from: formatReservationDateForApi(editData.reservationDate),
          to: formatReservationDateForApi(editData.reservationDate),
        });
        const response = await fetch(
          `${apiBaseUrl}/public/restaurants/${restaurant._id}/reservations?${query.toString()}`,
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Impossible de charger les créneaux disponibles.",
          );
        }

        if (isCurrent) {
          setReservationsList(
            Array.isArray(data?.reservations) ? data.reservations : [],
          );
          setSlotCoverUsage(
            Array.isArray(data?.slotCoverUsage) ? data.slotCoverUsage : [],
          );
        }
      } catch (error) {
        if (isCurrent) {
          setReservationsList([]);
          setSlotCoverUsage([]);
          setAvailabilityError(
            error?.message || "Impossible de charger les créneaux disponibles.",
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadAvailability();

    return () => {
      isCurrent = false;
    };
  }, [apiBaseUrl, editData.reservationDate, manageToken, restaurant?._id, reservation?._id]);

  const timeOptions = useMemo(
    () =>
      getReservationTimeOptions({
        reservationDate: editData.reservationDate,
        numberOfGuests: editData.numberOfGuests,
        restaurant,
        reservationsList,
        slotCoverUsage,
        excludeReservationId: reservation?._id,
      }).filter((option) => option.type === "available"),
    [
      editData.reservationDate,
      editData.numberOfGuests,
      restaurant,
      reservationsList,
      slotCoverUsage,
      reservation?._id,
    ],
  );
  const guestOptions = useMemo(() => {
    const currentGuests = String(editData.numberOfGuests || "").trim();
    if (!currentGuests || peopleOptions.includes(currentGuests)) {
      return peopleOptions;
    }

    return [...peopleOptions, currentGuests].sort(
      (a, b) => Number(a) - Number(b),
    );
  }, [editData.numberOfGuests]);

  const selectedDate =
    parseReservationDateValue(editData.reservationDate) || new Date();

  function handleDateChange(value) {
    const nextDate = Array.isArray(value) ? value[0] : value;
    if (!(nextDate instanceof Date) || Number.isNaN(nextDate.getTime())) return;

    setEditData((current) => ({
      ...current,
      reservationDate: formatReservationDateForApi(nextDate),
      reservationTime: "",
    }));
  }

  function handleGuestsChange(event) {
    setEditData((current) => ({
      ...current,
      numberOfGuests: event.target.value,
      reservationTime: "",
    }));
  }

  return (
    <div className="mt-5 grid gap-5 text-[var(--site-ink)]">
      <div>
        <label
          htmlFor="reservation-edit-guests"
          className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]"
        >
          Personnes
        </label>
        <select
          id="reservation-edit-guests"
          value={editData.numberOfGuests}
          onChange={handleGuestsChange}
          required
          className="site-select h-[56px] w-full px-4 pr-11 text-[15px] tablet:w-[320px] tablet:px-5 tablet:pr-12 tablet:text-[17px] desktop:w-[calc(50%-12px)]"
        >
          {guestOptions.map((value) => (
            <option key={value} value={value}>
              {value} {Number(value) > 1 ? "personnes" : "personne"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]">
          Emplacement souhaité
        </p>
        <div className="grid gap-3 tablet:grid-cols-2">
          {RESERVATION_SEATING_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-[16px] border px-4 py-4 text-[15px] text-[var(--site-ink)] transition tablet:px-5 tablet:text-[16px] ${
                editData.seatingPreference === option.value
                  ? "border-[var(--site-orange)] bg-[rgba(246,229,218,0.72)]"
                  : "border-[var(--site-line)] bg-white/80 hover:border-[var(--site-orange)]"
              }`}
            >
              <input
                type="radio"
                name="reservation-edit-seating"
                value={option.value}
                checked={editData.seatingPreference === option.value}
                onChange={(event) =>
                  setEditData((current) => ({
                    ...current,
                    seatingPreference: event.target.value,
                  }))
                }
                className="h-4 w-4 accent-[var(--site-orange)]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="reservation-edit-commentary"
          className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]"
        >
          Commentaire
        </label>
        <textarea
          id="reservation-edit-commentary"
          value={editData.commentary}
          onChange={(event) =>
            setEditData((current) => ({
              ...current,
              commentary: event.target.value,
            }))
          }
          rows={4}
          className="site-textarea w-full resize-none px-4 py-4 text-[15px] text-[var(--site-ink)] tablet:px-5 tablet:text-[16px]"
          placeholder="Une demande particulière ?"
        />
      </div>

      <div className="grid gap-6 desktop:grid-cols-[1fr_1fr]">
        <div className="site-card rounded-[30px] p-5 tablet:p-6 desktop:p-7">
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
              value={selectedDate}
              view="month"
              locale="fr-FR"
              minDate={new Date()}
              tileDisabled={({ date, view }) =>
                view === "month" &&
                isReservationDateClosed({
                  reservationDate: date,
                  restaurant,
                })
              }
              className="reservation-calendar w-full border-none bg-transparent"
            />
          </div>
        </div>

        <div className="site-card relative rounded-[30px] p-5 tablet:p-6 desktop:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)] tablet:text-[12px] tablet:tracking-[0.32em]">
                Disponibilités
              </p>
              <h3 className="yeseva-one-regular mt-3 text-[38px] leading-[0.92] text-[var(--site-ink)] tablet:text-[46px]">
                Sélectionnez un horaire
              </h3>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2 text-[13px] text-[var(--site-ink-soft)] tablet:text-[14px]">
                <Loader2 size={16} className="animate-spin" />
                Chargement...
              </div>
            ) : null}
          </div>

          {availabilityError ? (
            <p className="mt-5 text-[14px] leading-[1.7] text-red-700">
              {availabilityError}
            </p>
          ) : null}

          {!isLoading && !availabilityError && timeOptions.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4">
              {timeOptions.map((option) => {
                const isSelected = editData.reservationTime === option.time;

                return (
                  <button
                    key={option.time}
                    type="button"
                    onClick={() =>
                      setEditData((current) => ({
                        ...current,
                        reservationTime: option.time,
                      }))
                    }
                    className={`border px-3 py-3 text-[14px] transition ${
                      isSelected
                        ? "border-[var(--site-orange)] bg-[var(--site-orange)] text-white"
                        : "border-[var(--site-line)] bg-white text-[var(--site-ink)] hover:border-[var(--site-orange)] hover:text-[var(--site-orange-deep)]"
                    }`}
                  >
                    {formatTimeDisplay(option.time)}
                  </button>
                );
              })}
            </div>
          ) : null}

          {!isLoading && !availabilityError && timeOptions.length === 0 ? (
            <p className="text-[15px] leading-[1.8] text-[var(--site-ink-soft)] tablet:text-[17px]">
              Aucun créneau disponible pour cette date.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function formatTimeDisplay(value) {
  const [hour, minute] = String(value || "")
    .slice(0, 5)
    .split(":");
  return `${hour}h${minute}`;
}
