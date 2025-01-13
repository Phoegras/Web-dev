document.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll("thead th[data-sort]");

    headers.forEach(header => {
      header.addEventListener("click", () => {
        const sortKey = header.getAttribute("data-sort");
        const currentOrder = header.dataset.order || "asc"; // Default to ascending order
        const newOrder = currentOrder === "asc" ? "desc" : "asc";
        header.dataset.order = newOrder;
        const indicator = header.querySelector(".sort-indicator");
        indicator.textContent = header.dataset.order === "asc" ? "↑" : "↓";
        // Fetch sorted data
        sortProducts(sortKey, newOrder);
      });
    });
  });

  async function sortProducts(sortKey, order) {
    try{
        const response = await fetch(`/products/api?sort=${sortKey}&order=${order}`);
        if (!response.ok) {
            throw new Error("Failed to fetch sorted products.");
        }
        const data = await response.json();

        renderProducts(data.products);
    }
    catch(error){
        console.error("Error fetching products:", error);
    }
        
  }
  
  function renderProducts(products) {
    const tbody = document.querySelector("tbody");
    if (products.length === 0) {
      tbody.innerHTML =
        '<p class="text-center text-gray-600 font-medium">No products found.</p>';
    }
    else tbody.innerHTML = products
      .map(
        (product) => {
          const statusClass =
                product.status === 'On stock'
                    ? 'bg-success text-success'
                    : product.status === 'Out of stock'
                      ? 'bg-danger text-danger'
                      : product.status === 'Suspend'
                        ? 'bg-warning text-warning'
                          : 'bg-gray-600 text-gray-600';
          return `
      <tr>
        <td class="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <div class="flex items-center">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div class="h-12.5 w-15 rounded-md">
                <img src="${product.images[0]}" alt="${product.name}" />
              </div>
              <p class="text-sm font-medium text-black dark:text-white">${product.name}</p>
            </div>
          </div>
        </td>
        <td class="border-b border-[#eee] px-4 py-5 dark:border-strokedark">${product.category}</td>
        <td class="border-b border-[#eee] px-4 py-5 dark:border-strokedark">${product.manufacturer}</td>
        <td class="border-b border-[#eee] px-4 py-5 dark:border-strokedark">$${product.price}</td>
        <td class="border-b border-[#eee] px-4 py-5 dark:border-strokedark">${product.sold}</td>
        <td class="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p class="inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${ statusClass}">
            ${product.status}
          </p>
        </td>
        <td class="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <div class="flex items-center space-x-3.5">
            <a href="/products/${product.id}"><i class="ri-edit-line"></i></a>
            <button class="hover:text-primary" onclick="deleteProduct('${product.id}')"><i class="ri-delete-bin-6-line"></i></button>
          </div>
        </td>
      </tr>
    `}
      )
      .join("");
  }


  async function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/products/api/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      alert("Product deleted successfully");
      // Optionally, remove the product row from the table or refresh the page
      location.reload();
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    }
  }

  // Pagination
let currentPage = document.getElementById("current-page").innerHTML;
const limit = 10;

const fetchProducts = async (page = 1) => {
  try {
    const response = await fetch(`/products/api/paginated?page=${page}&limit=${limit}`);
    const data = await response.json();

    if (response.ok) {
      renderProducts(data.products);
      updatePaginationControls(data.pagination.currentPage, data.pagination.totalPages);
    } else {
      console.error(data.error);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const filterProducts = async (page = 1) => {
  try {
    const category = document.getElementById("filter-category").value;
    const manufacturer = document.getElementById("filter-manufacturer").value;
    const status = document.getElementById("filter-status").value;
    const name = document.getElementById("search").value;
    console.log("Filtering products for page:", page);
    const queryParams = new URLSearchParams({
      page,
      limit,
      category,
      manufacturer,
      status,
      name,
    });

    const response = await fetch(`/products/api/filter?${queryParams}`);
    const data = await response.json();

    if (response.ok) {
      renderProducts(data.products);
      updatePaginationControls(data.pagination.currentPage, data.pagination.totalPages);
    } else {
      console.error(data.error);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const updatePaginationControls = (current, total) => {
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");
  const currentPageDisplay = document.getElementById("current-page");

  currentPageDisplay.innerHTML = current;

  if (current <= 1) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (current >= total) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }
};

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchProducts(currentPage);
    history.pushState(null, '', `/products?page=${currentPage}&limit=${limit}`);
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  currentPage++;
  fetchProducts(currentPage);
  history.pushState(null, '', `/products?page=${currentPage}&limit=${limit}`);
});

// Fetch the initial page of products
fetchProducts(currentPage);

window.addEventListener('popstate', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = parseInt(urlParams.get('page')) || 1;

  // Re-fetch and render products and pagination based on the updated URL
  await fetchProducts(page);
});
