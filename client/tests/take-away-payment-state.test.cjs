const test = require("node:test");
const assert = require("node:assert/strict");
const {
  hasFinalOrderOutcome,
  orderOutcomeContent,
} = require("../src/_assets/utils/take-away-payment-state");

test("processing/declined payments are never presented as final while the order is pending", () => {
  assert.equal(hasFinalOrderOutcome(null), false);
  assert.equal(hasFinalOrderOutcome({}), false);
  for (const paymentStatus of ["pending", "failed"]) {
    const order = { paymentMethod: "online", paymentStatus, status: "pending" };
    assert.equal(hasFinalOrderOutcome(order), false);
    assert.match(orderOutcomeContent(order).paymentLabel, /non confirmé/);
  }
});

test("a paid completed order is presented as completed, not awaiting acceptance", () => {
  const order = {
    paymentMethod: "online",
    paymentStatus: "paid",
    status: "completed",
  };
  assert.equal(hasFinalOrderOutcome(order), true);
  assert.match(orderOutcomeContent(order).title, /terminée/);
  assert.equal(
    orderOutcomeContent(order).paymentLabel,
    "Paiement effectué en ligne",
  );
});

test("canceled/refused unpaid orders leave the payment loop without a false confirmation", () => {
  for (const status of ["canceled", "rejected"]) {
    const order = { paymentMethod: "online", paymentStatus: "failed", status };
    assert.equal(hasFinalOrderOutcome(order), true);
    const content = orderOutcomeContent(order);
    assert.match(content.title, status === "canceled" ? /annulée/ : /refusée/);
    assert.match(content.paymentLabel, /non confirmé/);
  }
});

test("refunds are only displayed as completed after financial confirmation", () => {
  for (const [paymentStatus, stripeRefundStatus, expected] of [
    ["paid", "pending", /en cours/],
    ["paid", "failed", /vérifier son remboursement/],
    ["refunded", "succeeded", /a été remboursé/],
  ]) {
    const content = orderOutcomeContent({
      paymentMethod: "online",
      status: "canceled",
      paymentStatus,
      stripeRefundStatus,
    });
    assert.match(content.description, expected);
    if (paymentStatus === "paid")
      assert.doesNotMatch(content.description, /a été remboursé/);
  }
});

test("paid pending acceptance and on-site orders retain their distinct states", () => {
  const paid = {
    paymentMethod: "online",
    paymentStatus: "paid",
    status: "pending",
  };
  assert.equal(hasFinalOrderOutcome(paid), true);
  assert.match(
    orderOutcomeContent(paid).description,
    /doit encore la confirmer/,
  );
  const onSite = {
    paymentMethod: "on_site",
    paymentStatus: "not_required",
    status: "confirmed",
  };
  assert.equal(hasFinalOrderOutcome(onSite), true);
  assert.equal(orderOutcomeContent(onSite).paymentLabel, "Paiement au retrait");
});
