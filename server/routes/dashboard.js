const router = require("express").Router();
const pool = require("../db");
const authorizeUser = require("../middleware/authorizeUser");

router.get("/notes/:folderId", authorizeUser, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT users.username, notes.note_id, folders.folder_id, notes.title, notes.content FROM users LEFT JOIN folders ON users.user_id = folders.user_id LEFT JOIN notes ON users.user_id = notes.user_id WHERE users.user_id = $1 AND folders.folder_id = notes.folder_id ORDER BY notes.date",
      [req.user.id]
    );
    res.json(user.rows);
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

// Get all folders
router.get("/notes", authorizeUser, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT users.username, folders.folder_id, folders.name FROM users LEFT JOIN folders ON users.user_id = folders.user_id WHERE users.user_id = $1",
      [req.user.id]
    );
    res.json(user.rows);
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

// Add single notes
router.post("/notes/:folderId", authorizeUser, async (req, res) => {
  try {
    const { folderId } = req.params;
    const { noteId, title, content } = req.body;
    const newNote = await pool.query(
      "INSERT INTO notes (user_id, note_id, folder_id, title, content) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, noteId, folderId, title, content]
    );
    res.json(newNote.rows[0]);
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

// Add single folders
router.post("/notes", authorizeUser, async (req, res) => {
  try {
    const { folderId, name } = req.body;
    const newFolder = await pool.query(
      "INSERT INTO folders (user_id, folder_id, name) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, folderId, name]
    );
    res.json(newFolder.rows[0]);
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

//Update single notes
router.put("/notes/:folderId/:noteId", authorizeUser, async (req, res) => {
  try {
    const { folderId, noteId } = req.params;
    const { title, content } = req.body;
    const updateNote = await pool.query(
      "UPDATE notes SET title = $1, content = $2 WHERE note_id = $3 AND folder_id = $4 AND user_id = $5 RETURNING *",
      [title, content, noteId, folderId, req.user.id]
    );
    if (updateNote.rows.length === 0) {
      return res.json("This note is not yours");
    }

    res.json("Note was updated");
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

//Delete single notes
router.delete("/notes/:folderId/:noteId", authorizeUser, async (req, res) => {
  try {
    const { folderId, noteId } = req.params;
    const deleteNote = await pool.query(
      "DELETE FROM notes WHERE note_id = $1 AND folder_id = $2 AND user_id = $3 RETURNING *",
      [noteId, folderId, req.user.id]
    );
    if (deleteNote.rows.length === 0) {
      return res.json("This note is not yours");
    }

    res.json("Note was deleted");
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

//Delete folders
router.delete("/notes/:folderId", authorizeUser, async (req, res) => {
  try {
    const { folderId } = req.params;
    const deleteFolderNotes = await pool.query(
      "DELETE FROM notes WHERE folder_id = $1 AND user_id = $2 RETURNING *",
      [folderId, req.user.id]
    );
    const deleteFolder = await pool.query(
      "DELETE FROM folders WHERE folder_id = $1 AND user_id = $2 RETURNING *",
      [folderId, req.user.id]
    );
    if (deleteFolder.rows.length === 0 || deleteFolderNotes.rows.length === 0) {
      return res.json("This folder is not yours");
    }

    res.json("Folder was deleted");
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
