const prisma = require('../prismaClient');

async function findAdminByEmail(email) {
    const admin = await prisma.admins.findUnique({
        where: { email },
        include: {
            adminProfile: true,
        }
    });
    return admin;
}

async function findAdminById(id) {
    const admin = await prisma.admins.findUnique({
        where: id,
        include: {
            adminProfile: true,
        }
    });
    return admin;
}

async function updateAdminProfile(adminId, name, address, phone, dateOfBirth) {
    const updatedAdmin = await prisma.adminProfile.update({
        where: { adminId: adminId },
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
    const updatedAdmin = await prisma.adminProfile.update({
        where: { adminId: adminId },
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
