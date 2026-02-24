// src/lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,        // e.g., smtp.gmail.com
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(to, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify/${token}`;

  const mailOptions = {
    from: `"CheAura Travels" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify Your CheAura Travels Account',
    text: `Welcome! Please verify your email by clicking this link: ${verificationUrl}\n\nThis link expires in 1 hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #001d3d; text-align: center;">Welcome to CheAura Travels</h2>
        <p>Thank you for signing up! To activate your account and start exploring, please verify your email address.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #001d3d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour for security reasons. If you didn't sign up, ignore this email.</p>
        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          Safe travels,<br>Team CheAura Travels
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}