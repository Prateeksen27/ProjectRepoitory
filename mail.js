import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS, // Store this in .env for security
  },
});

// Function to Send OTP Email with Enhanced Styling
const sendOtpFunction = async (email, otp) => {
  const mailOptions = {
    from: "suprateeksen62@gmail.com",
    to: email,
    subject: "🔐 Your Secure OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f9f9f9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); text-align: center;">
        
        <h2 style="color: #4CAF50; text-transform: uppercase;">🔐 OTP Verification</h2>
        
        <p style="font-size: 18px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #777;">Use the following OTP to verify your email. This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>

        <div style="background: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0; display: inline-block; font-size: 24px; font-weight: bold; color: #333; border: 2px dashed #4CAF50;letter-spacing:6px">
          ${otp}
        </div>

        <p style="font-size: 14px; color: #999;">If you didn’t request this, please ignore this email.</p>
        
        <a href="#" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
          Verify Now
        </a>
        
        <p style="margin-top: 30px; font-size: 12px; color: #aaa;">&copy; 2025 ProjectRepo</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

// Function to Send OTP Verified Email with Styling
const sendOtpVerifiedFunction = async (email) => {
  const mailOptions = {
    from: "suprateeksen62@gmail.com",
    to: email,
    subject: "✅ OTP Verified Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f9f9f9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); text-align: center;">
        
        <h2 style="color: #2196F3; text-transform: uppercase;">✅ Verification Successful</h2>
        
        <p style="font-size: 18px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #777;">Your OTP has been successfully verified. You can now access all features.</p>

        <a href="#" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background: #2196F3; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
          Continue to Dashboard
        </a>
        
        <p style="margin-top: 30px; font-size: 12px; color: #aaa;">&copy; 2025 SentientWare Software Solutions</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
   
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

// Example Usage
// sendOtpFunction("suprateeksen62@gmail.com", "123456");
// sendOtpVerifiedFunction("suprateeksen62@gmail.com");

export { sendOtpFunction, sendOtpVerifiedFunction };
