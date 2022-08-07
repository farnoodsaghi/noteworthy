const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const generateJwtToken = require("../utils/generateJwtToken");
const authorizeUser = require("../middleware/authorizeUser");

router.post("/register", async (req, res) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists");
    }

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    const token = generateJwtToken(newUser.rows[0].user_id);
    res.json({ token });
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!isPasswordValid) {
      return res.status(401).json("Invalid credentials");
    }

    const token = generateJwtToken(user.rows[0].user_id);

    res.json({ token });
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

router.get("/verify", authorizeUser, async (req, res) => {
  try {
    res.json(true);
  } catch (e) {
    console.log(e.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
