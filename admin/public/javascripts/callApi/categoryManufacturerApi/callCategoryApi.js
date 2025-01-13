const addCategory = async (event) => {
    event.preventDefault();
    const name = document.getElementById('category-name').value.trim();
  
    if (!name) {
      alert('Category name cannot be empty.');
      return;
    }
  
    try {
      const response = await fetch('/categories/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Category added successfully.');
        location.reload(); // Reload to reflect the changes
      } else {
        alert('Failed to add category.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding the category.');
    }
  }


const deleteCategory = async (id) => {
    const confirmation = confirm('Are you sure you want to delete this category?');
    if (!confirmation) return;
  
    try {
      const response = await fetch(`/categories/api/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert('Category deleted successfully.');
        location.reload(); // Reload to reflect the changes
      } else {
        alert('Failed to delete category.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the category.');
    }
  };

  const enableEditMode = (id) => {
    document.getElementById(`category-name-${id}`).classList.add('hidden');
    document.getElementById(`edit-category-input-${id}`).classList.remove('hidden');
    document.getElementById(`edit-btn-${id}`).classList.add('hidden');
    document.getElementById(`save-btn-${id}`).classList.remove('hidden');
  };
  
  const saveCategory = async (id) => {
    const newName = document.getElementById(`edit-category-input-${id}`).value.trim();
  
    if (!newName) {
      alert('Category name cannot be empty.');
      return;
    }
  
    try {
      const response = await fetch(`/categories/api/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Edit successfully");
        document.getElementById(`category-name-${id}`).textContent = newName;
        cancelEditMode(id);
      } else {
        alert("Error editting category");
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the category.');
    }
  };
  
  const cancelEditMode = (id) => {
    document.getElementById(`category-name-${id}`).classList.remove('hidden');
    document.getElementById(`edit-category-input-${id}`).classList.add('hidden');
    document.getElementById(`edit-btn-${id}`).classList.remove('hidden');
    document.getElementById(`save-btn-${id}`).classList.add('hidden');
  };
  