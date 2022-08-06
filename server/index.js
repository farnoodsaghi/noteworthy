const express = require("express");
const cors = require("cors");

const app = express();

//middleware

app.use(express.json());
app.use(cors());
app.use("/auth", require("./routes/jwtAuth"));

app.listen("6000", () => console.log("Server started on port 6000"));
