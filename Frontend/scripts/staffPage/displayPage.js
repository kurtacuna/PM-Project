// Overview
// Displays the appropriate page

import { clearSearch } from '../common/clearSearch.js';
import { renderTable } from './displayTable.js';
import { listenForClickOnFilter } from './displayStaffFilter.js';

export function displayPage(requests, page) {
    document.querySelector('.js-preview-container').innerHTML = '';
    if (document.querySelector('.js-settings')) {
        document.querySelector('.js-settings').innerHTML = '';
    }
    if (document.querySelector('.js-statistics')) {
        document.querySelector('.js-statistics').innerHTML = '';
    }
    clearSearch();
    document.title = page;
    document.querySelector('.js-top-text').innerText = page.toUpperCase();

    if (!document.querySelector('.js-search-container')) {
        displaySearchAndFilter();
    }
    
    renderTable(requests, page);

    // Search for a row from the page's table
    const searchContainer = document.querySelector('.js-search-bar');
    searchContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            let searchQuery = searchContainer.value;
        
            const url = new URL(window.location.href);
            url.searchParams.set('search', searchQuery);
            window.history.replaceState({}, "", url);
            
            document.querySelector('.js-search-bar').classList.add('searching');

            if (searchQuery === '') {
                document.querySelector('.js-remove-filter-button').style.display = 'none';
                document.querySelector('.js-search-bar').classList.remove('searching');
            }

            renderTable(requests, page);
        }
    });

    listenForClickOnFilter(requests);
}

function displaySearchAndFilter() {
    document.querySelector('.js-search-and-filter').innerHTML = `
        <div class="search-container js-search-container">
            <img class="search-icon" src="../images/icons/iconamoon_search-light.png">
            <input class="search-bar js-search-bar" type="text" placeholder="Search for a request">
        </div>
        <div class="filter">
            <div class="filter-and-remove-button">
                <div class="remove-filter-button js-remove-filter-button">
                    &times;
                </div>
                <div class="filter-button js-filter-button">
                    <img class="filter-icon" src="../images/icons/fe_calendar.png">
                    Filter by Date
                </div>
            </div>
            <div class="filter-menu-container js-filter-menu-container"></div>
        </div>
    `;
}
