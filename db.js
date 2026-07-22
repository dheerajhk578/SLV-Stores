require("dotenv").config();

const mysql = require("mysql2");

/* ==========================================
   MYSQL CONNECTION POOL
========================================== */

const pool = mysql.createPool({

    host:
        process.env.DB_HOST || "localhost",

    user:
        process.env.DB_USER || "root",

    password:
        process.env.DB_PASSWORD || "Dheeraj@11#",

    database:
        process.env.DB_NAME || "slv_store",

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

    connectTimeout: 10000,

    charset: "utf8mb4"

});

/* ==========================================
   TEST CONNECTION
========================================== */

pool.getConnection((err, connection) => {

    if (err) {

        console.error("❌ MySQL Connection Failed");

        console.error(err.message);

        return;

    }

    console.log("✅ MySQL Connected Successfully");

    connection.release();

});

/* ==========================================
   EXPORT POOL
========================================== */

module.exports = pool;