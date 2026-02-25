// Example: lib/email.js (or wherever it is)
import nodemailer from 'nodemailer';

// This should be at the top level (outside functions)
export const transporter = nodemailer.createTransport({
  service: 'gmail',                    // ← use 'service' instead of 'host'
  auth: {
    user: process.env.EMAIL_USER,      // your@gmail.com
    pass: process.env.EMAIL_PASS       // the 16-char app password (no spaces)
  }
});

// Then your send function remains the same, just make sure it uses 'transporter'
export async function sendVerificationEmail({ to, name, verificationToken }) {
  try {
    const info = await transporter.sendMail({
      from: `"CheAura Travels" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify your CheAura account',
      html: `
        <h1>Hello ${name || 'there'}!</h1>
        <p>Click here to verify:</p>
        <a href="$$   {process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=   $${verificationToken}">
          Verify Email
        </a>
      `,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Email error:', err);
    throw err;
  }
}