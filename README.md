# Noteworthy - Note Taking App

---

## Setting up the postgres database:

### 1. Ensure you have postgres version 13 installed locally. If you are on MacOS, you can intall postgres and run its services through Homebrew package manager like so:

```
brew install postgresql@13
brew services start postgresql@13
brew link postgresql@13 --force
```

### 2. Enter the psql shell like so:
```
createdb
psql -h localhost
```

### 3. Here you have two options. Either change the user name in `./server/db.js` to your own psql username, or alternatively you can create a psql superuser with the username specified in that file, like so:
```
CREATE USER farnood SUPERUSER;
SET ROLE farnood;
```

### 4. Create database and tables like so:
```
CREATE DATABASE noteworthy;
\connect noteworthy
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(user_id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),email VARCHAR(255) NOT NULL UNIQUE,username VARCHAR(30) NOT NULL,password VARCHAR(255) NOT NULL, default_folder UUID NOT NULL DEFAULT uuid_generate_v4());

CREATE TABLE folders (folder_id UUID NOT NULL PRIMARY KEY,user_id UUID NOT NULL,name VARCHAR(30) NOT NULL,FOREIGN KEY (user_id) REFERENCES users(user_id));

CREATE TABLE notes (note_id UUID NOT NULL PRIMARY KEY,user_id UUID NOT NULL,folder_id UUID NOT NULL,title TEXT,content TEXT,date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (user_id) REFERENCES users(user_id),FOREIGN KEY (folder_id) REFERENCES folders(folder_id));
```

---

## Install client dependencies and run the client app at `http://localhost:3000` like so:
```
cd client
npm install
npm start
```

---

## Install server dependencies and run the server like so:
```
cd server
npm install
node index.js
```
