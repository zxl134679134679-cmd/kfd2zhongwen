import assert from "node:assert/strict";
import test from "node:test";
import { buildQuoteMail, escapeHtml, validateAndNormalizeQuote } from "../src/quote.js";

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
  notes: "需要打样",
  contact: "buyer@example.com",
  website: "",
};

test("accepts a complete website quote", () => {
  const result = validateAndNormalizeQuote(validQuote);

  assert.equal(result.ok, true);
  assert.equal(result.quote.product, "彩印纸箱");
});

test("rejects a filled honeypot", () => {
  const result = validateAndNormalizeQuote({ ...validQuote, website: "https://spam.example" });

  assert.equal(result.ok, false);
  assert.equal(result.error, "invalid_submission");
});

test("rejects missing required fields and oversized notes", () => {
  assert.equal(validateAndNormalizeQuote({ ...validQuote, contact: "" }).ok, false);
  assert.equal(validateAndNormalizeQuote({ ...validQuote, notes: "x".repeat(4001) }).ok, false);
});

test("rejects unexpected field types and untrusted sources", () => {
  assert.equal(validateAndNormalizeQuote({ ...validQuote, product: ["彩印纸箱"] }).ok, false);
  assert.equal(validateAndNormalizeQuote({ ...validQuote, source: "other-site" }).ok, false);
});

test("returns only allow-listed fields", () => {
  const result = validateAndNormalizeQuote({
    ...validQuote,
    recipientEmail: "attacker@example.com",
    admin: true,
  });

  assert.equal(result.ok, true);
  assert.equal("recipientEmail" in result.quote, false);
  assert.equal("admin" in result.quote, false);
});

test("escapes customer html and excludes a browser recipient from mail content", () => {
  const quote = validateAndNormalizeQuote({
    ...validQuote,
    notes: "<script>alert('x')</script>",
    recipientEmail: "attacker@example.com",
  }).quote;
  const mail = buildQuoteMail(quote, new Date("2026-07-23T00:00:00Z"));

  assert.doesNotMatch(mail.html, /<script>/);
  assert.match(mail.html, /&lt;script&gt;/);
  assert.doesNotMatch(JSON.stringify(mail), /attacker@example\.com/);
  assert.match(mail.subject, /彩印纸箱/);
  assert.match(mail.text, /buyer@example\.com/);
});

test("shows a stable fallback for blank optional fields", () => {
  const result = validateAndNormalizeQuote({
    ...validQuote,
    material: "   ",
    printing: "",
    notes: "",
  });
  const mail = buildQuoteMail(result.quote, new Date("2026-07-23T00:00:00Z"));

  assert.match(mail.text, /未填写/);
  assert.match(mail.html, /未填写/);
});

test("escapes the five special html characters", () => {
  assert.equal(
    escapeHtml(`&<>"'`),
    "&amp;&lt;&gt;&quot;&#39;",
  );
});
