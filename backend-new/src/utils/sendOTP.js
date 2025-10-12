const otpStore = new Map(); // phone -> { otp, expiresAt }

export function generateAndSendOTP(phone) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min

  otpStore.set(phone, { otp, expiresAt });
  console.log(`📲 OTP for ${phone}: ${otp}`);
}

export function verifyOTP(phone, otp) {
  const record = otpStore.get(phone);
  if (!record) return false;
  if (record.expiresAt < Date.now()) {
    otpStore.delete(phone);
    return false;
  }
  const isValid = record.otp === otp;
  if (isValid) otpStore.delete(phone);
  return isValid;
}