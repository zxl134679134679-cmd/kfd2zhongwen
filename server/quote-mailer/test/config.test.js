import assert from "node:assert/strict";
import test from "node:test";
import { readConfig } from "../src/config.js";

const validEnvironment = {
  SMTP_HOST: "smtp.qq.com",
  SMTP_PORT: "465",
  SMTP_SECURE: "true",
  SMTP_USER: "909015753@qq.com",
  SMTP_PASS: "server-only-authorization-code",
  MAIL_FROM: "909015753@qq.com",
  MAIL_TO: "909015753@qq.com",
  PORT: "8787",
};

test("reads a complete fixed-recipient configuration", () => {
  const config = readConfig(validEnvironment);

  assert.equal(config.smtp.port, 465);
  assert.equal(config.smtp.secure, true);
  assert.equal(config.mailTo, "909015753@qq.com");
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
    () => readConfig({ ...validEnvironment, MAIL_TO: "zxl134679@163.com" }),
    /MAIL_TO must be 909015753@qq\.com/,
  );
  assert.throws(
    () => readConfig({ ...validEnvironment, SMTP_PORT: "invalid" }),
    /SMTP_PORT must be a valid port/,
  );
});
