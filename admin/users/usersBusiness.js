const prisma = require('../prismaClient');

async function findUserById(id) {
    const user = await prisma.users.findUnique({
        where: id,
        include: {
            userProfile: true,
        }
    });
    return user;
}

module.exports = {
    findUserById,
};
