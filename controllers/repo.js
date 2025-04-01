import pool from "../config/db.js";
export const  checkRepo = async (req, res) => {
    try {
        const { title } = req.query;
        const user_id = req.user.id;

        if (!title) {
            return res.status(400).json({ available: false, message: "Title is required" });
        }

        const result = await pool.query(
            "SELECT id FROM projects WHERE user_id = $1 AND title = $2",
            [user_id, title]
        );

        res.json({ available: result.rows.length === 0, message: result.rows.length > 0 ? "Repository name already exists" : "Repository name is available" });

    } catch (error) {
        console.error("Error checking repository name:", error);
        res.status(500).json({ available: false, message: "Internal server error" });
    }
}

export const deleteRepo = async (req, res) => {
    try {
    const id = req.params.repoId;
    await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    res.json({success: true});
    } catch (error) {
        console.log("Error",error);
    }
}


export const uploadRepo =  async (req, res) => {
    try {
        if (!req.files || !req.files.zipFile) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const {title,description,tech_stack,domain,url} = req.body;
        const projectImage = req.files.projectImage[0].filename;
        const zipFile = req.files.zipFile[0].filename;
        await pool.query(
            `INSERT INTO projects (title, description, tech_stack, domain, live_project_url, project_image_path, zip_file_path,user_id) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)`,
            [title, description, tech_stack, domain, url, projectImage, zipFile,req.user.id]
        )
        res.redirect('/myRepos');
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Error processing file" });
    }
}

export const findRepoById = async (id) => {
    try {
        const repo = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);   
        return repo.rows[0]; 
    } catch (error) {
        console.error("Database Error:", error);
        return null; // Fix: Return null to indicate failure
    }
};

export const findRepoByUserId = async (id) => {
    try {
        const repo = await pool.query("SELECT * FROM projects WHERE user_id = $1", [id]);     
        return repo.rows; 
    } catch (error) {
        console.error("Database Error:", error);
        return null; // Fix: Return null to indicate failure
    }
};

export const countRepos = async (id) => {
    try {
        const repo = await pool.query("SELECT COUNT(*) FROM projects WHERE user_id = $1", [id]);     
        return repo.rows[0].count; 
    } catch (error) {
        console.error("Database Error:", error);
        return null; // Fix: Return null to indicate failure
    }
};

export const findRepoByDomain = async (domain,id,repo_id) => {
    try {
        const repo = await pool.query(
            "SELECT * FROM projects WHERE domain = $1 and user_id != $2 and id!=$3 ORDER BY RANDOM() LIMIT 3",
            [domain,id,repo_id]
        );

        return repo.rows; // Returns up to 3 random projects from the domain
    } catch (error) {
        console.error("Error fetching repositories by domain:", error);
        return null; // Return null in case of an error
    }
};

export const saveProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await pool.query("insert into saved_projects (project_id,user_id) values ($1,$2)", [id,userId]);
        res.json({success:true});
    } catch (error) {
        console.log("Error",error);
    }
}

export const unsaveProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await pool.query("delete from saved_projects where project_id = $1 and user_id = $2", [id,userId]);
        res.json({success:true});
    } catch (error) {
        console.log("Error",error);
    }
}

export const isSaved = async (user_id,project_id)=>{
    try {
        const repo = await pool.query("SELECT * FROM saved_projects WHERE user_id = $1 AND project_id = $2", [user_id, project_id]);
        return repo.rows.length > 0;
    } catch (error) {
        console.error("Database Error:", error);
        return null; // Fix: Return null to indicate failure
    }
}

export const getSavedPosts = async (user_id) => {
    try {
        // Step 1: Fetch all saved projects for the user
        const savedPosts = await pool.query("SELECT * FROM saved_projects WHERE user_id = $1", [user_id]);

        // Step 2: If there are no saved posts, return an empty array
        if (savedPosts.rows.length === 0) {
            return [];
        }

        // Step 3: Use map to create an array of project_id's
        const projectIds = savedPosts.rows.map(post => post.project_id);

        // Step 4: Fetch all projects using the list of project_id's
        const projects = await pool.query(
            "SELECT * FROM projects WHERE id = ANY($1::int[])", 
            [projectIds]
        );

        // Step 5: Return the projects associated with the saved posts
        return projects.rows;
        
    } catch (error) {
        console.error("Database Error:", error);
        return null; // Return null to indicate failure
    }
};
