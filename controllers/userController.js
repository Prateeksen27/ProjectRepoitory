import passport from "passport";
import User from "../models/user.js";
import { findJoinedAgo } from "../controllers/findJoinedAgo.js";
import pool from "../config/db.js";
import { countRepos, findRepoById, findRepoByUserId } from "./repo.js";
import { techLogos } from "../models/techlogos.js";
import {  countFollowers, countFollowing, isFollowing } from "./followController.js";
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findByEmail(email);
        if (user) {
            return res.render("register", { message: "Email already exists" });
        }

        await User.createUser(email, password,false);
    
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.redirect("/register");
    }
};

export const loginUser = passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
});

export const isRegistered =  async (req, res) => {
    const user = await User.findByEmail(req.body.email)


    if (user != undefined) {
        return res.json({ isRegistered: true })
    }
    return res.json({ isRegistered: false })

}

export const logoutUser = (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
};

export const getProfile =  async (req, res) => {
    const user = await User.findById(req.params.id);
    const repos = await findRepoByUserId(req.params.id);    
    let joinedAt = findJoinedAgo(user.joined_at);   
    let isFollow= await isFollowing(req.user.id, user.id);
    const countRepo = await countRepos(user.id);
    const countFollow = await countFollowers(user.id);
    const countFollowings = await countFollowing(user.id);
    const data = {
        countRepo: countRepo,
        countFollow: countFollow,
        countFollowings: countFollowings
    }
    res.render("Profile/index", { user: user, currentPage: "profile",joinedAt:joinedAt,owner:user.id==req.user.id,repo:repos,techLogos:techLogos,isFollow:isFollow,data:data });
}

export const updateProfileUser = async (req,res)=>{
    const {fullName,birthday,mobile,location,languages,about}=req.body;
    const user = await User.findById(req.user.id);
    await pool.query("UPDATE users SET full_name=$1,birthday=$2,mobile=$3,location=$4,languages=$5,bio=$6 WHERE id=$7", [fullName,birthday,mobile,location,languages,about,user.id]);
    res.json({success:true});
}