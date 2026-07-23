import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { buildQuoteMail, validateAndNormalizeQuote } from "./quote.js";

const MAX_BODY_BYTES = 32 * 1024;

function sendJson(response, status, value) {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let tooLarge = false;
    const chunks = [];

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      if (tooLarge) {
        reject(Object.assign(new Error("body_too_large"), { status: 413 }));
        return;
      }
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    request.on("error", reject);
  });
}

function clientKey(request) {
  const forwarded = request.headers["x-real-ip"];
  if (typeof forwarded === "string" && forwarded.length <= 80) return forwarded;
  return request.socket.remoteAddress || "unknown";
}

export function createRateLimiter({
  limit = 5,
  windowMs = 10 * 60 * 1000,
  now = () => Date.now(),
} = {}) {
  const clients = new Map();

  return (key) => {
    const currentTime = now();
    const existing = clients.get(key);
    if (!existing || currentTime - existing.windowStartedAt >= windowMs) {
      clients.set(key, { attempts: 1, windowStartedAt: currentTime });
      return false;
    }
    existing.attempts += 1;
    return existing.attempts > limit;
  };
}

export function createQuoteServer({
  sendQuoteMail,
  now = () => new Date(),
  isRateLimited = createRateLimiter(),
  logger = console,
} = {}) {
  if (typeof sendQuoteMail !== "function") {
    throw new TypeError("sendQuoteMail must be a function");
  }

  return createServer(async (request, response) => {
    const requestId = randomUUID();
    const path = new URL(request.url || "/", "http://127.0.0.1").pathname;

    if (path !== "/quote") {
      sendJson(response, 404, { error: "not_found" });
      return;
    }
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      sendJson(response, 405, { error: "method_not_allowed" });
      return;
    }
    if (!request.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
      sendJson(response, 415, { error: "unsupported_media_type" });
      return;
    }
    if (isRateLimited(clientKey(request))) {
      sendJson(response, 429, { error: "too_many_requests" });
      return;
    }

    const declaredLength = Number(request.headers["content-length"] || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      request.resume();
      sendJson(response, 413, { error: "body_too_large" });
      return;
    }

    let rawBody;
    try {
      rawBody = await readBody(request);
    } catch (error) {
      sendJson(response, error.status === 413 ? 413 : 400, {
        error: error.status === 413 ? "body_too_large" : "invalid_request",
      });
      return;
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      sendJson(response, 400, { error: "invalid_json" });
      return;
    }

    const result = validateAndNormalizeQuote(payload);
    if (!result.ok) {
      sendJson(response, 400, { error: result.error });
      return;
    }

    try {
      const mail = buildQuoteMail(result.quote, now());
      await sendQuoteMail(mail);
      logger.info("quote_delivered", { requestId });
      response.writeHead(204, { "Cache-Control": "no-store" });
      response.end();
    } catch {
      logger.error("quote_delivery_failed", { requestId });
      sendJson(response, 503, { error: "delivery_unavailable" });
    }
  });
}
