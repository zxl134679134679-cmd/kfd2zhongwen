const FIXED_RECIPIENT = "909015753@qq.com";

const REQUIRED_VARIABLES = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "MAIL_FROM",
  "MAIL_TO",
  "PORT",
];

function parsePort(value, name) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be a valid port`);
  }
  return port;
}

export function readConfig(environment) {
  for (const name of REQUIRED_VARIABLES) {
    if (!environment[name]) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  }
  if (environment.MAIL_TO !== FIXED_RECIPIENT) {
    throw new Error(`MAIL_TO must be ${FIXED_RECIPIENT}`);
  }
  if (!["true", "false"].includes(environment.SMTP_SECURE)) {
    throw new Error("SMTP_SECURE must be true or false");
  }

  return {
    smtp: {
      host: environment.SMTP_HOST,
      port: parsePort(environment.SMTP_PORT, "SMTP_PORT"),
      secure: environment.SMTP_SECURE === "true",
      auth: {
        user: environment.SMTP_USER,
        pass: environment.SMTP_PASS,
      },
    },
    mailFrom: environment.MAIL_FROM,
    mailTo: environment.MAIL_TO,
    port: parsePort(environment.PORT, "PORT"),
  };
}
