CREATE TABLE posts (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(240) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(512) NOT NULL,
    category VARCHAR(80) NOT NULL,
    published_date VARCHAR(32) NOT NULL,
    read_time VARCHAR(40) NOT NULL,
    cover_image VARCHAR(1024),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE profile (
    id BIGINT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    title VARCHAR(160) NOT NULL,
    bio TEXT NOT NULL,
    avatar VARCHAR(1024) NOT NULL,
    github VARCHAR(512),
    twitter VARCHAR(512),
    email VARCHAR(254),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO profile (
    id, name, title, bio, avatar, github, twitter, email, created_at, updated_at
) VALUES (
    1,
    'Yeye Yang',
    '',
    '',
    '/avatar.jpg',
    NULL,
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


