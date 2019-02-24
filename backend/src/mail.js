const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  }
});

const formatEmail = text => `
  <div class="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 20px;
    font-size: 20px;
  ">
  <h1>Hello there</h1>
  <p>${text}</p>
</div>
`;

exports.transport = transport;
exports.formatEmail = formatEmail;
