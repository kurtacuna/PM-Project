// Overview:
// Links for each page in the STAFF side
// Admin links not included

import { displayPage } from "./displayPage.js";
import { clearSelected } from "../common/clearSelected.js";
import { getRequests } from "../common/getRequests.js";
import { createWebSocketConnection } from "../common/createWebSocketConnection.js";

// Display the 'PENDING' page as default
let requests = await getRequests();
displayPage(requests, 'Pending');

// Update the rows with updated data
document.body.addEventListener('updateRequests', async (event) => {
    requests = JSON.parse(event.detail.requests);

    // Check if the page content is not a preview
    if (document.querySelector('.js-preview-container').innerHTML === '') {
        if (document.querySelector('.js-search-bar')) {
            // Check if the user is not searching or filtering.
            if (!document.querySelector('.js-search-bar').classList.contains('searching') && !document.querySelector('.js-remove-filter-button').classList.contains('open') && !document.querySelector('.js-filter-menu-container').classList.contains('js-open')) {
                if (document.title === 'Pending') {
                    displayPage(requests, 'Pending');
                } else if (document.title === 'To Receive') {
                    displayPage(requests, 'To Receive');
                } else if (document.title === 'Released') {
                    displayPage(requests, 'Released');
                } else if (document.title ===' Rejected') {
                    displayPage(requests, 'Rejected');
                }
            }
        }
    }
});

// Define links for each page
document.querySelector('.js-sidebar-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('js-pending-link')) {
        clearSelected();
        event.target.classList.add('selected');
        displayPage(requests, 'Pending');
    } else if (event.target.classList.contains('js-to-receive-link')) {
        clearSelected();
        event.target.classList.add('selected');
        displayPage(requests, 'To Receive');
    } else if (event.target.classList.contains('js-released-link')) {
        clearSelected();
        event.target.classList.add('selected');
        displayPage(requests, 'Released');
    } else if (event.target.classList.contains('js-rejected-link')) {
        clearSelected();
        event.target.classList.add('selected');
        displayPage(requests, 'Rejected');
    } else if (event.target.classList.contains('js-logout-link')) {
        sessionStorage.clear();
        window.location.href = 'staffLogin.html';
    }
});

// Create a WebSocket connection for real-time updates on requests
const username = sessionStorage.getItem('username');
const role = sessionStorage.getItem('role');
createWebSocketConnection(username, role);