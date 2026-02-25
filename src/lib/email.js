// lib/email.js
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail({ to, name, verificationToken }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Gmail credentials not set in environment variables');
  }

  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not set');
  }

  const mailOptions = {
    from: `"CheAura Travels" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your CheAura account',
    html: `
      <h1>Hello ${name || 'there'}!</h1>
      <p>Click the link below to verify your email:</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}">
          Verify Email Address
        </a>
      </p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>— CheAura Travels Team</p>
    `,
    text: `Hello ${name || 'there'}!\n\nVerify: ${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}\n\nIgnore if not you.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Nodemailer error:', err);
    throw new Error('Failed to send verification email');
  }
}