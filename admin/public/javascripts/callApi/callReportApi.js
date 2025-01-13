async function fetchTopProducts(startDate, endDate, limit = 10) {
    const response = await fetch(`/reports/api/top-products?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    const data = await response.json();
    return data.topProducts;
  }
  
  async function renderTopProductsTable(startDate, endDate) {
    const topProducts = await fetchTopProducts(startDate, endDate);
    const tableContainer = document.querySelector("#top-products");
  
    // Populate rows with top product data
    topProducts.length ?
    tableContainer.innerHTML = topProducts.map((product) => {
      return `
        <div class="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div class="col-span-3 flex items-center">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div class="h-12.5 w-15 rounded-md">
                <img src="${product.image}" alt="${product.name}" />
              </div>
              <p class="text-sm font-medium text-black dark:text-white">${product.name}</p>
            </div>
          </div>
          <div class="col-span-2 hidden items-center sm:flex">
            <p class="text-sm font-medium text-black dark:text-white">${product.category}</p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="text-sm font-medium text-black dark:text-white">$${product.price.toFixed(2)}</p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="text-sm font-medium text-black dark:text-white">${product.sold}</p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="text-sm font-medium text-meta-3">$${product.profit.toFixed(2)}</p>
          </div>
        </div>
      `;
    }).join('')
    : 
    tableContainer.innerHTML =
         `
        <div
            class="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
        >
            <div class="col-span-12 flex flex-row items-center justify-center">
            <p class="text-sm font-medium text-black dark:text-white">
                No products found
            </p>
            </div>
        </div>
    `
    ;
  }

async function getTopProducts(range){

    const buttons = document.querySelectorAll(".range-btn");
    buttons.forEach((button) => button.classList.remove("bg-white", "shadow-card", "dark:bg-boxdark"));
    document.getElementById(`${range}-btn`).classList.add("bg-white", "shadow-card", "dark:bg-boxdark");

    const today = new Date();
    switch (range){
    case 'day':
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        renderTopProductsTable(yesterday, today);
        break;
    case 'week':
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        renderTopProductsTable(lastWeek, today);
        break;
    case 'month':
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        renderTopProductsTable(lastMonth, today);
        break;
    }
}

//   document.getElementById("top-products-form").addEventListener("submit", (e) => {
//     e.preventDefault();
//     const startDate = e.target.startDate.value;
//     const endDate = e.target.endDate.value;
  
//     renderTopProductsTable(startDate, endDate);
//   });
async function fetchRevenue(startDate, endDate) {
    const response = await fetch(`/reports/api/revenue?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    const data = await response.json();
    return data.revenue;
  }
  
  async function renderRevenueTable(startDate, endDate) {
    const revenueData = await fetchRevenue(startDate, endDate);
    const revenueContainer = document.querySelector("#revenue");
  
    // Populate rows with revenue data
    revenueData.length
      ? (revenueContainer.innerHTML = revenueData
          .map((entry) => {
            return `
          <div class="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
            <div class="col-span-2 flex items-center">
              <p class="text-sm font-medium text-black dark:text-white">${entry.date}</p>
            </div>
            <div class="col-span-2 flex items-center">
              <p class="text-sm font-medium text-black dark:text-white">$${entry.totalRevenue.toFixed(2)}</p>
            </div>
            <div class="col-span-1 flex items-center">
              <p class="text-sm font-medium text-black dark:text-white">${entry.totalOrders}</p>
            </div>
            <div class="col-span-1 flex items-center">
              <p class="text-sm font-medium text-meta-3">$${entry.profit.toFixed(2)}</p>
            </div>
          </div>
        `;
          })
          .join(""))
      : (revenueContainer.innerHTML = `
          <div
            class="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
        >
            <div class="col-span-12 flex flex-row items-center justify-center">
            <p class="text-sm font-medium text-black dark:text-white">
                No revenue data found
            </p>
            </div>
        </div>
        `);
  }
  
  async function getRevenue(range) {
    // Update button styles
    const buttons = document.querySelectorAll(".range-revenue-btn");
    buttons.forEach((button) => button.classList.remove("bg-white", "shadow-card", "dark:bg-boxdark"));
    document.getElementById(`${range}-revenue-btn`).classList.add("bg-white", "shadow-card", "dark:bg-boxdark");

  
    // Set date range
    const today = new Date();
    let startDate;
  
    switch (range) {
      case "day":
        startDate = new Date();
        startDate.setDate(today.getDate() - 1);
        break;
      case "week":
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 1);
        break;
    }
  
    await renderRevenueTable(startDate, today);
  }

  