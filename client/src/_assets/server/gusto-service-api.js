const crypto = require("crypto");

function getGustoApiUrl(env = process.env) {
  return String(env.NEXT_PUBLIC_API_URL || "")
    .trim()
    .replace(/\/+$/, "");
}

function signGustoPayload(payload, options = {}) {
  const env = options.env || process.env;
  const secret = env.GUSTO_SHARED_SECRET;
  if (!secret) throw new Error("Configuration de signature absente");
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
  if (!baseUrl) throw new Error("Configuration API absente");
  const proof = signGustoPayload(payload, { env });
  const response = await fetchImpl(`${baseUrl}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-gusto-timestamp": proof.timestamp,
      "x-gusto-signature": proof.signature,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    const error = new Error(
      data.error || data.message || "Le service Gusto ne répond pas.",
    );
    error.status = response.status;
    error.code = data.code;
    throw error;
  }
  return data;
}

module.exports = {
  getGustoApiUrl,
  postGustoService,
  signGustoPayload,
};
