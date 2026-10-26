const crypto = require("crypto");

function getGustoApiUrl(env = process.env) {
  return String(env.NEXT_PUBLIC_API_URL || "")
    .trim()
    .replace(/\/+$/, "");
}

function signGustoPayload(payload, options = {}) {
  const env = options.env || process.env;
  const secret = env.GUSTO_SHARED_SECRET;
  if (!secret) throw Object.assign(new Error("Configuration de signature absente"), { code: "GUSTO_SIGNATURE_NOT_CONFIGURED" });
  const timestamp = String(options.timestamp || Date.now());
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${JSON.stringify(payload)}`)
    .digest("hex");
  return { timestamp, signature };
}

async function postGustoService(path, payload, options = {}) {
  const env = options.env || process.env;
  const fetchImpl = options.fetchImpl || fetch;
  const baseUrl = getGustoApiUrl(env);
  if (!baseUrl) throw Object.assign(new Error("Configuration API absente"), { code: "GUSTO_API_NOT_CONFIGURED" });
  const proof = signGustoPayload(payload, { env });
  const response = await fetchImpl(`${baseUrl}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-gusto-timestamp": proof.timestamp,
      "x-gusto-signature": proof.signature,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(options.timeoutMs || 10000),
    redirect: "error",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.error) {
    const error = new Error(
      "Le service Gusto ne répond pas.",
    );
    error.status = response.status;
    error.code = /^[A-Z0-9_]{1,80}$/.test(data?.code || "")
      ? data.code : "GUSTO_HTTP_ERROR";
    throw error;
  }
  if (options.requireWebhookReceipt &&
      (data?.received !== true || data?.handled !== true)) {
    throw Object.assign(new Error("Acquittement Gusto invalide"), {
      code: "GUSTO_INVALID_ACK", status: response.status,
    });
  }
  return data;
}

module.exports = {
  getGustoApiUrl,
  postGustoService,
  signGustoPayload,
};
