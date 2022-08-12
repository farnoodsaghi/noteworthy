CREATE DATABASE noteworthy;

CREATE TABLE notes (
    note_id UUID NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL,
    folder_id UUID NOT NULL,
    title TEXT,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
);

CREATE TABLE users(
    user_id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
);