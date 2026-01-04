function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({ message: 'You are not authorized to view this resource please login.' });
    }
}

function isMember(req, res, next) {

}

module.exports = {
    isAuth,
    isMember
};
