import ResumeReservationsComponent from "@/components/reservations/resume.reservations.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";

export default function ReservationResumePage({ reservationId }) {
  return (
    <>
      <SeoHeadComponent
        title="Suivi de réservation - Les Capucins by Lily"
        description="Consultez le suivi de votre réservation Les Capucins by Lily."
        path={reservationId ? `/reservations/${reservationId}` : "/reservations"}
        image="/img/reservations/header_reservations.webp"
        noIndex={true}
      />

      <ResumeReservationsComponent
        reservationId={reservationId}
        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { reservationId } = context.params;

  return {
    props: {
      reservationId: reservationId || null,
    },
  };
}
