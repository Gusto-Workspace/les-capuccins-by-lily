const Stripe = require("stripe");

const { postGustoService } = require("./gusto-service-api");

const TAKE_AWAY_STRIPE_EVENT_TYPES = new Set([
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
  "refund.created",
  "refund.updated",
]);
const MAX_RAW_BODY_BYTES = 100 * 1024;

async function readRawBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_RAW_BODY_BYTES) {
      throw new Error("Webhook payload too large");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

async function postTakeAwayStripeEvent(payload, options = {}) {
  return postGustoService("take-away/stripe-events", payload, options);
}

function createTakeAwayWebhookHandler(options = {}) {
  const env = options.env || process.env;
  const webhooks =
    options.webhooks || options.stripe?.webhooks || Stripe.webhooks;
  const postEvent = options.postEvent || postTakeAwayStripeEvent;

  return async function takeAwayWebhookHandler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const webhookSecret = env.STRIPE_TAKE_AWAY_WEBHOOK_SECRET;
    const configuredRestaurantId = String(
      env.NEXT_PUBLIC_RESTAURANT_ID || "",
    ).trim();
    if (!webhookSecret || !configuredRestaurantId) {
      console.error("[take-away-webhook-error] Configuration absente");
      return res.status(503).json({ error: "Webhook non configuré" });
    }

    let event;
    try {
      const rawBody = await readRawBody(req);
      event = webhooks.constructEvent(
        rawBody,
        req.headers["stripe-signature"],
        webhookSecret,
      );
    } catch (error) {
      console.error(
        "[take-away-webhook-signature-error]",
        error?.message || error,
      );
      return res.status(400).json({ error: "Signature webhook invalide" });
    }

    if (!TAKE_AWAY_STRIPE_EVENT_TYPES.has(event.type)) {
      return res.status(200).json({ received: true, handled: false });
    }

    const stripeObject = event.data?.object;
    const metadata = stripeObject?.metadata || {};
    const expectedMetadataType = event.type.startsWith("refund.")
      ? "takeaway_order_refund"
      : "takeaway_order";
    if (metadata.type !== expectedMetadataType) {
      return res
        .status(200)
        .json({ received: true, handled: false, ignored: true });
    }
    if (String(metadata.restaurantId || "") !== configuredRestaurantId) {
      return res.status(400).json({ error: "Restaurant invalide" });
    }

    try {
      const result = await postEvent({
        restaurantId: configuredRestaurantId,
        event,
      });
      return res.status(200).json({
        received: true,
        handled: result?.handled !== false,
      });
    } catch (error) {
      console.error("[take-away-webhook-forward-error]", {
        eventId: event.id || null,
        eventType: event.type || null,
        paymentObjectId: stripeObject?.id || null,
        restaurantId: configuredRestaurantId,
        code: error?.code || "WEBHOOK_FORWARD_FAILED",
        message: error?.message || String(error),
      });
      return res.status(500).json({ error: "Transmission webhook impossible" });
    }
  };
}

module.exports = {
  MAX_RAW_BODY_BYTES,
  TAKE_AWAY_STRIPE_EVENT_TYPES,
  createTakeAwayWebhookHandler,
  postTakeAwayStripeEvent,
  readRawBody,
};
