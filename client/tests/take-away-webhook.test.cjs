const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { Readable } = require("node:stream");
const Stripe = require("stripe");

const {
  createTakeAwayWebhookHandler,
  readRawBody,
} = require("../src/_assets/server/take-away-webhook");
const {
  signGustoPayload,
} = require("../src/_assets/server/gusto-service-api");

const WEBHOOK_SECRET = "whsec_take_away_route_test";
const RESTAURANT_ID = "restaurant-1";
const stripe = new Stripe("sk_test_take_away_route_test");

function responseRecorder() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function eventPayload(type, options = {}) {
  const refund = type.startsWith("refund.");
  return JSON.stringify({
    id: options.eventId || `evt_${type.replaceAll(".", "_")}`,
    object: "event",
    type,
    data: {
      object: {
        id: refund ? "re_test" : "pi_test",
        object: refund ? "refund" : "payment_intent",
        status: refund ? "pending" : "succeeded",
        metadata: {
          type: refund ? "takeaway_order_refund" : "takeaway_order",
          restaurantId: options.restaurantId || RESTAURANT_ID,
          orderId: "order-1",
        },
      },
    },
  });
}

function signedRequest(payload, signature) {
  const req = Readable.from([Buffer.from(payload)]);
  req.method = "POST";
  req.headers = {
    "stripe-signature":
      signature ||
      stripe.webhooks.generateTestHeaderString({
        payload,
        secret: WEBHOOK_SECRET,
      }),
  };
  return req;
}

function routeHandler(postEvent) {
  return createTakeAwayWebhookHandler({
    env: {
      STRIPE_TAKE_AWAY_WEBHOOK_SECRET: WEBHOOK_SECRET,
      NEXT_PUBLIC_RESTAURANT_ID: RESTAURANT_ID,
    },
    stripe,
    postEvent,
  });
}

test("the route consumes the exact raw request body", async () => {
  const req = Readable.from([Buffer.from("raw-"), Buffer.from("body")]);
  assert.equal((await readRawBody(req)).toString("utf8"), "raw-body");
});

test("a valid Stripe signature forwards every supported take-away event", async () => {
  const forwardedTypes = [];
  const handler = routeHandler(async ({ event }) => {
    forwardedTypes.push(event.type);
    return { handled: true };
  });

  for (const type of [
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
    "refund.created",
    "refund.updated",
  ]) {
    const res = responseRecorder();
    await handler(signedRequest(eventPayload(type)), res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.handled, true);
  }

  assert.deepEqual(forwardedTypes, [
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
    "refund.created",
    "refund.updated",
  ]);
});

test("an invalid Stripe signature is rejected before forwarding", async () => {
  let forwardCalls = 0;
  const handler = routeHandler(async () => {
    forwardCalls += 1;
  });
  const res = responseRecorder();

  await handler(
    signedRequest(eventPayload("payment_intent.succeeded"), "t=1,v1=invalid"),
    res,
  );

  assert.equal(res.statusCode, 400);
  assert.equal(forwardCalls, 0);
});

test("a valid but unsupported Stripe event is acknowledged without forwarding", async () => {
  let forwardCalls = 0;
  const handler = routeHandler(async () => {
    forwardCalls += 1;
  });
  const res = responseRecorder();

  await handler(signedRequest(eventPayload("charge.succeeded")), res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.handled, false);
  assert.equal(forwardCalls, 0);
});

test("a take-away event for another restaurant is rejected", async () => {
  let forwardCalls = 0;
  const handler = routeHandler(async () => {
    forwardCalls += 1;
  });
  const res = responseRecorder();

  await handler(
    signedRequest(
      eventPayload("payment_intent.succeeded", {
        restaurantId: "restaurant-2",
      }),
    ),
    res,
  );

  assert.equal(res.statusCode, 400);
  assert.equal(forwardCalls, 0);
});

test("a Gusto outage returns non-2xx and a later Stripe retry is forwarded", async () => {
  let forwardCalls = 0;
  const handler = routeHandler(async () => {
    forwardCalls += 1;
    if (forwardCalls === 1) throw new Error("Gusto unavailable");
    return { handled: true };
  });
  const payload = eventPayload("payment_intent.succeeded", {
    eventId: "evt_retry",
  });
  const firstResponse = responseRecorder();
  const retryResponse = responseRecorder();

  await handler(signedRequest(payload), firstResponse);
  await handler(signedRequest(payload), retryResponse);

  assert.equal(firstResponse.statusCode, 500);
  assert.equal(retryResponse.statusCode, 200);
  assert.equal(forwardCalls, 2);
});

test("the site HMAC uses the same timestamp-payload protocol as Gusto", () => {
  const payload = { restaurantId: RESTAURANT_ID, event: { id: "evt_hmac" } };
  const timestamp = "1700000000000";
  const secret = "shared-secret-test";
  const proof = signGustoPayload(payload, {
    env: { GUSTO_SHARED_SECRET: secret },
    timestamp,
  });
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${JSON.stringify(payload)}`)
    .digest("hex");

  assert.equal(proof.timestamp, timestamp);
  assert.equal(proof.signature, expected);
});
