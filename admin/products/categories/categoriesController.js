const { getCategories, addCategory, updateCategory, deleteCategory} = require('./categoriesBusiness');

module.exports = {
  // Fetch Categories
getAllCategories: async (req, res) => {
  try {
    const categories = await getCategories();
    res.render('category-manager', { categories });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
},

// Add Category
addCategory: async (req, res) => {
  const { name } = req.body;
  try {
    const category = await addCategory(name);
    res.json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
},

// Update Category
updateCategory: async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await updateCategory(id, name);
    res.json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
},

// Delete Category
deleteCategory: async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await deleteCategory(id);
    res.json({ success: true, deletedCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
},
}