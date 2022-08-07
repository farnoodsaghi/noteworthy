const router = require("express").Router();
const pool = require("../db");
const authorizeUser = require("../middleware/authorizeUser");

router.get("/", authorizeUser, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      req.user.id,
    ]);
    res.json(user.rows[0].username);
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
