import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Barangay Bayanan - Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Barangay Bayanan</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #1f2937;">Password Reset Request</h2>
          <p style="color: #4b5563;">You requested to reset your password. Use the OTP code below to verify your account:</p>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981;">${otp}</span>
          </div>
          <p style="color: #4b5563;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #4b5563; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">Barangay Bayanan - Digital Community Platform</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}