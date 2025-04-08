import pool from "../config/db.js";
import bcrypt from 'bcrypt'
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio,designation } = req.body;
        const profilePic = req.file.filename;
        const userId = req.user.id;

        await pool.query(
            "UPDATE users SET full_name = $1, small_about = $2, profile_pic = $3, profile_completed = true,designation=$5 WHERE id = $4",
            [fullName, bio, profilePic, userId,designation]
        );

        res.redirect("/home");
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfilePicture = async (req, res) => {
    if (!req.file) return res.json({ success: false, message: "Invalid Request" });
    // Update database
    try {
        await pool.query("UPDATE users SET profile_pic = $1 WHERE id = $2", [req.file.filename, req.user.id]); // PostgreSQL Example
        res.json({ success: true, imageUrl: `/profiles/${req.file.filename}` });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Database Error" });
    }
}

export const updateBanner =  async (req, res) => {
    if (!req.file) return res.json({ success: false, message: "Invalid Request" });
    // Update database
    try {
        await pool.query("UPDATE users SET banner = $1 WHERE id = $2", [req.file.filename, req.user.id]); // PostgreSQL Example
        res.json({ success: true, imageUrl:  `/profiles/${req.file.filename}` });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Database Error" });
    }
}
export const updatePassword = async (req,res)=>{
    try {
        const {email,password}=req.body;
        console.log(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("update users set password = $1 where email = $2",[hashedPassword,email]);
        res.json({success:true})
        
    } catch (error) {
        console.log(error);
        res.json({success:false})
        
    }
}