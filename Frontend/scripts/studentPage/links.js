// Overview:
// Links for each page in the STUDENT side

import { displayStatusPage } from "./displayStatusPage.js";
import { displayRequestPage } from "./displayRequestPage.js";
import { clearSelected } from "../common/clearSelected.js";
import { getRequests } from "../common/getRequests.js";
import { createWebSocketConnection } from "../common/createWebSocketConnection.js";
import { logout } from "../common/logout.js";
import { serverErrorMessage } from "../common/serverErrorMessage.js";

// mockRequests and mockOptions used for testing only

export async function initiateStudentLinks(mockRequests, mockOptions) {
    let requests;

    if (mockRequests) {
        requests = mockRequests;
    } else {
        requests = await getRequests();
    }

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
        const linkElement = event.target.closest('.js-status-link, .js-request-link, .js-logout-link');

        if (linkElement.classList.contains('js-status-link')) {
            clearSelected();
            linkElement.classList.add('selected');
            displayStatusPage(requests);
        } else if (linkElement.classList.contains('js-request-link')) {
            console.clear();
            console.log('request clicked');
            if (mockOptions) {
                clearSelected();
                linkElement.classList.add('selected');
                displayRequestPage(mockOptions);
            } else {
                clearSelected();
                linkElement.classList.add('selected');
                displayRequestPage();
            }
        } else if (linkElement.classList.contains('js-logout-link')) {
            if (await logout()) {           
                sessionStorage.clear();
                window.location.href = 'studentLogin.html';
            } else {
                serverErrorMessage();
            }
        }
    });

    if (!mockRequests) {
        // Create a WebSocket connection for real-time updates on requests
        const username = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
        createWebSocketConnection(username, role);
    }
}