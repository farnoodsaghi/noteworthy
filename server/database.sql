CREATE DATABASE noteworthy;

CREATE TABLE notes (
    id UUID NOT NULL PRIMARY KEY, 
    title TEXT,
    content TEXT,
    folder_id UUID NOT NULL,
    user_id UUID NOT NULL,
);

CREATE TABLE users(
    user_id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
);