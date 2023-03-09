const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: "../config.env" });

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3c6c8f58f6aa61",
      pass: "c03f9bcd4c50fa",
    },
  });

  const mailOptions = {
    from: "Daniel Krsak <krsak.daniel@gmail.com>",
    to: options.recipient,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
