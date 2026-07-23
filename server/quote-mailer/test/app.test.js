import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import { createQuoteServer, createRateLimiter } from "../src/app.js";

const validQuote = {
  source: "kfdpack-website",
  language: "zh",
  submittedAt: "2026-07-23T00:00:00.000Z",
  pageUrl: "https://en.kfdpack.com/products",
  product: "彩印纸箱",
  size: "450 × 300 × 200 mm",
  quantity: "10,000件",
  material: "五层BC楞",
  printing: "四色印刷",
  destination: "青岛",
  notes: "KFD-20260723-001",
  contact: "buyer@example.com",
  website: "",
};

const silentLogger = {
  info() {},
  error() {},
};

async function withServer(options, callback) {
  const server = createQuoteServer({ logger: silentLogger, ...options });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();

  try {
    return await callback(`http://127.0.0.1:${address.port}`);
  } finally {
    server.close();
    await once(server, "close");
  }
}

function postJson(url, payload, headers = {}) {
  return fetch(`${url}/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Real-IP": "203.0.113.10",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

test("delivers a valid quote and returns 204", async () => {
  const deliveries = [];

  await withServer({
    sendQuoteMail: async (mail) => deliveries.push(mail),
    now: () => new Date("2026-07-23T00:00:00Z"),
  }, async (url) => {
    const response = await postJson(url, validQuote);

    assert.equal(response.status, 204);
    assert.equal(deliveries.length, 1);
    assert.match(deliveries[0].subject, /彩印纸箱/);
  });
});

test("rejects an invalid payload before attempting delivery", async () => {
  let deliveries = 0;

  await withServer({
    sendQuoteMail: async () => { deliveries += 1; },
  }, async (url) => {
    const response = await postJson(url, { ...validQuote, contact: "" });

    assert.equal(response.status, 400);
    assert.equal(deliveries, 0);
  });
});

test("rejects invalid json, oversized content and unsupported requests", async () => {
  await withServer({
    sendQuoteMail: async () => {},
  }, async (url) => {
    const invalidJson = await fetch(`${url}/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Real-IP": "203.0.113.11" },
      body: "{broken",
    });
    assert.equal(invalidJson.status, 400);

    const oversized = await postJson(url, {
      ...validQuote,
      notes: "x".repeat(33 * 1024),
    }, { "X-Real-IP": "203.0.113.12" });
    assert.equal(oversized.status, 413);

    const wrongMethod = await fetch(`${url}/quote`, { method: "GET" });
    assert.equal(wrongMethod.status, 405);

    const wrongType = await fetch(`${url}/quote`, {
      method: "POST",
      headers: { "Content-Type": "text/plain", "X-Real-IP": "203.0.113.13" },
      body: "plain text",
    });
    assert.equal(wrongType.status, 415);

    const missingRoute = await fetch(`${url}/missing`);
    assert.equal(missingRoute.status, 404);
  });
});

test("rate limits repeated attempts from the same client address", async () => {
  await withServer({
    sendQuoteMail: async () => {},
    isRateLimited: createRateLimiter({ limit: 1, windowMs: 60_000 }),
  }, async (url) => {
    const first = await postJson(url, validQuote, { "X-Real-IP": "203.0.113.14" });
    const second = await postJson(url, validQuote, { "X-Real-IP": "203.0.113.14" });

    assert.equal(first.status, 204);
    assert.equal(second.status, 429);
  });
});

test("returns 503 without leaking smtp details when delivery fails", async () => {
  await withServer({
    sendQuoteMail: async () => {
      throw new Error("smtp.163.com secret authorization code");
    },
  }, async (url) => {
    const response = await postJson(url, validQuote, { "X-Real-IP": "203.0.113.15" });
    const body = await response.text();

    assert.equal(response.status, 503);
    assert.doesNotMatch(body, /smtp|secret|163|authorization/i);
  });
});
