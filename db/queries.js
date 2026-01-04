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

async function addMembership(username) {
    const { rows } = await pool.query("UPDATE users SET membership_status = true WHERE username = $1", [username]);
    return rows[0];
}

async function createMessage(username, messageTitle, messageBody) {
    const user = await findUserByName(username);
    const { rows } = await pool.query(
        "INSERT INTO messages (user_id, message_title, message_body) VALUES ($1, $2, $3) RETURNING *",
        [user[0].id, messageTitle, messageBody]
    );

    return rows[0];
}

async function getAllMessages() {
    const { rows } = await pool.query("SELECT * FROM messages;");
    return rows;
}

async function findMessageById(messageTitle) {
    const { rows } = await pool.query("SELECT * FROM messages WHERE message_title = $1", [messageTitle]);
    return rows[0];
}
async function deleteMessageById(messageId) {
    const { rows } = await pool.query("DELETE FROM messages WHERE id = $1 RETURNING *;", [messageId]);
    return rows;
}

module.exports = {
    findUserByName,
    findUserById,
    checkIfEmailIsInUse,
    addMembership,
    createMessage,
    getAllMessages,
    deleteMessageById,
    findMessageById

}