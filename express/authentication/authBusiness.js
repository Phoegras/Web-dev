const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

async function createUser(data) {
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

    const user = await prisma.users.create({
        data: {
            type: type,
            email: email,
            password: hashedPassword,
            emailVerifiedAt: emailVerifiedAt,
            userProfile: {
                create: {
                    name: name,
                    phone: phone,
                    dateOfBirth: birthdate,
                    address: address,
                },
            },
        },
        include: {
            userProfile: true,
        },
    });

    return user;
}

async function findUserByEmail(email) {
    const user = await prisma.users.findUnique({
        where: { email },
        include: { userProfile: true },
    });
    return user;
}

async function findUserById(id) {
    const user = await prisma.users.findUnique({
        where: { id },
        include: { userProfile: true },
    });
    return user;
}

async function comparePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
}

async function verifyUserEmail(email) {
    try {
        const result = await prisma.users.update({
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
        console.error('Error updating user verification status: ', err);
        return { error: err, data: null };
    }
}

const changePassword = async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(
        newPassword,
        parseInt(parseInt(process.env.BCRYPT_SALT_ROUND)),
    );
    try {
        await prisma.users.update({
            where: { email: email },
            data: { password: hashedPassword },
        });
    } catch (error) {
        console.error('Error in changing password:', error.message);
    }
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    comparePassword,
    verifyUserEmail,
    changePassword,
};
