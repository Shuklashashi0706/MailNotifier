const twilio = require("twilio");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Now access environment variables
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);

const sendWhatsAppNotification = function (subject, text) {
  client.messages
    .create({
      from: "whatsapp:+14155238886", // Twilio sandbox number for WhatsApp
      to: `whatsapp:+${process.env.PHONE_NUM}`,
      body: `Bhai apna mail check kr!!`,
    })
    .then((message) => console.log("WhatsApp message sent:", message.sid))
    .catch((err) => console.error(err));
};

module.exports = sendWhatsAppNotification;
