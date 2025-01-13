const prisma = require('../../prismaClient');

module.exports = {
    async getCategories() {
        const categories = await prisma.categories.findMany();
        return categories;
    },
    async addCategory(name) {
        const category = await prisma.categories.create({
            data: { name },
          });
        return category;
    },
    async updateCategory(id, name) {
        const updatedCategory = await prisma.categories.update({
            where: { id },
            data: { name },
        });
        return updatedCategory;
    },
    async deleteCategory(id) {
        const deletedCategory = await prisma.categories.delete({
            where: { id },
          });
        return deletedCategory;
    }
}