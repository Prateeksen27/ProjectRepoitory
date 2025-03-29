import pool from "../config/db.js";
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio } = req.body;
        const profilePic = req.file.filename;
        const userId = req.user.id;

        await pool.query(
            "UPDATE users SET full_name = $1, small_about = $2, profile_pic = $3, profile_completed = true WHERE id = $4",
            [fullName, bio, profilePic, userId]
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
