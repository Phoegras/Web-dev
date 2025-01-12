const prisma = require('../prismaClient');

const getAccounts = async (type, filter, sort, page, limit) => {
    const skip = (page - 1) * limit;

    let orderBy = {};
    if (sort) {
        const { key, order = 'asc' } = sort;

        if (key === 'name') {
            if (type === 'user') {
                orderBy = { userProfile: { name: order } };
            } else if (type === 'admin') {
                orderBy = { adminProfile: { name: order } };
            }
        } else {
            orderBy = { [key]: order };
        }
    }

    if (type === 'admin') {
        return prisma.admins.findMany({
            where: {
                ...filter,
                adminProfile: filter.adminProfile || undefined,
            },
            skip,
            take: limit,
            include: {
                adminProfile: true,
            },
            orderBy,
        });
    }

    return prisma.users.findMany({
        where: {
            ...filter,
            userProfile: filter.userProfile || undefined,
        },
        skip,
        take: limit,
        include: {
            userProfile: true,
        },
        orderBy,
    });
};


const countAccounts = async (type, filter) => {
    if (type === 'admin') {
        return prisma.admins.count({
            where: {
                ...filter,
                adminProfile: filter.adminProfile || undefined,
            },
        });
    }
    return prisma.users.count({
        where: {
            ...filter,
            userProfile: filter.userProfile || undefined,
        },
    });
};

const banAccountById = async (type, id) => {
    if (type === 'user') {
        await prisma.users.update({
            where: { id },
            data: { status: 'BANNED' },
        });
        return;
    }

    await prisma.admins.update({
        where: { id },
        data: { status: 'BANNED' },
    });
}

const unbanAccountById = async (type, id) => {
    if (type === 'user') {
        await prisma.users.update({
            where: { id },
            data: { status: 'ACTIVE' },
        });
        return;
    }
    await prisma.admins.update({
        where: { id },
        data: { status: 'ACTIVE' },
    });
}

module.exports = {
    getAccounts,
    countAccounts,
    banAccountById,
    unbanAccountById,
};
