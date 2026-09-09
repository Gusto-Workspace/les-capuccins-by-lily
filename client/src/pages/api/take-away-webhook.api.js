import takeAwayWebhook from "@/_assets/server/take-away-webhook";

export const config = { api: { bodyParser: false } };

export default takeAwayWebhook.createTakeAwayWebhookHandler();
