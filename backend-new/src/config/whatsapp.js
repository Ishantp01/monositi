// config/whatsapp.config.js
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.WHATSAPP_FROM || "whatsapp:+14155238886";

if (!accountSid || !authToken) {
  console.warn("⚠️ Twilio credentials are missing in environment variables!");
}

const twilioClient = twilio(accountSid, authToken);

export { twilioClient, whatsappFrom };