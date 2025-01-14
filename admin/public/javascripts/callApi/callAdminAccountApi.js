document.addEventListener('DOMContentLoaded', () => {
  const filterNameInput = document.getElementById('filter-name');
  const filterEmailInput = document.getElementById('filter-email');
  const applyFiltersButton = document.getElementById('apply-filter');

  let currentPage = 1;
  const limit = 10;
  let sortKey = 'id';
  let sortOrder = 'asc';

  const fetchAccounts = async () => {
    try {
      const name = filterNameInput.value || '';
      const email = filterEmailInput.value || '';
      const response = await fetch(
        `/accounts/admin/api?page=${currentPage}&limit=${limit}&sort=${sortKey}&order=${sortOrder}&name=${name}&email=${email}`
      );

      if (!response.ok) throw new Error('Failed to fetch accounts.');

      const data = await response.json();
      renderTable(data.accounts);
      updatePagination(data.pagination);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const renderTable = (accounts) => {
      const tbody = document.querySelector('tbody');
      tbody.innerHTML = accounts
        .map(
          (account) => `
            <tr class="border-b border-[#eee] dark:border-strokedark">
              <td class="px-4 py-5 xl:pl-11">
                <img
                  src="${account.adminProfile.avatar}"
                  alt="${account.adminProfile?.name || 'Avatar'}"
                  class="w-10 h-10 rounded-full"
                />
              </td>
              <td class="px-4 py-5">
                <a href="/admins/${account.id}" class="text-sm font-medium text-black dark:text-white">
                  ${account.adminProfile?.name || 'N/A'}
                  ${account.isCurrentUser ? '<span class="text-primary font-bold">(You)</span>' : ''}
                </a>
              </td>
              <td class="px-4 py-5">
                <p class="text-sm text-black dark:text-white">${account.email}</p>
              </td>
              <td class="px-4 py-5">
                <p class="text-sm text-black dark:text-white">${account.emailVerifiedAt || 'N/A'}</p>
              </td>
              <td class="px-4 py-5">
                <p
                  class="inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    account.status === 'ACTIVE'
                      ? 'bg-success bg-opacity-10 text-success'
                      : 'bg-danger bg-opacity-10 text-danger'
                  }"
                >
                  ${account.status}
                </p>
              </td>
              <td class="px-4 py-5">
                <div class="flex items-center space-x-3.5">
                  ${
                    account.isCurrentUser
                      ? '<span class="text-gray-400">Cannot ban yourself</span>'
                      : `
                        ${account.status === 'ACTIVE'
                          ? `
                            <button
                              class="hover:text-red-500"
                              onclick="handleBan('${account.id}')"
                            >
                              Ban
                            </button>
                          `
                          : `
                            <button
                              class="hover:text-green-500"
                              onclick="handleUnban('${account.id}')"
                            >
                              Unban
                            </button>
                          `}
                      `
                  }
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
      fetchAccounts();
    }
  });

  document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchAccounts();
  });

  applyFiltersButton.addEventListener('click', () => {
    currentPage = 1; // Reset to the first page when applying filters
    fetchAccounts();
  });

  document.querySelectorAll('th[data-sort]').forEach((header) => {
    header.addEventListener('click', () => {
      const newSortKey = header.getAttribute('data-sort');
      sortOrder = sortKey === newSortKey && sortOrder === 'asc' ? 'desc' : 'asc';
      sortKey = newSortKey;
      fetchAccounts();
    });
  });

  // Fetch the initial data
  fetchAccounts();
});


function handleBan(accountId) {
  if (confirm('Are you sure you want to ban this account?')) {
      fetch(`/accounts/admin/ban/${accountId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
      })
          .then((response) => {
              if (response.ok) {
                  alert('Account has been banned successfully.');
                  location.reload();
              } else {
                  return response.json().then((error) => {
                      throw new Error(error.message);
                  });
              }
          })
          .catch((error) => {
              console.error('Error banning account:', error);
              alert(error);
          });
  }
}

function handleUnban(accountId) {
  if (confirm('Are you sure you want to unban this account?')) {
      fetch(`/accounts/admin/unban/${accountId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
      })
          .then((response) => {
              if (response.ok) {
                  alert('Account has been unbanned successfully.');
                  location.reload();
              } else {
                  return response.json().then((error) => {
                      throw new Error(error.message);
                  });
              }
          })
          .catch((error) => {
              console.error('Error unbanning account:', error);
              alert(error);
          });
  }
}

