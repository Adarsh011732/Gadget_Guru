import nodemailer from 'nodemailer';
import '../config/env.js';

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

export async function sendResetOTP(email, otp, userName) {
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:2.5rem 2rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:0.5rem;">⚙️</div>
        <h1 style="color:#fff;font-size:1.5rem;margin:0;">GadgetGuru</h1>
        <p style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin:0.5rem 0 0;">Password Reset Request</p>
      </div>
      <div style="padding:2rem;">
        <p style="color:#334155;font-size:1rem;margin-bottom:1.5rem;">
          Hi <strong>${userName}</strong>, you requested a password reset. Use this OTP to verify your identity:
        </p>
        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:2px dashed #cbd5e1;border-radius:12px;padding:1.5rem;text-align:center;margin-bottom:1.5rem;">
          <div style="font-size:2.5rem;font-weight:800;letter-spacing:12px;color:#0f172a;font-family:monospace;">${otp}</div>
          <p style="color:#64748b;font-size:0.8rem;margin:0.5rem 0 0;">Valid for 15 minutes</p>
        </div>
        <p style="color:#64748b;font-size:0.85rem;line-height:1.6;">
          If you didn't request this, you can safely ignore this email. Your password won't be changed.
        </p>
      </div>
      <div style="background:#f8fafc;padding:1rem 2rem;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="color:#94a3b8;font-size:0.75rem;margin:0;">© ${new Date().getFullYear()} GadgetGuru • India's Smart Gadget Platform</p>
      </div>
    </div>
  `;

  const transporter = getTransporter();
  
  console.log('📧 Sending email with user:', process.env.MAIL_USER);

  await transporter.sendMail({
    from: `"GadgetGuru" <${process.env.MAIL_USER}>`,
    to: email,
    subject: `🔐 Your GadgetGuru Reset OTP: ${otp}`,
    html,
  });
}
