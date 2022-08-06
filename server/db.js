const Pool = require("pg").Pool;

const pool = new Pool({
  user: "farnood",
  password: "",
  host: "localhost",
  port: 5432,
  database: "noteworthy",
});

module.exports = pool;
