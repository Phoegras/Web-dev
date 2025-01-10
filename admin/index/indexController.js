
function getIndex(req, res) {
    const admin = req.user;
    res.render('index', {
        admin,
    })
}

module.exports = {
    getIndex,
}