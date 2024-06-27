const Imap = require("imap");
const { simpleParser } = require("mailparser");
const sendWhatsAppNotification = require("./sendWhatsapp.js");
const dotenv = require("dotenv");

dotenv.config();


const imap = new Imap({
  user: process.env.GMAIL_USER,
  password: process.env.GMAIL_PWD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
});

function openInbox(cb) {
  imap.openBox("INBOX", true, cb);
}

imap.once("ready", function () {
  openInbox(function (err, box) {
    if (err) throw err;
    imap.on("mail", function () {
      const fetch = imap.seq.fetch(box.messages.total + ":*", {
        bodies: "",
      });
      fetch.on("message", function (msg, seqno) {
        msg.on("body", function (stream, info) {
          simpleParser(stream, async (err, parsed) => {
            if (err) throw err;
            const { from, subject, text } = parsed;
            const placementCellEmail = "placement@msrit.edu";
            if (from.value[0].address === placementCellEmail) {
              console.log("New email from placement cell:", subject, text);
              // Call function to send WhatsApp message
              sendWhatsAppNotification(subject, text);
            }
          });
        });
      });
    });
  });
});

imap.once("error", function (err) {
  console.error(err);
});

imap.connect();
