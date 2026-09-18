import test from "node:test";
import assert from "node:assert/strict";
import { inquirySchema, isAllowedOrigin } from "../src/lib/inquiry";
import { externalUrl } from "../src/lib/restaurant";

const valid = { name: "  Pim  ", email: "pim@example.com", type: "catering", message: "A question about a gathering.", consent: true, website: "" };
test("valid inquiries are normalized without losing the message", () => {
  const data = inquirySchema.parse(valid);
  assert.equal(data.name, "Pim");
  assert.equal(data.message, valid.message);
});
test("rejects malformed submissions, missing consent, and honeypot content", () => {
  for (const change of [{ email: "bad" }, { name: " " }, { type: "order" }, { consent: false }, { website: "https://spam.example" }, { message: "a".repeat(3001) }, { message: "short" }]) {
    assert.equal(inquirySchema.safeParse({ ...valid, ...change }).success, false);
  }
});
test("origin matching is exact and fails closed without configuration", () => {
  assert.equal(isAllowedOrigin("https://shallot.example", "https://shallot.example/"), true);
  for (const origin of [null, "null", "https://shallot.example.attacker.test", "http://shallot.example", "https://other.example"]) {
    assert.equal(isAllowedOrigin(origin, "https://shallot.example"), false);
  }
  assert.equal(isAllowedOrigin("https://shallot.example", undefined), false);
  assert.equal(isAllowedOrigin("https://shallot.example", "bad"), false);
});
test("restaurant action links allow only explicit HTTPS URLs", () => {
  for (const url of [null, "", "javascript:alert(1)", "//example.com", "http://example.com", "bad"]) assert.equal(externalUrl(url), undefined);
  assert.equal(externalUrl("https://example.com/order"), "https://example.com/order");
});
