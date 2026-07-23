import nodemailer from "nodemailer";
import { createQuoteServer } from "./app.js";
import { readConfig } from "./config.js";

const config = readConfig(process.env);
const transport = nodemailer.createTransport(config.smtp);

const logger = {
  info(event, details = {}) {
    console.info(JSON.stringify({ event, ...details }));
  },
  error(event, details = {}) {
    console.error(JSON.stringify({ event, ...details }));
  },
};

await transport.verify();

const server = createQuoteServer({
  logger,
  async sendQuoteMail(mail) {
    await transport.sendMail({
      from: config.mailFrom,
      to: config.mailTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  },
});

server.listen(config.port, "127.0.0.1", () => {
  logger.info("quote_mailer_started", {
    address: "127.0.0.1",
    port: config.port,
  });
});

server.on("error", () => {
  logger.error("quote_mailer_server_error");
  process.exitCode = 1;
});
