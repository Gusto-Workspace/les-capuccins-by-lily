export const RESERVATION_SEATING_OPTIONS = [
  {
    value: "interior",
    label: "Intérieur",
    tag: "[INTERIEUR]",
  },
  {
    value: "exterior",
    label: "Extérieur",
    tag: "[EXTERIEUR]",
  },
];

const DEFAULT_RESERVATION_SEATING = "interior";
const SEATING_TAG_PATTERN = /^\[(INTERIEUR|EXTERIEUR)\]\s*/i;

function getSeatingOption(value) {
  return (
    RESERVATION_SEATING_OPTIONS.find((option) => option.value === value) ||
    RESERVATION_SEATING_OPTIONS[0]
  );
}

export function getReservationSeatingPreference(commentary) {
  const match = String(commentary || "")
    .trim()
    .match(SEATING_TAG_PATTERN);
  if (!match) return DEFAULT_RESERVATION_SEATING;

  return match[1].toUpperCase() === "EXTERIEUR" ? "exterior" : "interior";
}

export function getReservationCommentaryText(commentary) {
  return String(commentary || "")
    .trim()
    .replace(SEATING_TAG_PATTERN, "")
    .trim();
}

export function buildReservationCommentary(seatingPreference, commentary) {
  const seatingOption = getSeatingOption(seatingPreference);
  const commentaryText = getReservationCommentaryText(commentary);

  return commentaryText
    ? `${seatingOption.tag} ${commentaryText}`
    : seatingOption.tag;
}
