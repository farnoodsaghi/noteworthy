const express = require("express");
const cors = require("cors");

const app = express();

//middleware

app.use(express.json());
app.use(cors());
app.use("/auth", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));

app.listen("3001", () => console.log("Server started on port 3001"));
