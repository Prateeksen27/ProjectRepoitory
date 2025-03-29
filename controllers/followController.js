import pool from "../config/db.js";
export const followUser = async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;
        await pool.query("INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)", [followerId, followingId]);
        res.json({ success: true });
    } catch (error) {
        console.log("Error", error);
        res.json({ success: false });
    }
}

export const unfollowUser = async (req,res)=>{
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;
        await pool.query("DELETE FROM follows WHERE follower_id = $1 AND following_id = $2", [followerId, followingId]);
        res.json({ success: true });
    } catch (error) {
        console.log("Error", error);
        res.json({ success: false });
    }
}


export const isFollowing = async (follower_id, following_id) => {
    try {
        const result = await pool.query("SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2", [follower_id, following_id]);
        return result.rows.length > 0;
    } catch (error) {
        console.log("Error", error);
        return false;
    }
}

export const countFollowers = async (following_id) => {
    try {
        const result = await pool.query("SELECT COUNT(*) FROM follows WHERE following_id = $1", [following_id]);
        return result.rows[0].count;
    } catch (error) {
        console.log("Error", error);
        return 0;
    }
}

export const countFollowing = async (follower_id) => {
    try {
        const result = await pool.query("SELECT COUNT(*) FROM follows WHERE follower_id = $1", [follower_id]);
        return result.rows[0].count;
    } catch (error) {
        console.log("Error", error);
        return 0;
    }
}