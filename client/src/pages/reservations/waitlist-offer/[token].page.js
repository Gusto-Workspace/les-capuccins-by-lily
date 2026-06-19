import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";
import WaitlistOfferReservationsComponent from "@/components/reservations/waitlist-offer.reservations.component";

export default function ReservationWaitlistOfferPage({ token }) {
  return (
    <>
      <SeoHeadComponent
        title="Liste d’attente - Les Capucins by Lily"
        description="Répondez à une proposition de place pour votre réservation Les Capucins by Lily."
        path={token ? `/reservations/waitlist-offer/${token}` : "/reservations"}
        image="/img/reservations/header_reservations.webp"
        noIndex={true}
      />

      <WaitlistOfferReservationsComponent
        token={token}
        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.params;

  return {
    props: {
      token: token || null,
    },
  };
}
