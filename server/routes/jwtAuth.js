const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const generateJwtToken = require("../utils/generateJwtToken");
const authorizeUser = require("../middleware/authorizeUser");
const { body, validationResult } = require("express-validator");

router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const { email, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (user.rows.length !== 0) {
        return res
          .status(401)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const newUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashedPassword]
      );

      const userId = newUser.rows[0].user_id;
      const token = generateJwtToken(userId);
      const defaultFolder = newUser.rows[0].default_folder;

      const newDefaultFolder = await pool.query(
        "INSERT INTO folders (folder_id, user_id, name) VALUES ($1, $2, $3) RETURNING *",
        [defaultFolder, userId, "All Notes"]
      );

      res.json({ token, defaultFolder });
    } catch (e) {
      console.log(e.message);
      res.status(500).json("Server Error");
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const token = generateJwtToken(user.rows[0].user_id);
    const defaultFolder = user.rows[0].default_folder;

    res.json({ token, defaultFolder });
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
