const prisma = require('../prismaClient');

async function findUserByEmail(email) {
    const user = await prisma.users.findUnique({
        where: { email },
    });
    const userProfile = await prisma.userProfile.findFirst({
        where: { userId: user.id },
    });
    return {user, userProfile};
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
