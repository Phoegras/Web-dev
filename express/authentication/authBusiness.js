const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

async function createUser(data) {
    const { phone, name, email, password } = data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.users.create({
        data: {
            phone: phone,
            name: name,
            email: email,
            password: hashedPassword,
        },
    });
    return user;
}

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

async function comparePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    comparePassword,
};
