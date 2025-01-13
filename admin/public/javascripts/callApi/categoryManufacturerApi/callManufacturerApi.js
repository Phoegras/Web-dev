const addManufacturer = async (event) => {
    event.preventDefault();
    const name = document.getElementById('manufacturer-name').value.trim();
  
    if (!name) {
      alert('Manufacturer name cannot be empty.');
      return;
    }
  
    try {
      const response = await fetch('/manufacturers/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Manufacturer added successfully.');
        location.reload(); // Reload to reflect the changes
      } else {
        alert('Failed to add manufacturer.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding the manufacturer.');
    }
  }


const deleteManufacturer = async (id) => {
    const confirmation = confirm('Are you sure you want to delete this manufacturer?');
    if (!confirmation) return;
  
    try {
      const response = await fetch(`/manufacturers/api/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert('Manufacturer deleted successfully.');
        location.reload(); // Reload to reflect the changes
      } else {
        alert('Failed to delete manufacturer.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the manufacturer.');
    }
  };

  const enableEditMode = (id) => {
    document.getElementById(`manufacturer-name-${id}`).classList.add('hidden');
    document.getElementById(`edit-manufacturer-input-${id}`).classList.remove('hidden');
    document.getElementById(`edit-btn-${id}`).classList.add('hidden');
    document.getElementById(`save-btn-${id}`).classList.remove('hidden');
  };
  
  const saveManufacturer = async (id) => {
    const newName = document.getElementById(`edit-manufacturer-input-${id}`).value.trim();
  
    if (!newName) {
      alert('Manufacturer name cannot be empty.');
      return;
    }
  
    try {
      const response = await fetch(`/manufacturers/api/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Edit successfully");
        document.getElementById(`manufacturer-name-${id}`).textContent = newName;
        cancelEditMode(id);
      } else {
        alert("Error editting manufacturer");
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the manufacturer.');
    }
  };
  
  const cancelEditMode = (id) => {
    document.getElementById(`manufacturer-name-${id}`).classList.remove('hidden');
    document.getElementById(`edit-manufacturer-input-${id}`).classList.add('hidden');
    document.getElementById(`edit-btn-${id}`).classList.remove('hidden');
    document.getElementById(`save-btn-${id}`).classList.add('hidden');
  };
  