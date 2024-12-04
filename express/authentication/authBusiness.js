const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

async function createUser(data) {
    const { email, password, name, phone, birthdate, address } = data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.users.create({
        data: {
            email: email,
            password: hashedPassword,
            userProfile: {
                create: {
                    name: name,
                    phone: phone,
                    birthdate: birthdate,
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

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    comparePassword,
};
