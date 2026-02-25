// lib/email.js
import nodemailer from 'nodemailer';

// Create transporter once (best practice)
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends verification email
 * @param {Object} params
 * @param {string} params.to - Recipient email (required)
 * @param {string} [params.name] - User's name (optional)
 * @param {string} params.verificationToken - Token for link
 */
export async function sendVerificationEmail({ to, name, verificationToken }) {
  // Safety checks
  if (!to) {
    throw new Error('No recipient email provided (to is required)');
  }
  if (!verificationToken) {
    throw new Error('Verification token is missing');
  }
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Gmail credentials missing (EMAIL_USER / EMAIL_PASS)');
  }
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not set');
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;

  const mailOptions = {
    from: `"CheAura Travels" <${process.env.EMAIL_USER}>`,
    to: to.trim(),
    subject: 'Verify Your CheAura Travels Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h1 style="color: #001d3d; text-align: center;">Welcome to CheAura Travels!</h1>
        <p>Hello ${name ? name.trim() : 'there'},</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background-color: #001d3d; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="font-size: 14px;">Or copy and paste this link:</p>
        <p style="word-break: break-all; color: #0066cc; font-size: 14px;">${verificationUrl}</p>
        
        <p style="margin-top: 30px; font-size: 14px;">This link expires in 1 hour for security.</p>
        <p style="font-size: 14px;">If you didn't sign up, please ignore this email.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="text-align: center; font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} CheAura Travels
        </p>
      </div>
    `,
    text: `
Hello ${name ? name.trim() : 'there'},

Thank you for signing up with CheAura Travels.

Please verify your email by visiting this link:
${verificationUrl}

This link expires in 1 hour.

If you didn't create an account, ignore this email.

Best regards,
CheAura Travels Team
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Verification sent to ${to} → Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[Email] Failed to send to ${to}:`, err.message, err.stack);
    throw new Error(`Email sending failed: ${err.message}`);
  }
}