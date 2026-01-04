const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  membership_status BOOLEAN NOT NULL DEFAULT FALSE
  );
  
CREATE TABLE messages(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
  message_title VARCHAR(60) NOT NULL,
  message_body TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

`;


async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();