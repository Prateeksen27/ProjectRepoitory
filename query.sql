CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    profile_completed BOOLEAN DEFAULT FALSE,
    full_name VARCHAR(255),
    bio TEXT,
    profile_pic VARCHAR(255),
    birthday text,
    mobile text,
    location text,
    languages text,
    small_about text,
    designation text default 'Not Specified',
    banner text default 'https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg',
    joined_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    domain TEXT,
    total_downloads INTEGER DEFAULT 0
);
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE saved_projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    saved_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
