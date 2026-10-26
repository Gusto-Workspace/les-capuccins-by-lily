function hasFinalOrderOutcome(order) {
  if (!order || !["online", "on_site"].includes(order.paymentMethod))
    return false;
  return (
    order.paymentMethod !== "online" ||
    ["paid", "refunded"].includes(order.paymentStatus) ||
    ["canceled", "rejected"].includes(order.status)
  );
}

function orderOutcomeContent(order) {
  const paymentLabel =
    order.paymentMethod !== "online"
      ? "Paiement au retrait"
      : order.paymentStatus === "refunded"
        ? "Paiement remboursé"
        : order.paymentStatus === "paid"
          ? "Paiement effectué en ligne"
          : "Paiement en ligne non confirmé";
  if (["canceled", "rejected"].includes(order.status)) {
    const title =
      order.status === "rejected"
        ? "Votre commande a été refusée."
        : "Votre commande a été annulée.";
    const description =
      order.paymentStatus === "refunded"
        ? "Le paiement a été remboursé."
        : order.paymentStatus !== "paid"
          ? "Cette commande n’a pas été confirmée par le restaurant."
          : order.stripeRefundStatus === "pending"
            ? "Le paiement a été encaissé ; son remboursement est en cours."
            : "Le paiement a été encaissé. Contactez le restaurant pour vérifier son remboursement.";
    return { title, description, paymentLabel };
  }
  const messages = {
    confirmed: [
      "Votre commande est confirmée.",
      "L’équipe des Capuccins va la préparer avec soin.",
    ],
    preparing: [
      "Votre commande est en préparation.",
      "L’équipe prépare votre commande.",
    ],
    ready: [
      "Votre commande est prête.",
      "Vous pouvez venir retirer votre commande.",
    ],
    out_for_delivery: [
      "Votre commande est en livraison.",
      "Votre commande est en route.",
    ],
    completed: ["Votre commande est terminée.", "Merci pour votre commande."],
  };
  const [title, description] = messages[order.status] || [
    "Votre commande a bien été reçue.",
    "Le restaurant doit encore la confirmer. Vous recevrez un email dès qu’elle sera acceptée.",
  ];
  return { title, description, paymentLabel };
}

module.exports = { hasFinalOrderOutcome, orderOutcomeContent };
