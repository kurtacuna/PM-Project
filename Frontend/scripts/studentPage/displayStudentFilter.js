// Overview:
// Displays the filter menu

import { renderStudentTable } from './displayStudentTable.js';

export function displayStudentFilterOnClick(requests) {
    let filterMenuHTML = `
        <div class="filter-menu js-filter-menu">
            <div class="filter-option filter-pending js-filter-pending js-filter-option">
                Pending
            </div>
            <div class="filter-option filter-to-receive js-filter-to-receive js-filter-option">
                To Receive
            </div>
            <div class="filter-option filter-released js-filter-released js-filter-option">
                Released
            </div>
            <div class="filter-option filter-rejected js-filter-rejected js-filter-option">
                Rejected
            </div>
        </div>
    `;

    const filterButton = document.querySelector('.js-filter-button');
    const filterMenuContainer = document.querySelector('.js-filter-menu-container');

    filterButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (filterMenuContainer.classList.contains('js-open')) {
            filterMenuContainer.innerHTML = '';
            filterMenuContainer.classList.remove('js-open');
        } else {
            filterMenuContainer.innerHTML = filterMenuHTML;
            filterMenuContainer.classList.add('js-open');

            document.querySelector('.js-filter-pending').addEventListener('click', () => {
                renderStudentTable(requests, 'Pending');
                displayRemoveButton(requests);
            });
            document.querySelector('.js-filter-to-receive').addEventListener('click', () => {
                renderStudentTable(requests, 'To Receive');
                displayRemoveButton(requests);
            });
            document.querySelector('.js-filter-released').addEventListener('click', () => {
                renderStudentTable(requests, 'Released');
                displayRemoveButton(requests);
            });
            document.querySelector('.js-filter-rejected').addEventListener('click', () => {
                renderStudentTable(requests, 'Rejected');
                displayRemoveButton(requests);
            });
            document.querySelectorAll('.js-filter-option').forEach((option) => {
                option.addEventListener('click', () => {
                    document.querySelector('.js-filter-menu-container').innerHTML = '';
                });
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

    function displayRemoveButton(requests) {
        const removeButton = document.querySelector('.js-remove-filter-button');

        removeButton.style.display = 'initial';
        removeButton.classList.add('open');

        removeButton.addEventListener('click', () => {
            renderStudentTable(requests, '');
            removeButton.style.display = 'none';
            removeButton.classList.remove('open');
        });
    }
}