import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

export function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOTPEmail(email, otp, name = "Student") {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP credentials not configured. OTP email not sent. Generated OTP:", otp);
    return { success: true, fallbackOtp: otp };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `IOTECH Student Portal <${SMTP_USER}>`,
    to: email,
    subject: "Your IOTECH Student Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; background: #050505; padding: 24px; color: #f3f4f6;">
        <div style="max-width: 560px; margin: 0 auto; background: #121212; border: 1px solid #262626; border-radius: 16px; overflow: hidden;">
          <div style="padding: 28px 28px 12px;">
            <p style="margin: 0; color: #00d2ff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">IOTECH Club</p>
            <h2 style="margin: 12px 0 8px; font-size: 28px;">Hello ${name}</h2>
            <p style="margin: 0; color: #d1d5db; line-height: 1.6;">Use the following OTP to verify your student account and continue to event registration.</p>
          </div>
          <div style="padding: 0 28px 28px;">
            <div style="background: rgba(0, 210, 255, 0.08); border: 1px solid rgba(0, 210, 255, 0.35); border-radius: 12px; text-align: center; padding: 20px; margin: 16px 0;">
              <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Verification Code</p>
              <strong style="font-size: 36px; letter-spacing: 0.2em; color: #ffffff;">${otp}</strong>
            </div>
            <p style="margin: 0; color: #9ca3af; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
          </div>
        </div>
      </div>
    `,
  });

  return { success: true };
}

export async function saveOTPForUser(userId, otp, UserModel) {
  const otpHash = await import("bcryptjs").then(({ default: bcrypt }) => bcrypt.hash(otp, 10));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await UserModel.findByIdAndUpdate(userId, {
    otpHash,
    otpExpiresAt: expiresAt,
    isEmailVerified: false,
  });

  return expiresAt;
}

export async function sendEventRegistrationEmail(email, name, event, registrationId) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP credentials not configured. Registration email not sent.");
    return { success: true, fallback: true };
  }

  const eventDate = event?.date ? new Date(event.date) : null;
  const formattedDate = eventDate && !Number.isNaN(eventDate.getTime())
    ? eventDate.toLocaleString([], { dateStyle: "full", timeStyle: "short" })
    : "TBA";

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `IOTECH Club <${SMTP_USER}>`,
    to: email,
    subject: `Event Registration Confirmed: ${event?.title || "IOTECH Event"}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #050505; padding: 24px; color: #f3f4f6;">
        <div style="max-width: 680px; margin: 0 auto; background: #121212; border: 1px solid #262626; border-radius: 16px; overflow: hidden;">
          <div style="padding: 28px 28px 12px;">
            <p style="margin: 0; color: #00d2ff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">IOTECH Club</p>
            <h2 style="margin: 12px 0 8px; font-size: 28px;">Registration confirmed</h2>
            <p style="margin: 0; color: #d1d5db; line-height: 1.6;">Hello ${name}, your seat for the event has been confirmed.</p>
          </div>
          <div style="padding: 0 28px 28px;">
            <div style="background: rgba(0, 210, 255, 0.08); border: 1px solid rgba(0, 210, 255, 0.35); border-radius: 12px; padding: 20px; margin: 16px 0;">
              <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Event</p>
              <strong style="font-size: 24px; color: #ffffff;">${event?.title || "IOTECH Event"}</strong>
            </div>
            <div style="display: grid; gap: 10px; font-size: 15px; color: #e5e7eb;">
              <div><strong>Registration ID:</strong> ${registrationId}</div>
              <div><strong>Date & Time:</strong> ${formattedDate}</div>
              <div><strong>Venue:</strong> ${event?.venue || event?.location || "Campus"}</div>
              <div><strong>Category:</strong> ${event?.category || "Student Event"}</div>
            </div>
            <p style="margin-top: 18px; color: #9ca3af;">Please arrive 15 minutes early and carry your student ID.</p>
          </div>
        </div>
      </div>
    `,
  });

  return { success: true };
}
