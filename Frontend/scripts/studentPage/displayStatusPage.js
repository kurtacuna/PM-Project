// Overview:
// Displays the 'STATUS' page

import { renderStudentTable } from "./displayStudentTable.js";
import { displayStudentFilterOnClick } from "./displayStudentFilter.js";
import { clearSearch } from '../common/clearSearch.js';

export function displayStatusPage(requests) {
    document.querySelector('.js-forms-container').innerHTML = '';
    clearSearch();
    document.title = 'Status';
    document.querySelector('.js-top-text').innerText = 'STATUS';

    if (!document.querySelector('.js-search-and-filter')) {
        displaySearchAndFilter();
    }

    document.querySelector('.js-table-container').innerHTML = `
        <table cellspacing="0">
            <thead class="table-headers-container">
                <tr class="table-headers">
                    <th class="number-column">
                        [${requests.length}]
                    </th>
                    <th class="request-id-column">
                        Request ID
                    </th>
                    <th class="requested-document-column">
                        Requested Document
                    </th>
                    <th class="date-requested-column">
                        Date Requested
                    </th>
                    <th class="status-column">
                        Status
                    </th>
                </tr>
            </thead>
            <tbody class="js-requests-container"></tbody>
        </table>
    `;

    renderStudentTable(requests, '');
    displayStudentFilterOnClick(requests);

    // Search for a specific row
    const searchContainer = document.querySelector('.js-search-bar');
    searchContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchQuery = searchContainer.value;

            const url = new URL(window.location.href);
            url.searchParams.set('search', searchQuery);
            window.history.replaceState({}, "", url);

            document.querySelector('.js-search-bar').classList.add('searching');

            if (searchQuery === '') {
                document.querySelector('.js-remove-filter-button').style.display = 'none';
                document.querySelector('.js-search-bar').classList.remove('searching');
            }

            renderStudentTable(requests, '', searchQuery);
        }
    });
}



function displaySearchAndFilter() {
    document.querySelector('.js-search-and-filter-container').innerHTML = `
        <div class="search-and-filter js-search-and-filter">
            <div class="search-container">
                <img class="search-icon" src="../images/icons/iconamoon_search-light.png">
                <input class="search-bar js-search-bar" type="text" placeholder="Search for a request">
            </div>
            <div class="filter">
                <div class="filter-and-remove-button">
                    <div class="remove-filter-button js-remove-filter-button">
                        &times;
                    </div>
                    <div class="filter-button js-filter-button">
                        <img class="filter-icon" src="../images/icons/solar_filter-outline.png">
                        Filter by
                    </div>
                </div>
                <div class="filter-menu-container js-filter-menu-container"></div>
            </div>
        </div>
    `;
}
