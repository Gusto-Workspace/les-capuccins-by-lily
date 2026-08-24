import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { CalendarDays, ChevronDown, Loader2 } from "lucide-react";
import {
  formatReservationDateForApi,
  getAvailableReservationTimes,
} from "@/utils/reservations";

const peopleOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1),
);

function formatTimeDisplay(time) {
  const [hour, minute] = String(time || "").split(":");
  return `${hour}h${minute}`;
}

export default function BookingBarComponent({
  restaurant,
  className = "",
  showTitle = true,
}) {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [bookingData, setBookingData] = useState(() => ({
    numberOfGuests: "2",
    reservationDate: formatReservationDateForApi(new Date()),
    reservationTime: "",
  }));
  const [reservationsList, setReservationsList] = useState([]);
  const [slotCoverUsage, setSlotCoverUsage] = useState([]);
  const [reservationsListLoading, setReservationsListLoading] = useState(false);
  const [invalidField, setInvalidField] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchReservationsList() {
      if (!apiBaseUrl || !restaurant?._id) {
        if (isMounted) {
          setReservationsList([]);
          setSlotCoverUsage([]);
          setReservationsListLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setReservationsListLoading(true);
        }

        const query = new URLSearchParams({
          from: bookingData.reservationDate,
          to: bookingData.reservationDate,
        });
        const response = await fetch(
          `${apiBaseUrl}/public/restaurants/${restaurant._id}/reservations?${query.toString()}`,
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Impossible de charger les réservations.",
          );
        }

        if (isMounted) {
          setReservationsList(
            Array.isArray(data?.reservations) ? data.reservations : [],
          );
          setSlotCoverUsage(
            Array.isArray(data?.slotCoverUsage) ? data.slotCoverUsage : [],
          );
        }
      } catch (fetchError) {
        console.error(
          "[BookingBarComponent][fetchReservationsList]",
          fetchError,
        );
        if (isMounted) {
          setReservationsList([]);
          setSlotCoverUsage([]);
        }
      } finally {
        if (isMounted) {
          setReservationsListLoading(false);
        }
      }
    }

    fetchReservationsList();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, bookingData.reservationDate, restaurant?._id]);

  const availableTimes = useMemo(() => {
    if (reservationsListLoading) {
      return [];
    }

    return getAvailableReservationTimes({
      reservationDate: bookingData.reservationDate,
      numberOfGuests: bookingData.numberOfGuests,
      restaurant,
      reservationsList,
      slotCoverUsage,
    });
  }, [
    bookingData.numberOfGuests,
    bookingData.reservationDate,
    reservationsList,
    slotCoverUsage,
    reservationsListLoading,
    restaurant,
  ]);

  useEffect(() => {
    if (!bookingData.reservationTime) return;
    if (availableTimes.includes(bookingData.reservationTime)) return;

    setBookingData((prev) => ({
      ...prev,
      reservationTime: "",
    }));
  }, [availableTimes, bookingData.reservationTime]);

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setInvalidField("");
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
      ...(name !== "reservationTime" ? { reservationTime: "" } : {}),
    }));
  }

  async function handleSubmit() {
    setInvalidField("");

    if (!restaurant?._id) {
      return;
    }

    if (!bookingData.reservationDate) {
      setInvalidField("reservationDate");
      return;
    }

    if (!bookingData.reservationTime) {
      setInvalidField("reservationTime");
      return;
    }

    if (!availableTimes.includes(bookingData.reservationTime)) {
      setInvalidField("reservationTime");
      return;
    }

    await router.push({
      pathname: "/reservations",
      query: {
        reservationDate: bookingData.reservationDate,
        reservationTime: bookingData.reservationTime,
        numberOfGuests: bookingData.numberOfGuests,
      },
    });
  }

  return (
    <div
      className={`site-card rounded-[30px] p-6 tablet:p-8 ${className}`.trim()}
    >
      <div className="grid gap-4 desktop:grid-cols-2">
        <FieldWrapper
          label="Nombre de convives"
          fieldId="booking-number-of-guests"
          invalid={invalidField === "numberOfGuests"}
        >
          <select
            id="booking-number-of-guests"
            name="numberOfGuests"
            value={bookingData.numberOfGuests}
            onChange={handleFieldChange}
            aria-invalid={invalidField === "numberOfGuests"}
            className="site-select h-[56px] appearance-none px-4 pr-11 text-[15px] tablet:text-[16px]"
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
            className="pointer-events-none absolute right-4 top-[calc(50%+14px)] -translate-y-1/2 text-[var(--site-ink-soft)]"
          />
        </FieldWrapper>

        <FieldWrapper
          label="Date"
          fieldId="booking-reservation-date"
          invalid={invalidField === "reservationDate"}
        >
          <input
            id="booking-reservation-date"
            type="date"
            name="reservationDate"
            min={formatReservationDateForApi(new Date())}
            value={bookingData.reservationDate}
            onChange={handleFieldChange}
            aria-invalid={invalidField === "reservationDate"}
            className="site-input h-[56px] appearance-none px-4 pr-11 text-[15px] [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 tablet:text-[16px]"
          />
          <CalendarDays
            size={18}
            strokeWidth={1.4}
            className="pointer-events-none absolute right-4 top-[calc(50%+14px)] -translate-y-1/2 text-[var(--site-ink-soft)]"
          />
        </FieldWrapper>

        <FieldWrapper
          label="Horaire"
          fieldId="booking-reservation-time"
          invalid={invalidField === "reservationTime"}
          className="desktop:col-span-2"
        >
          <select
            id="booking-reservation-time"
            name="reservationTime"
            value={bookingData.reservationTime}
            onChange={handleFieldChange}
            disabled={!restaurant?._id || reservationsListLoading}
            aria-invalid={invalidField === "reservationTime"}
            className="site-select h-[56px] appearance-none px-4 pr-11 text-[15px] disabled:cursor-not-allowed disabled:opacity-60 tablet:text-[16px]"
          >
            <option value="">
              {reservationsListLoading
                ? "Chargement des créneaux..."
                : availableTimes.length > 0
                  ? "Choisir un horaire"
                  : "Aucun créneau disponible"}
            </option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {formatTimeDisplay(time)}
              </option>
            ))}
          </select>
          {reservationsListLoading ? (
            <Loader2
              size={18}
              className="pointer-events-none absolute right-4 top-[calc(50%+14px)] -translate-y-1/2 animate-spin text-[var(--site-ink-soft)]"
            />
          ) : (
            <ChevronDown
              size={18}
              strokeWidth={1.4}
              className="pointer-events-none absolute right-4 top-[calc(50%+14px)] -translate-y-1/2 text-[var(--site-ink-soft)]"
            />
          )}
        </FieldWrapper>
      </div>

      <div className="mt-6 flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!restaurant?._id || reservationsListLoading}
          className="site-button w-full disabled:cursor-not-allowed disabled:opacity-60 tablet:ml-auto tablet:w-auto"
        >
          Réserver maintenant
        </button>
      </div>
    </div>
  );
}

function FieldWrapper({
  label,
  fieldId,
  invalid = false,
  className = "",
  children,
}) {
  return (
    <div className={`relative ${className}`.trim()}>
      <label
        htmlFor={fieldId}
        className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)]"
      >
        {label}
      </label>
      <div
        className={
          invalid
            ? "[&_.site-input]:border-[#c55050] [&_.site-select]:border-[#c55050]"
            : ""
        }
      >
        {children}
      </div>
    </div>
  );
}
