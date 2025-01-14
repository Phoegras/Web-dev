const accountsBusiness = require('./accountsBusiness');

const getUserAccounts = async (req, res) => {
    try {
        const role = 'user'
        const { name, email, sort = 'email', order = 'asc', page = 1, limit = 10 } = req.query;

        const sortKey = sort;
        const sortOrder = order;

        const filter = {};

        if (email) filter.email = { contains: email, mode: 'insensitive' };

        if (name) {
            filter.userProfile = {
                name: { contains: name, mode: 'insensitive' },
            };
        }

        const orderBy = sortKey ? { key: sortKey, order: sortOrder || 'asc' } : null;

        const [accounts, total] = await Promise.all([
            accountsBusiness.getAccounts(role, filter, orderBy, Number(page), Number(limit)),
            accountsBusiness.countAccounts(role, filter),
        ]);

        console.log('user');
        

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
            admin: req.user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const getUserAccountsApi = async (req, res) => {
    const role = 'user'
    const { name, email, sort = 'email', order = 'asc', page = 1, limit = 10 } = req.query;

    const sortKey = sort;
    const sortOrder = order;

    const filter = {};

    if (email) filter.email = { contains: email, mode: 'insensitive' };

    if (name) {
        filter.userProfile = {
            name: { contains: name, mode: 'insensitive' },
        };
    }

    const orderBy = sortKey ? { key: sortKey, order: sortOrder || 'asc' } : null;

    const [accounts, total] = await Promise.all([
        accountsBusiness.getAccounts(role, filter, orderBy, Number(page), Number(limit)),
        accountsBusiness.countAccounts(role, filter),
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

const banUserAccount = async (req, res) => {
    const role = 'user';
    const { id } = req.params;
    try {
        accountsBusiness.banAccountById(role, id);
        res.json({ message: `Account ${id} has been banned.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to ban the account', error });
    }
};

const unbanUserAccount = async (req, res) => {
    const role = 'user';
    const { id } = req.params;
    try {
        accountsBusiness.unbanAccountById(role, id);
        res.json({ message: `Account ${id} has been unbanned.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to unban the account', error });
    }
};

const getAdminAccounts = async (req, res) => {
    try {
        const role = 'admin'
        const { name, email, sort = 'email', order = 'asc', page = 1, limit = 10 } = req.query;

        const sortKey = sort;
        const sortOrder = order;

        const filter = {};

        if (email) filter.email = { contains: email, mode: 'insensitive' };

        if (name) {
            filter.adminProfile = {
                name: { contains: name, mode: 'insensitive' },
            };
        }

        const orderBy = sortKey ? { key: sortKey, order: sortOrder || 'asc' } : null;

        const [accounts, total] = await Promise.all([
            accountsBusiness.getAccounts(role, filter, orderBy, Number(page), Number(limit)),
            accountsBusiness.countAccounts(role, filter),
        ]);

        console.log('admin');
        

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
            admin: req.user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const getAdminAccountsApi = async (req, res) => {
    const role = 'admin'
    const { name, email, sort = 'email', order = 'asc', page = 1, limit = 10 } = req.query;

    const sortKey = sort;
    const sortOrder = order;

    const filter = {};

    if (email) filter.email = { contains: email, mode: 'insensitive' };

    if (name) {
        filter.adminProfile = {
            name: { contains: name, mode: 'insensitive' },
        };
    }

    const orderBy = sortKey ? { key: sortKey, order: sortOrder || 'asc' } : null;

    const [accounts, total] = await Promise.all([
        accountsBusiness.getAccounts(role, filter, orderBy, Number(page), Number(limit)),
        accountsBusiness.countAccounts(role, filter),
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

const banAdminAccount = async (req, res) => {
    const role = 'admin';
    const { id } = req.params;
    const admin = await accountsBusiness.findAdminById(id);
    console.log(admin.email);
    console.log(req.user.email);
    if (admin.email === process.env.SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ message: `You don't have permission to this.` });
    }
    try {
        console.log('hello');
        accountsBusiness.banAccountById(role, id);
        res.json({ message: `Account ${id} has been banned.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to ban the account', error });
    }
};

const unbanAdminAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const role = 'admin';
        accountsBusiness.unbanAccountById(role, id);
        res.json({ message: `Account ${id} has been unbanned.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to unban the account', error });
    }
};

module.exports = {
    getUserAccounts,
    getUserAccountsApi,
    banUserAccount,
    unbanUserAccount,
    getAdminAccounts,
    getAdminAccountsApi,
    banAdminAccount,
    unbanAdminAccount,
}
