const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");

const MAIL = process.env.MAIL;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;

exports.sendResetCode = (email, name, code) => {
  console.log(MAIL, MAIL_USER, MAIL_PASSWORD, MAIL_HOST, MAIL_PORT);
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: MAIL,
    to: email,
    subject: "Reset Password",
    html: `<div
    style="
      max-width: 700px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: Roboto;
      font-weight: 600;
      color: #7b2dc0;
    "
  >
  </div>
  <div
    style="
      padding: 1rem 0;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      color: #141823;
      font-size: 17px;
      font-family: Roboto;
    "
  >
    <span>Hey ${name}</span>
    <div style="padding: 20px 0">
      <span style="padding: 1.5rem 0"
        >Code:</span
      >
    </div>
    <a
      style="
        border-radius: 25px;
        width: 200px;
        padding: 10px 15px;
        background: #dc9d0b;
        color: #fff;
        text-decoration: none;
        font-weight: 600;
      "
      >${code}</a
    ><br />
    <div style="padding-top: 20px">
      <span style="margin: 1.5rem 0; color: #898f9c"
        >If you did not request a change of password, please ignore this e-mail</span
      >
      <span style="margin: 1.5rem 0; color: #898f9c"
        ></span
      >
    </div>
  </div>
  `,
  };
  transporter.sendMail(mailOptions, (err, res) => {
    if (err) return console.log(err);
    return console.log(res);
  });
};
