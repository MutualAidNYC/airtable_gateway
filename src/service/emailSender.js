const nodemailer = require('nodemailer');

async function sendErrorEmail(account, password, sender, recipients, errorSubject, errorBody) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account,
      pass: password,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: sender, 
    to: recipients,
    subject: errorSubject,
    text: errorBody,
    html: errorBody,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = (account, password, sender, recipients, errorSubject, errorBody) => {
  console.log("Sending Error Email to: %s", recipients)
  sendErrorEmail(account, password, sender, recipients, errorSubject, errorBody)
};