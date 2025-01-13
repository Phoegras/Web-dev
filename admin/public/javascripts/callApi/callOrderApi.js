document.addEventListener('DOMContentLoaded', () => {
    const filterOrderIdInput = document.getElementById('filter-order-id');
    const filterOrderStatusSelect = document.getElementById('filter-order-status');
    const applyFiltersButton = document.getElementById('apply-order-filter');
    const confirmButton = document.getElementById('confirm-btn');
  
    let currentPage = 1;
    const limit = 10;
    let sortKey = 'createdAt';
    let sortOrder = 'desc';
  
    const fetchOrders = async () => {
        try {
            const orderId = filterOrderIdInput.value || '';
            const status = filterOrderStatusSelect.value || '';
            const response = await fetch(
            `/orders/api?page=${currentPage}&limit=${limit}&sort=${sortKey}&order=${sortOrder}&orderId=${orderId}&status=${status}`,
            {
                headers: {
                'Accept': 'application/json',
                },
            }
            );
        
            if (!response.ok) throw new Error('Failed to fetch orders.');
            
            const data = await response.json();

            renderTable(data.orders);
            updatePagination(data.pagination);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
        };
      
  
    const renderTable = (orders) => {
      const tbody = document.querySelector('tbody');
      tbody.innerHTML = orders
        .map(
          (order) => `
          <tr class="border-b border-[#eee] dark:border-strokedark">
            <td class="px-4 py-5 xl:pl-11">
              <a href="/orders/${order.id}" class="text-primary">${order.id}</a>
            </td>
            <td class="px-4 py-5">
              <p class="text-sm font-medium text-black dark:text-white">
                ${order.user?.userProfile?.name || 'N/A'}
              </p>
            </td>
            <td class="px-4 py-5">
              <p class="text-sm text-black dark:text-white">${order.createdAt}</p>
            </td>
            <td class="px-4 py-5">
              <p class="text-sm text-black dark:text-white">$${order.totalAmount}</p>
            </td>
            <td class="px-4 py-5">
              <div class="relative">
                <select id="status-select-${order.id}" class="border rounded-md px-2 py-1 bg-white dark:bg-gray-800 dark:text-white">
                  <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Paid" ${order.status === 'Paid' ? 'selected' : ''}>Paid</option>
                  <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                  <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
            </td>
            <td class="px-4 py-5">
              <div class="flex items-center space-x-3.5">
                <button
                  class="hover:text-green-500"
                  onclick="confirmStatusUpdate('${order.id}')"
                >
                  Confirm
                </button>
              </div>
            </td>
          </tr>
        `
        )
        .join('');
    };
  
    const updatePagination = ({ currentPage: current, totalPages }) => {
      const prevButton = document.getElementById('prev-page');
      const nextButton = document.getElementById('next-page');
      const currentPageDisplay = document.getElementById('current-page');
  
      prevButton.disabled = current <= 1;
      nextButton.disabled = current >= totalPages;
      currentPageDisplay.textContent = current;
    };
  
    document.getElementById('prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchOrders();
      }
    });
  
    document.getElementById('next-page').addEventListener('click', () => {
      currentPage++;
      fetchOrders();
    });
  
    applyFiltersButton.addEventListener('click', () => {
      currentPage = 1; // Reset to the first page when applying filters
      fetchOrders();
    });
  
    document.querySelectorAll('th[data-sort]').forEach((header) => {
      header.addEventListener('click', () => {
        const newSortKey = header.getAttribute('data-sort');
        sortOrder = sortKey === newSortKey && sortOrder === 'asc' ? 'desc' : 'asc';
        sortKey = newSortKey;
        fetchOrders();
      });
    });

    fetchOrders();
});

const confirmStatusUpdate = (orderId) => {
    const select = document.getElementById(`status-select-${orderId}`);
    const newStatus = select.value;
      console.log("hello")
    if (confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      fetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
        .then((response) => {
          if (response.ok) {
            alert('Order status updated successfully.');
          } else {
            throw new Error('Failed to update order status.');
          }
        })
        .catch((error) => {
          console.error('Error updating order status:', error);
          alert('Failed to update order status.');
        });
    }
};
