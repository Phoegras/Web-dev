const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

async function initializeSuperAdmin() {
    try {
        const superAdmin = await prisma.admins.findFirst({
            where: {
                email: process.env.SUPER_ADMIN_EMAIL,
            },
        });

        if (!superAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);

            const newAdmin = await prisma.admins.create({
                data: {
                    email: process.env.SUPER_ADMIN_EMAIL,
                    password: hashedPassword,
                    role: 'super_admin',
                    emailVerifiedAt: new Date(),
                    adminProfile: {
                        create: {
                            name: 'Super Admin',
                            phone: '123456789',
                            address: 'Headquarters',
                        },
                    },
                },
            });

            console.log('Super admin account created:', newAdmin);
        } else {
            console.log('Super admin account already exists.');
        }
    } catch (error) {
        console.error('Error initializing super admin:', error);
    }
}

module.exports = {
    initializeSuperAdmin
}
