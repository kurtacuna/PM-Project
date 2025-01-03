// Overview:
// Links for each page in the STAFF side
// Admin links not included

import { displayPage } from "./displayPage.js";
import { clearSelected } from "../common/clearSelected.js";
import { getRequests } from "../common/getRequests.js";
import { createWebSocketConnection } from "../common/createWebSocketConnection.js";
import { logout } from "../common/logout.js";

export async function initiateStaffLinks(mockRequests) {
    let requests;
    
    if (mockRequests) {
        requests = mockRequests;
    } else {
        requests = await getRequests();
    }

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
    document.querySelector('.js-sidebar-container').addEventListener('click', async (event) => {
        const linkElement = event.target.closest('.js-pending-link, .js-to-receive-link, .js-released-link, .js-rejected-link, .js-logout-link');

        if (linkElement.classList.contains('js-pending-link')) {
            clearSelected();
            linkElement.classList.add('selected');
            displayPage(requests, 'Pending');
        } else if (linkElement.classList.contains('js-to-receive-link')) {
            clearSelected();
            linkElement.classList.add('selected');
            displayPage(requests, 'To Receive');
        } else if (linkElement.classList.contains('js-released-link')) {
            clearSelected();
            linkElement.classList.add('selected');
            displayPage(requests, 'Released');
        } else if (linkElement.classList.contains('js-rejected-link')) {
            clearSelected();
            linkElement.classList.add('selected');
            displayPage(requests, 'Rejected');
        } else if (linkElement.classList.contains('js-logout-link')) {
            if (await logout()) {           
                sessionStorage.clear();
                window.location.href = 'staffLogin.html';
            } else {
                serverErrorMessage();
            }
        }
    });

    // Create a WebSocket connection for real-time updates on requests
    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
    createWebSocketConnection(username, role);
}