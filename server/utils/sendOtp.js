import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTP = async (phone, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });
  } catch (error) {
    console.error("Twilio Error:", error.message);

    // ✅ DO NOT THROW ERROR
    // fallback: log OTP
    console.log("OTP (fallback):", otp);
  }
};