const pool = require("../db/pool");
const { body, validationResult, matchedData } = require("express-validator");

function showNewMessageForm(req, res, next) {
    res.render('new-message-form');
}

function handleNewMessage(req, res, next) {
}

function handleDeleteMessage(req, res, next) {

}

module.exports = {
    showNewMessageForm,
    handleNewMessage,
    handleDeleteMessage
};
