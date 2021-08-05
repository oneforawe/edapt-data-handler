const dbConfig = {
  host: "localhost",
  port: "3306",
  driver: "mysql",
  username: "edapt",           // Manually create this user in a mysql server.
  password: "PICK-A-PASSWORD", // Set the user password when creating the user.
  database: "edapt_db",        // Manually create this database too.
}

module.exports = dbConfig
