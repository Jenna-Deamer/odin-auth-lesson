const pool = require("./pool");

async function findUserByName(username) {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return rows;
}

async function findUserById(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows;
}


module.exports = {
    findUserByName,
    findUserById

}