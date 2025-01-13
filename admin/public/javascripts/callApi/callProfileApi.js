function enableEditMode() {
    document.getElementById("fullName").disabled = false;
    document.getElementById("phoneNumber").disabled = false;
    document.getElementById("birthday").disabled = false;
    document.getElementById("address").disabled = false;
  
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("saveBtn").style.display = "inline-block";
    document.getElementById("cancelBtn").style.display = "inline-block";
  }
  
  // Cancel edit mode
  function cancelEdit() {
    document.getElementById("fullName").disabled = true;
    document.getElementById("phoneNumber").disabled = true;
    document.getElementById("birthday").disabled = true;
    document.getElementById("address").disabled = true;
  
    document.getElementById("editBtn").style.display = "inline-block";
    document.getElementById("saveBtn").style.display = "none";
    document.getElementById("cancelBtn").style.display = "none";
  }
  
  // Save changes and update via API
  async function saveChanges() {
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
      const birthday = document.getElementById("birthday").value || null;
    const address = document.getElementById("address").value;
  
    const updatedData = {
      name: fullName,
      phone: phoneNumber,
      birthday: birthday,
      address: address,
    };
  
    try {
      const response = await fetch('/admins/update-profile', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      const result = await response.json();
      alert("Profile updated successfully!");
  
      // Reset to view mode
      cancelEdit();
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
}

// Update Avatar
const changeButton = document.getElementById("change-photo");
const cancelButton = document.getElementById("cancel-upload");
const uploadSection = document.getElementById("upload-section");
const photoView = document.getElementById("photo-view");
const photoInput = document.getElementById("photo-input");
const saveButton = document.getElementById("save-avt");

changeButton.addEventListener("click", () => {
    photoView.classList.add("hidden");
    uploadSection.classList.remove("hidden");
});

cancelButton.addEventListener("click", () => {
    uploadSection.classList.add("hidden");
    photoView.classList.remove("hidden");
});

saveButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const file = photoInput.files[0];
  if (!file) {
    alert("Please select a file before saving.");
    return;
  }

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await fetch("/admins/upload-avatar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload photo");
    }

    const result = await response.json();
    alert("Photo uploaded successfully!");
    console.log(result);
  } catch (error) {
    console.error("Error uploading photo:", error);
    alert("An error occurred while uploading the photo.");
  }
});

document.getElementById('photo-input').addEventListener('change', function () {
    const file = this.files[0];
    const preview = document.getElementById('photo-preview');
    const fileUpload = document.getElementById('FileUpload');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
        fileUpload.classList.add('hidden');
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
});