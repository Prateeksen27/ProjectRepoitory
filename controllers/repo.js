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

export const findRepoByDomain = async (domain,id) => {
    try {
        const repo = await pool.query(
            "SELECT * FROM projects WHERE domain = $1 and id != $2 ORDER BY RANDOM() LIMIT 3",
            [domain,id]
        );

        return repo.rows; // Returns up to 3 random projects from the domain
    } catch (error) {
        console.error("Error fetching repositories by domain:", error);
        return null; // Return null in case of an error
    }
};
