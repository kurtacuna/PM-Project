// Overview:
// Displays the filter menu

import { renderTable } from "./displayTable.js";

export function listenForClickOnFilter(requests) {
    let filterMenuHTML = `
        <div class="filter-menu js-filter-menu">
            <div class="filter-start-date js-filter-start-date js-filter-option">
                <div>
                    Start Date
                </div>
                <input class="js-start-date" type="date">
            </div>
            <div class="filter-end-date js-filter-end-date js-filter-option">
                <div>
                    End Date
                </div>
                <input class="js-end-date" type="date">
            </div>
            <div class="filter-date-button-container">
                <button class="filter-date-button js-filter-date-button"><b>Filter</b></button>
            </div>
        </div>
    `;

    const filterButton = document.querySelector('.js-filter-button');
    const filterMenuContainer = document.querySelector('.js-filter-menu-container');
    const removeButton = document.querySelector('.js-remove-filter-button');

    filterButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (filterMenuContainer.classList.contains('js-open')) {
            filterMenuContainer.innerHTML = '';
            filterMenuContainer.classList.remove('js-open');
        } else {
            filterMenuContainer.innerHTML = filterMenuHTML;
            filterMenuContainer.classList.add('js-open');

            document.querySelector('.js-filter-date-button').addEventListener('click', () => {
                const pageTitle = document.title;
                const startDate = document.querySelector('.js-start-date').value;
                const endDate = document.querySelector('.js-end-date').value;
                const dateInterval = { startDate, endDate };
                
                if (startDate === '' || endDate === '') {
                    renderTable(requests, pageTitle);
                    removeButton.style.display = 'none';
                    removeButton.classList.remove('open');
                } else {
                    renderTable(requests, pageTitle, dateInterval);
                    displayRemoveButton(requests, pageTitle);
                }
                
                document.querySelector('.js-filter-menu-container').innerText = '';
            });
        }
    });

    // Remove filter menu
    document.body.addEventListener('click', (event) => {
        if (!filterMenuContainer.contains(event.target)) {
            filterMenuContainer.innerHTML = '';
            filterMenuContainer.classList.remove('js-open');
        }
    });
}

function displayRemoveButton(requests, pageTitle) {
    const removeButton = document.querySelector('.js-remove-filter-button');

    removeButton.style.display = 'initial';
    removeButton.classList.add('open');

    removeButton.addEventListener('click', () => {
        renderTable(requests, pageTitle);
        removeButton.style.display = 'none';
        removeButton.classList.remove('open');
    });
}
