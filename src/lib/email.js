// 2. src/lib/email.js
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail({ to, name, verificationToken }) {
  if (!to) throw new Error('No recipient email provided');
  if (!verificationToken) throw new Error('Verification code is missing');
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Gmail credentials missing (EMAIL_USER / EMAIL_PASS)');
  }

  const mailOptions = {
    from: `"CheAura Travels" <${process.env.EMAIL_USER}>`,
    to: to.trim(),
    subject: 'Your CheAura Travels Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; text-align: center;">
        <h1 style="color: #001d3d;">Welcome to CheAura Travels!</h1>
        <p>Hello ${name},</p>
        <p>Thank you for signing up. Use the verification code below:</p>
        
        <div style="font-size: 40px; font-weight: bold; letter-spacing: 12px; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; display: inline-block;">
          ${verificationToken}
        </div>
        
        <p style="font-size: 16px;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="font-size: 14px; color: #555;">If you didn't sign up, ignore this email.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} CheAura Travels</p>
      </div>
    `,
    text: `
Hello ${name},

Your verification code is: ${verificationToken}

Enter this code in the app to complete signup. It expires in 10 minutes.

If you didn't request this, ignore this email.

Best regards,
CheAura Travels Team
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] OTP sent to ${to} → ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[Email] Failed to send to ${to}:`, err.message);
    throw err;
  }
}