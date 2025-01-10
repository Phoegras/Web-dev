const prisma = require('../prismaClient');

async function findAdminByEmail(email) {
    const admin = await prisma.users.findUnique({
        where: { email },
    });
    const adminProfile = await prisma.userProfile.findFirst({
        where: { userId: admin.id },
    });

    return { admin, adminProfile };
}

async function findAdminById(id) {
    const admin = await prisma.users.findUnique({
        where: { id },
    });
    return admin;
}

async function updateAdminProfile(adminId, name, address, phone, dateOfBirth) {
    const updatedAdmin = await prisma.userProfile.update({
        where: { userId: adminId },
        data: {
            name: name,
            phone: phone,
            dateOfBirth: new Date(dateOfBirth),
            address: address,
        },
    });
    return updatedAdmin;
}

async function updateAdminAvatar(adminId, avatarUrl) {
    const updatedAdmin = await prisma.userProfile.update({
        where: { userId: adminId },
        data: { avatar: avatarUrl },
    });
    return updatedAdmin;
}

module.exports = {
    findAdminByEmail,
    findAdminById,
    updateAdminProfile,
    updateAdminAvatar,
};
