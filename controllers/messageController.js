const pool = require("../db/pool");
const { body, validationResult, matchedData } = require("express-validator");
const { createMessage, getAllMessages, findUserById, findMessageById, deleteMessageById } = require("../db/queries");

const validateMessage = [
    body('messageTitle').trim().isLength({ min: 1, max: 60 }).withMessage(`Message Title must be between 1 and 60 characters`),
    body('messageBody').trim().isLength({ min: 1 }).withMessage(`Message must have at least 1 character.`),
]

async function getMessages() {
    const messages = await getAllMessages();

    const formattedMessages = await Promise.all(
        messages.map(async (msg) => {
            const user = await findUserById(msg.user_id);
            const username = user[0]?.username || "Unknown";

            const date = new Date(msg.timestamp);
            const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            return {
                username,
                messageTitle: msg.message_title,
                messageBody: msg.message_body,
                timestamp: formattedDate,
            };
        })
    );

    return formattedMessages;
}


function showNewMessageForm(req, res, next) {
    res.render('new-message-form');
}

async function handleNewMessage(req, res, next) {
    // Collect errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render("new-message-form'", {
            errors: errors.array(),
        });
    }
    try {
        const title = req.body.messageTitle;
        const body = req.body.messageBody;

        await createMessage(req.user.username, title, body);
        res.redirect("/");

    } catch (error) {
        console.error(error);
        next(error);
    }

}

async function handleDeleteMessage(req, res, next) {
    try {
        const { messageTitle } = req.query;
        const message = await findMessageById(messageTitle);
        if (!message) {
            return res.status(404).send("Message not found");
        }

        await deleteMessageById(message.id);
        res.redirect("/");
    } catch (err) {
        next(err);
    }


}

module.exports = {
    getMessages,
    showNewMessageForm,
    handleNewMessage,
    handleDeleteMessage,
    validateMessage
};
