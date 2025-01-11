const accountsBusiness = require('./accountsBusiness');

const getUserAccountList = async (req, res) => {
    try {
        const { type = 'user', name, email, sortKey, sortOrder, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (name) filter.name = { contains: name, mode: 'insensitive' };
        if (email) filter.email = { contains: email, mode: 'insensitive' };

        const sort = sortKey ? { key: sortKey, order: sortOrder || 'asc' } : null;

        const [accounts, total] = await Promise.all([
            accountsBusiness.getAccounts(type, filter, sort, Number(page), Number(limit)),
            accountsBusiness.countAccounts(type, filter),
        ]);

        res.render('account-user', {
            accounts,
            filter: { name, email },
            sortKey,
            sortOrder,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                total,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const getAdminAccountList = async (req, res) => {
    try {
        const { type = 'admin', name, email, sortKey, sortOrder, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (name) filter.name = { contains: name, mode: 'insensitive' };
        if (email) filter.email = { contains: email, mode: 'insensitive' };

        const sort = sortKey ? { key: sortKey, order: sortOrder || 'asc' } : null;

        const [accounts, total] = await Promise.all([
            accountsBusiness.getAccounts(type, filter, sort, Number(page), Number(limit)),
            accountsBusiness.countAccounts(type, filter),
        ]);

        res.render('account-admin', {
            accounts,
            filter: { name, email },
            sortKey,
            sortOrder,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                total,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getUserAccountList,
    getAdminAccountList,
}
