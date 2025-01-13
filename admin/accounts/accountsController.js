const accountsBusiness = require('./accountsBusiness');

const getUserAccounts = async (req, res) => {
    try {
        const type = req.params;
        const { name, email, sortKey, sortOrder, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (email) filter.email = { contains: email, mode: 'insensitive' };
        if (name) {
            if (type.type === 'user') {
                filter.userProfile = { name: { contains: name, mode: 'insensitive' } };
            } else if (type.type === 'admin') {
                filter.adminProfile = { name: { contains: name, mode: 'insensitive' } };
            }
        }

        const sort = sortKey ? { key: sortKey, order: sortOrder || 'asc' } : null;

        const [accounts, total] = await Promise.all([
            accountsBusiness.getAccounts(type.type, filter, sort, Number(page), Number(limit)),
            accountsBusiness.countAccounts(type.type, filter),
        ]);

        view = type.type === 'user' ? 'account-user' : 'account-admin';

        res.render(view, {
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

const getUserAccountsApi = async (req, res) => {
    const type = req.params;
    const { name, email, sort = 'email', order = 'asc', page = 1, limit = 10 } = req.query;

    const sortKey = sort;
    const sortOrder = order;

    const filter = {};

    if (email) filter.email = { contains: email, mode: 'insensitive' };

    if (name) {
        if (type.type === 'user') {
            filter.userProfile = {
                name: { contains: name, mode: 'insensitive' },
            };
        } else if (type.type === 'admin') {
            filter.adminProfile = {
                name: { contains: name, mode: 'insensitive' },
            };
        }
    }

    const orderBy = sortKey ? { key: sortKey, order: sortOrder || 'asc' } : null;

    const [accounts, total] = await Promise.all([
        accountsBusiness.getAccounts(type.type, filter, orderBy, Number(page), Number(limit)),
        accountsBusiness.countAccounts(type.type, filter),
    ]);

    res.json({
        accounts,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            total,
        },
    });
};

const banAccount = async (req, res) => {
    const { type, id } = req.params;

    const admin = await accountsBusiness.findAdminById(req.user.id);
    console.log(admin.role)
    console.log(type.type)
    if (type.type === 'admin' && admin.role !== 'SUPER_ADMIN') {
        console.log('hello');
        res.status(500).json({ message: "You don't have permission to this activity!" });
    }

    try {
        accountsBusiness.banAccountById(type.type, id);
        res.json({ message: `Account ${id} has been banned.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to ban the account', error });
    }
};

const unbanAccount = async (req, res) => {
    const { type, id } = req.params;

    try {
        accountsBusiness.unbanAccountById(type.type, id);
        res.json({ message: `Account ${id} has been unbanned.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to unban the account', error });
    }
};


module.exports = {
    getUserAccounts,
    getUserAccountsApi,
    banAccount,
    unbanAccount,
}
