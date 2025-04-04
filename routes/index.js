import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import multer from "multer";
import pool from "../config/db.js";
import { registerUser, loginUser, logoutUser, isRegistered, getProfile, updateProfileUser } from "../controllers/userController.js";
import { updateBanner, updateProfile, updateProfilePicture } from "../controllers/profileController.js";
import { sendOtp } from "../controllers/otp.js";
import { checkRepo, deleteRepo, findRepoByDomain, findRepoById, getSavedPosts, isSaved, saveProject, unsaveProject, uploadRepo } from "../controllers/repo.js";
import { techLogos } from "../models/techlogos.js";
import { isAuthenticated } from "../config/passport.js";
import { followUser, getFollowerList, getFollowingList, removeFollower, unfollowUser } from "../controllers/followController.js";
import User from "../models/user.js";
import { genPrompt } from "../generate_prompt.js";
import run from "../gemini.js";
const router = express.Router();
// ✅ Storage Configuration for profile pictures
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/profiles"),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
    },
});
const uploadProfile = multer({ storage: profileStorage });
// ✅ Storage Configuration for project uploads
const projectStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads"),
    filename: (req, file, cb) => cb(null, "project-" + Date.now() + path.extname(file.originalname)),
});
const uploadProject = multer({ storage: projectStorage });

router.get("/", (req, res) => res.render("Landing/index"));
router.get("/login", (req, res) => res.render("LoginSignUp/login"));
router.get("/home", isAuthenticated, (req, res) => {
    if (!req.user.profile_completed) return res.redirect("/profileSetup");
    res.render("Main/index", { user: req.user, currentPage: "Home" });
});
router.get("/profileSetup", isAuthenticated, (req, res) => res.render("ProfileSetup/index"));
router.get("/explore", isAuthenticated, async (req, res) => {
    try {
        const id = req.user.id;
        const repos = await pool.query("SELECT * FROM projects WHERE user_id != $1", [id]);
        res.render("Explore/index", { user: req.user, repos: repos.rows, techLogos: techLogos, currentPage: "Explore" });
    } catch (error) {
        console.log("Error", error);

    }
});
router.get("/myRepos", isAuthenticated, async (req, res) => {
    try {
        const id = req.user.id;
        const repos = await pool.query("SELECT * FROM projects WHERE user_id = $1", [id]);
        // console.log("Repos",repos.rows);

        res.render("Main/myRepos", { user: req.user, currentPage: "myRepos", myRepo: repos.rows, techLogos: techLogos });

    } catch (error) {
        console.log("Error", error);

    }
    res.render("Main/myRepos", { user: req.user, currentPage: "myRepos", myRepo: [] });
})
router.get("/savedPosts", isAuthenticated, async (req, res) => {
    try {
        const id = req.user.id;
        const savedPosts = await getSavedPosts(id);
      
        
        res.render("Main/savedPosts", { user: req.user, currentPage: "savedPosts", savedPosts: savedPosts,techLogos: techLogos });
    }catch (error) {
        console.log("Error", error);
    }
    
});
router.get("/community", isAuthenticated, (req, res) => res.render("Community/community", { user: req.user, currentPage: "community" }));
router.get("/create", isAuthenticated, (req, res) => res.render("CreateProject/index", { user: req.user, currentPage: "create" }));
router.get("/repo/:repoId", isAuthenticated, async (req, res) => {
    try {
        const id = req.params.repoId;
        const repo = await findRepoById(id);
        const name =await  User.findUserNameById(repo.user_id);
        const moreRepos = await findRepoByDomain(repo.domain,req.user.id,id);
        const isSave = await isSaved(req.user.id, id);
        // console.log("Repo", repo);
        if (!repo) {
            return res.status(404).send("Repository not found");
        }
        res.render("Main/showMyRepo", {
            user: req.user,
            repo: repo,
            currentPage: "create",
            owner: repo.user_id == req.user.id,
            name: name,
            moreRepos: moreRepos,
            isSaved: isSave
        });
    } catch (error) {
        console.error("Error fetching repo:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.post("/isRegistered", isRegistered);
router.get("/profile/:id", isAuthenticated, getProfile);
router.get("/check-repo-name", isAuthenticated, checkRepo);
router.post("/inc_download/:id", isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const download = await pool.query("select total_downloads from projects where id = $1", [id]);
        const downloads = download.rows[0].total_downloads + 1;
        await pool.query("UPDATE projects SET total_downloads = $1 WHERE id = $2", [downloads, id]);
        res.json({ success: true });
    } catch (error) {
        console.log("Error", error);
        res.json({ success: false });

    }
})
// router.get("/user-repos", isAuthenticated,userRepo);
router.delete("/delete-repo/:repoId", isAuthenticated, deleteRepo)
router.post("/save-project/:id",isAuthenticated,saveProject)
router.post("/unsave-project/:id",isAuthenticated,unsaveProject)
router.post("/profile-setup", isAuthenticated, uploadProfile.single("profilePic"), updateProfile);
//update banner and profile
router.post("/update-profile-pic", isAuthenticated, uploadProfile.single("image"), updateProfilePicture);

router.post("/update-banner", isAuthenticated, uploadProfile.single("image"), updateBanner);
router.post("/update-project/:id", isAuthenticated, async (req, res) => {
    try {
        const { title, live, domain, desc, id } = req.body;
        await pool.query("UPDATE projects SET title = $1, live_project_url = $2, domain = $3, description = $4 WHERE id = $5", [title, live, domain, desc, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.log("Error", error);
        res.json({ success: false, message: "Database Error" });
    }
})
router.post('/update-profile', isAuthenticated, updateProfileUser);
router.post("/send-otp", sendOtp);
router.post("/upload", isAuthenticated, uploadProject.fields([
    { name: "zipFile", maxCount: 1 },
    { name: "projectImage", maxCount: 1 }
]), uploadRepo);
//follow routes
router.post("/follow/:userId", isAuthenticated, followUser);
router.post("/unfollow/:userId",isAuthenticated,unfollowUser)
router.post("/removefollower/:userId",isAuthenticated,removeFollower)
router.get("/getFollowers/:userId", isAuthenticated, async (req,res)=>{
    try {
        const id = req.params.userId;
        const followers = await getFollowerList(id);
        res.json({followers:followers});
    } catch (error) {
        console.log("Error", error);
        res.json({ success: false });
    }
});
router.get("/getFollowing/:userId", isAuthenticated, async (req,res)=>{
    try {
        const id = req.params.userId;
        const following = await getFollowingList(id);
        // console.log("Following",following);
        
        res.json({following:following});
    } catch (error) {
        console.log("Error", error);
        res.json({ success: false });
    }
});
router.post("/getUsersByIds", async (req, res) => {
    const { userIds } = req.body;
    if (!userIds || !userIds.length) return res.json({ users: [] });

    const users = await pool.query(`SELECT id, full_name, small_about, profile_pic FROM users WHERE id = ANY($1)`, [userIds]);
    res.json({ users: users.rows });
});

 
router.post('/generate', async (req, res) => {
    const {name,languages,designation}=req.body
    if(languages=='') return res.json({success:false})
    const prompt =  genPrompt(name,languages,designation)
    const resp = await run(prompt)  
    
    
    res.json({bio:resp,success:true})
    
  })
  router.post('/updateBio',async (req,res)=>{
    try{
    const {about} = req.body
    console.log(about);
    
    await pool.query("update users set bio = $1 where id=$2",[about,req.user.id])
    res.json({success:true})
    }catch(err){
        console.log(err);
        res.json({success:false})
        
    }
  })

// ✅ Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
