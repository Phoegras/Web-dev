const prisma = require('../prismaClient');

const getAccounts = async (type, filter, sort, page, limit) => {
    const skip = (page - 1) * limit;
    const orderBy = sort ? { [sort.key]: sort.order || 'asc' } : {};

    if (type === 'admin') {
        return prisma.admins.findMany({
            where: filter,
            skip,
            take: limit,
            orderBy,
        });
    }

    return prisma.users.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy,
    });
};

const countAccounts = async (type, filter) => {
    if (type === 'admin') {
        return prisma.admins.count({ where: filter });
    }
    return prisma.users.count({ where: filter });
};

module.exports = {
    getAccounts,
    countAccounts,
};
