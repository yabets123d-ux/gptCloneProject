import mysql from "mysql2/promise";

// const db= mysql.createPool( {
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// });

// export default db;

// const mysql = require('mysql2');
// require('dotenv').config();

let db;

// 1. If running on Render, use the single Aiven connection string URL
if (process.env.DATABASE_URL) {
   db = mysql.createPool({
    uri: process.env.DATABASE_URL,
    
    // CRITICAL FOR AIVEN CLOUD STORAGE: SSL must be turned on
    ssl: {
      rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  // 2. Fallback to your old local configuration parameters for your computer (MAMP)
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

export default db;
