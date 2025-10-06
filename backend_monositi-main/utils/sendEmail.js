const nodemailer = require('nodemailer');

/**
 * Send email using nodemailer
 * @param {string} email - Recipient email address
 * @param {string} message - Email message/body content
 * @returns {Promise<boolean>} - Returns true if email sent successfully, false otherwise
 */
const sendEmail = async (email, message) => {
  try {
    // Create transporter with SMTP configuration
    // For production, use environment variables for these settings
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com', // Gmail, Outlook, or custom SMTP
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS, // Your email password or app password
      },
      // For Gmail, you might need to use an "App Password" instead of regular password
      // Enable 2FA on Gmail and generate an App Password for this application
    });

    // Email options
    const mailOptions = {
      from: `"Monositi" <${process.env.SMTP_USER}>`, // sender address
      to: email, // recipient
      subject: 'Monositi Email Verification', // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Monositi Email Verification</h2>
          <p>Thank you for registering with Monositi!</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="margin: 0; color: #333; font-size: 32px; letter-spacing: 5px;">${message}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The Monositi Team
          </p>
        </div>
      `,
      // Alternative plain text version
      text: `Monositi Email Verification\n\nYour verification code is: ${message}\n\nThis code will expire in 10 minutes.`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // For development/testing, you might want to return true even if email fails
    // to avoid blocking the registration process
    return false;
  }
};

module.exports = sendEmail;
