import { sendOtpFunction } from "../mail.js";
export const sendOtp = async (req, res) => {
    const { email, otp } = req.body;
    
    

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        await sendOtpFunction(email, otp);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
}