const prisma = require('../prismaClient');

async function findUserByEmail(email) {
    const user = await prisma.users.findUnique({
        where: { email },
    });
    const userProfile = await prisma.userProfile.findFirst({
        where: { userId: user.id },
    });
    return { user, userProfile };
}

async function findUserById(id) {
    const user = await prisma.users.findUnique({
        where: { id },
    });
    return user;
}

async function updateUserProfile(userId, name, address, phone, dateOfBirth) {
    console.log(dateOfBirth);
    console.log(typeof dateOfBirth);
    const updatedUser = await prisma.userProfile.update({
        where: { userId: userId },
        data: {
            name: name,
            phone: phone,
            dateOfBirth: new Date(dateOfBirth),
            address: address,
        },
    });
    return updatedUser;
}

module.exports = {
    findUserByEmail,
    findUserById,
    updateUserProfile,
};
