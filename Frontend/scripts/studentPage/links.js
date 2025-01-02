// Overview:
// Links for each page in the STUDENT side

import { displayStatusPage } from "./displayStatusPage.js";
import { displayRequestPage } from "./displayRequestPage.js";
import { clearSelected } from "../common/clearSelected.js";
import { getRequests } from "../common/getRequests.js";
import { createWebSocketConnection } from "../common/createWebSocketConnection.js";
import { logout } from "../common/logout.js";
import { serverErrorMessage } from "../common/serverErrorMessage.js";

await initiateLinks();

export async function initiateLinks() {
    // Display STATUS page as default
    console.log('get requests');
    let requests = await getRequests();
    console.log('received requests');
    document.querySelector('.js-top-text').innerHTML = 'STATUS';
    displayStatusPage(requests);

    // Update the rows with updated data 
    document.body.addEventListener('updateRequests', async (event) => {
        requests = JSON.parse(event.detail.requests);
        
        if (document.title === 'Status') {
            // Check if the user is not searching or filtering.
            if (!document.querySelector('.js-search-bar').classList.contains('searching') && !document.querySelector('.js-remove-filter-button').classList.contains('open') && !document.querySelector('.js-filter-menu-container').classList.contains('js-open')) {
                displayStatusPage(requests);
            }
        }
    });

    // Define links for each page
    document.querySelector('.js-sidebar-container').addEventListener('click', async (event) => {
        if (event.target.classList.contains('js-status-link')) {
            clearSelected();
            event.target.classList.add('selected');
            displayStatusPage(requests);
        } else if (event.target.classList.contains('js-request-link')) {
            clearSelected();
            event.target.classList.add('selected');
            displayRequestPage();
        } else if (event.target.classList.contains('js-logout-link')) {
            if (await logout()) {           
                sessionStorage.clear();
                window.location.href = 'studentLogin.html';
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