CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    profile_completed BOOLEAN DEFAULT FALSE,
    full_name VARCHAR(255),
    bio TEXT,
    profile_pic VARCHAR(255)
);
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    zip_file_path VARCHAR(500),
    tech_stack TEXT,
    project_image_path VARCHAR(500),
    live_project_url VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    domain TEXT
);
