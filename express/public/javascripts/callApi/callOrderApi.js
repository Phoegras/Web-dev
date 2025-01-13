
  let ordersFetched = false;

  document.getElementById('order-tab').addEventListener('click', async () => {
    if (!ordersFetched) {
      const ordersContainer = document.getElementById('order-container');

      try {
        const response = await fetch('/orders/api');
        const result = await response.json();

        if (result.success) {
          const orders = result.data;

          if (orders.length > 0) {
            let ordersHTML = `
              <table class="w-full text-start text-slate-500 dark:text-slate-400">
                <thead class="text-sm uppercase bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th class="px-2 py-3">Order no.</th>
                    <th class="px-2 py-3">Date</th>
                    <th class="px-2 py-3">Status</th>
                    <th class="px-2 py-3">Total</th>
                    <th class="px-2 py-3">Details</th>
                  </tr>
                </thead>
                <tbody>
            `;

            orders.forEach(order => {
              ordersHTML += `
                <tr>
                  <td class="px-2 py-3">${order.id}</td>
                  <td class="px-2 py-3">${new Date(order.createdAt).toLocaleDateString()}</td>
                  <td class="px-2 py-3 ${getStatusClass(order.status)}">${order.status}</td>
                  <td class="px-2 py-3">$${order.totalAmount}</td>
                  <td class="px-2 py-3">
                    <button onclick="toggleOrderDetails('${order.id}')">View Details</button>
                  </td>
                </tr>
                <tr id="details-${order.id}" class="hidden">
                  <td colspan="5">
                    <ul>
                      ${order.orderItem
                        .map(
                          item => `
                          <li>
                            ${item.product.name} - Size: ${item.size} - Quantity: ${item.quantity} - $${item.product.price}
                          </li>
                        `
                        )
                        .join('')}
                    </ul>
                  </td>
                </tr>
              `;
            });

            ordersHTML += `
                </tbody>
              </table>
            `;

            ordersContainer.innerHTML = ordersHTML;
          } else {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
          }

          ordersFetched = true;
        } else {
          ordersContainer.innerHTML = '<p>Failed to load orders.</p>';
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        ordersContainer.innerHTML = '<p>Error loading orders.</p>';
      }
    }
  });

  function toggleOrderDetails(orderId) {
    const detailsRow = document.getElementById(`details-${orderId}`);
    detailsRow.classList.toggle('hidden');
  }

  function getStatusClass(status) {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600';
      case 'Paid':
        return 'text-blue-600';
      case 'Shipped':
        return 'text-orange-600';
      case 'Delivered':
        return 'text-green-600';
      default:
        return 'text-slate-500';
    }
  }
