const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

async function createAdmin(data) {
    const {
        type,
        email,
        password,
        name,
        phone,
        birthdate,
        address,
        emailVerifiedAt,
    } = data;

    let hashedPassword = null;

    if (password) {
        hashedPassword = await bcrypt.hash(
            password,
            parseInt(process.env.BCRYPT_SALT_ROUND),
        );
    }

    const admin = await prisma.admins.create({
        data: {
            type: type,
            email: email,
            password: hashedPassword,
            emailVerifiedAt: emailVerifiedAt,
            adminProfile: {
                create: {
                    name: name,
                    phone: phone,
                    dateOfBirth: birthdate,
                    address: address,
                },
            },
        },
        include: {
            adminProfile: true,
        },
    });

    return admin;
}

async function findAdminByEmail(email) {
    const admin = await prisma.admins.findUnique({
        where: { email },
        include: { adminProfile: true },
    });
    return admin;
}

async function findAdminById(id) {
    const admin = await prisma.admins.findUnique({
        where: { id },
        include: { adminProfile: true },
    });
    return admin;
}

async function comparePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
}

async function verifyAdminEmail(email) {
    try {
        const result = await prisma.admins.update({
            where: { email },
            data: {
                emailVerifiedAt: new Date(),
            },
        });

        if (!result) {
            return { error: { kind: 'not_found' }, data: null };
        }

        return { error: null, data: { email } };
    } catch (err) {
        console.error('Error updating admin verification status: ', err);
        return { error: err, data: null };
    }
}

const storeResetToken = async (adminId, hashedToken, expiry) => {
    return prisma.resetToken.upsert({
        where: { adminId },
        update: {
            hashedToken,
            expiry,
        },
        create: {
            adminId,
            hashedToken,
            expiry,
        },
    });
};

async function findResetTokenByEmail(email) {
    const admin = await prisma.admins.findUnique({
        where: { email },
    });

    if (!admin) {
        return null;
    }

    const resetToken = await prisma.resetToken.findUnique({
        where: { adminId: admin.id },
    });

    return resetToken;
}

const changePassword = async (adminId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUND));
    return prisma.admins.update({
        where: { id: adminId },
        data: { password: hashedPassword },
    });
};

const deleteResetToken = async (tokenId) => {
    return prisma.resetToken.delete({
        where: { id: tokenId },
    });
};

module.exports = {
    createAdmin,
    findAdminByEmail,
    findAdminById,
    comparePassword,
    verifyAdminEmail,
    changePassword,
    storeResetToken,
    findResetTokenByEmail,
    deleteResetToken,
};
