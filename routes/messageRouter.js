const { Router } = require("express");
const messageController = require("../controllers/messageController");
const { isAuth, isMember, IsAdmin } = require("./authMiddleware");
const messageRouter = Router();

messageRouter.get('/new', isAuth, messageController.validateMessage, messageController.showNewMessageForm);
messageRouter.post('/new', isAuth, messageController.handleNewMessage);

messageRouter.get('/delete', messageController.handleDeleteMessage);
messageRouter.post('/delete', messageController.handleDeleteMessage);


module.exports = messageRouter;