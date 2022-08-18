const router = require("express").Router();
const pool = require("../db");
const authorizeUser = require("../middleware/authorizeUser");

router.get("/notes/:folderId", authorizeUser, async (req, res) => {
  try {
    const { folderId } = req.params;
    const user = await pool.query(
      "SELECT users.username, notes.title, notes.content FROM users LEFT JOIN notes ON users.user_id = notes.user_id WHERE users.user_id = $1 AND folder_id = $2",
      [req.user.id, folderId]
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
  } catch (error) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

//Delete folders
router.delete("/notes/:folderId", authorizeUser, async (req, res) => {
  try {
    const { folderId } = req.params;
    const deleteFolder = await pool.query(
      "DELETE FROM notes WHERE folder_id = $1 AND user_id = $2 RETURNING *",
      [folderId, req.user.id]
    );
    if (deleteFolder.rows.length === 0) {
      return res.json("This folder is not yours");
    }

    res.json("Folder was deleted");
  } catch (error) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
