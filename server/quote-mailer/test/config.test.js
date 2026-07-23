import assert from "node:assert/strict";
import test from "node:test";
import { readConfig } from "../src/config.js";

const validEnvironment = {
  SMTP_HOST: "smtp.163.com",
  SMTP_PORT: "465",
  SMTP_SECURE: "true",
  SMTP_USER: "zxl134679@163.com",
  SMTP_PASS: "server-only-authorization-code",
  MAIL_FROM: "zxl134679@163.com",
  MAIL_TO: "zxl134679@163.com",
  PORT: "8787",
};

test("reads a complete fixed-recipient configuration", () => {
  const config = readConfig(validEnvironment);

  assert.equal(config.smtp.port, 465);
  assert.equal(config.smtp.secure, true);
  assert.equal(config.mailTo, "zxl134679@163.com");
  assert.equal(config.port, 8787);
});

test("rejects missing credentials without printing their values", () => {
  const environment = { ...validEnvironment };
  delete environment.SMTP_PASS;

  assert.throws(
    () => readConfig(environment),
    (error) => error.message === "Missing required environment variable: SMTP_PASS",
  );
});

test("rejects a changed recipient and invalid ports", () => {
  assert.throws(
    () => readConfig({ ...validEnvironment, MAIL_TO: "attacker@example.com" }),
    /MAIL_TO must be zxl134679@163\.com/,
  );
  assert.throws(
    () => readConfig({ ...validEnvironment, SMTP_PORT: "invalid" }),
    /SMTP_PORT must be a valid port/,
  );
});
