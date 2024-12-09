/*********************/
/*    Pagination     */
/*********************/
async function renderProducts(products) {
    if (!products.length) {
        return '<p>No products available.</p>';
    }

    return products.map(product => {
        const labelClass = product.label === 'New' ? 'bg-orange-600' :
            product.label === 'Sale' ? 'bg-blue-600' :
                product.label === 'Featured' ? 'bg-green-600' :
                    product.label === 'Popular' ? 'bg-cyan-500' : 'bg-gray-600';

        return `
        <div class="group">
            <div class="relative overflow-hidden shadow dark:shadow-gray-800 group-hover:shadow-lg group-hover:dark:shadow-gray-800 rounded-md duration-500">
                <a href="/products/${product.id}">
                    <img src="${product.images[0] || '/images/placeholder-image.png'}" alt="${product.name}">
                </a>
                <ul class="list-none absolute top-[10px] end-4 opacity-0 group-hover:opacity-100 duration-500">
                    <li>
                        <a href="javascript:void(0)" class="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white">
                            <i class="mdi mdi-heart"></i>
                        </a>
                    </li>
                    <li class="mt-1">
                        <a href="/products/${product.id}" class="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white">
                            <i class="mdi mdi-eye-outline"></i>
                        </a>
                    </li>
                    <li class="mt-1">
                        <a href="javascript:void(0)" class="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white">
                            <i class="mdi mdi-bookmark-outline"></i>
                        </a>
                    </li>
                </ul>
                ${product.label ? `
                <ul class="list-none absolute top-[10px] start-4">
                    <li>
                        <a href="javascript:void(0)" class="text-white text-[10px] font-bold px-2.5 py-0.5 rounded h-5 ${labelClass}">
                            ${product.label}
                        </a>
                    </li>
                </ul>` : ''}
            </div>
            <div class="mt-4">
                <a href="/products/${product.id}" class="hover:text-indigo-600 text-lg font-semibold">
                    ${product.name}
                </a>
                <div class="flex justify-between items-center mt-1">
                    <p class="text-green-600">
                        $${product.price}
                        ${product.originalPrice ? `<del class="text-red-600">$${product.originalPrice}</del>` : ''}
                    </p>
                    <ul class="font-medium text-amber-400 list-none">
                        <li class="inline">
                            <i class="mdi mdi-star"></i>
                            <span>${product.rating || 0}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        `;
    }).join('');
}
async function renderPagination(pagination) {
    if (!pagination || pagination.totalPages <= 1) {
        return ''; // No pagination needed if there's only one page
    }

    const { currentPage, totalPages, limit } = pagination;

    // Helper function for creating button classes
    const getButtonClass = (isDisabled, isActive) => {
        if (isDisabled) {
            return 'pointer-events-none opacity-50 cursor-not-allowed text-slate-300 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600';
        }
        if (isActive) {
            return 'text-white bg-indigo-600 border border-indigo-600';
        }
        return 'text-slate-400 bg-white dark:bg-slate-900 hover:text-white border border-gray-100 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600';
    };

    // Generate buttons
    const buttons = [];

    // Previous Button
    buttons.push(`
        <li>
            <button
                class="size-[40px] inline-flex justify-center items-center ${getButtonClass(currentPage <= 1)}"
                onclick="loadProducts(null, null, null, ${currentPage - 1}, ${limit})"
                ${currentPage <= 1 ? 'disabled' : ''}>
                <i class="uil uil-angle-left text-[20px] rtl:rotate-180 rtl:-mt-1"></i>
            </button>
        </li>
    `);

    // Page Numbers
    for (let page = 1; page <= totalPages; page++) {
        if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 2 && page <= currentPage + 2)
        ) {
            buttons.push(`
                <li>
                    <button
                        class="size-[40px] inline-flex justify-center items-center ${getButtonClass(false, page === currentPage)}"
                        onclick="loadProducts(null, null, null, ${page}, ${limit})">
                        ${page}
                    </button>
                </li>
            `);
        } else if (
            (page === currentPage - 3 || page === currentPage + 3) &&
            totalPages > 6
        ) {
            buttons.push('<li><span class="size-[40px] text-gray-400">...</span></li>');
        }
    }

    // Next Button
    buttons.push(`
        <li>
            <button
                class="size-[40px] inline-flex justify-center items-center ${getButtonClass(currentPage >= totalPages)}"
                onclick="loadProducts(null, null, null, ${currentPage + 1}, ${limit})"
                ${currentPage >= totalPages ? 'disabled' : ''}>
                <i class="uil uil-angle-right text-[20px] rtl:rotate-180 rtl:-mt-1"></i>
            </button>
        </li>
    `);

    return `<ul class="inline-flex items-center -space-x-px">${buttons.join('')}</ul>`;
}
async function loadProducts(search = null, category = null, sort = null, page = null, limit = null) {
    try {
        // Build query string dynamically
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (sort) params.append('sort', sort);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);

        // Send AJAX request
        const response = await fetch(`/products?${params.toString()}`);
        const data = await response.json();

        // Render product list
        const productContainer = document.querySelector('#content-container');
        productContainer.innerHTML = await renderProducts(data.products);

        // Render pagination
        const paginationContainer = document.querySelector('#pagination-container');
        paginationContainer.innerHTML = await renderPagination(data.pagination);

        // Update browser URL
        history.pushState(null, '', `/products?${params.toString()}`);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

window.addEventListener('popstate', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    const limit = parseInt(urlParams.get('limit')) || 9;

    // Re-fetch and render products and pagination based on the updated URL
    await loadProducts(page, limit);
});