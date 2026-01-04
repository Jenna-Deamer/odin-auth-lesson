const pool = require("./pool");

async function findUserByName(username) {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return rows;
}

async function findUserById(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows;
}

async function checkIfEmailIsInUse(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [email]);
    return rows[0];
}
module.exports = {
    findUserByName,
    findUserById,
    checkIfEmailIsInUse

}