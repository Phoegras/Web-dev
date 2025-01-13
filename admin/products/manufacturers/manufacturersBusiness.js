const prisma = require('../../prismaClient');

module.exports = {
    async getManufacturers() {
        const manufacturers = await prisma.manufacturers.findMany();
        return manufacturers;
    },
    async addManufacturer(name) {
        const manufacturer = await prisma.manufacturers.create({ 
            data: { name },
        });
        return manufacturer;
    },
    async updateManufacturer(id, name) {
        const updatedManufacturer = await prisma.manufacturers.update({
            where: { id },
            data: { name },
        });
        return updatedManufacturer;
    },
    async deleteManufacturer(id) {
        const deletedManufacturer = await prisma.manufacturers.delete({
            where: { id },
        });
        return deletedManufacturer;
    }
}