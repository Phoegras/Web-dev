const prisma = require('../prismaClient');

async function findUserByEmail(email) {
    const user = await prisma.users.findUnique({
        where: { email },
    });
    return user;
}

async function findUserById(id) {
    const user = await prisma.users.findUnique({
        where: { id },
    });
    return user;
}

module.exports = {
    findUserByEmail,
    findUserById,
};
