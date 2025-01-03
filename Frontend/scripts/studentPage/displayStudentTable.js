// Overview:
// Displays the table in the 'STATUS' page

import { filterArray } from '../common/filter.js';
import { search, matchRequest } from '../common/search.js';
import { styleRows } from '../common/rowStyle.js';
import { formatDateTime, formatDateSameLine } from '../common/retrieveDate.js';

export function renderStudentTable(requests, filter, searchQuery) {
    let tableArray = requests;

    if (tableArray.length === 0 ) {
        document.querySelector('.js-no-requests-container').innerHTML = `
            <div class="no-request">
                <div class="message">
                    No request found.
                </div>  
            </div>
        `;
    } else {
        document.querySelector('.js-no-requests-container').innerHTML = '';

        const url = new URL(window.location.href);
        searchQuery = url.searchParams.get('search');

        if (searchQuery) {
            tableArray = search(tableArray, searchQuery, filter);
        } else {
            tableArray = filterArray(tableArray, filter);
        }

        let tableHTML = '';
        
        tableArray.forEach((item, index) => {
            let inlineStyle = styleRows(index);

            tableHTML += `
                <tr class="request request-${item.request_id}" ${inlineStyle} data-request-id="${item.request_id}">
                    <td>
                        ${index + 1}.
                    </td>
                    <td>
                        ${item.request_id}
                    </td>
                    <td>
                        ${item.document_type}
                    </td>
                    <td>
                        ${formatDateTime(item.date_requested)}
                    </td>
                    <td style="color: ${setStatusColor(item.status)}">
                        ${item.status}
                    </td>
                </tr>
            `;
        });

        document.querySelector('.js-requests-container').innerHTML = tableHTML;
        displayStatusOnRequestClick(requests);
    }
}

function setStatusColor(status) {
    if (status === 'Pending') {
        return '#ffee00';
    } else if (status === 'To Receive') {
        return '#d0ff00';
    } else if (status === 'Released') {
        return 'rgb(0 191 0)';
    } else if (status === 'Rejected') {
        return 'red';
    }
}

// Display the status modal for a row in the 'STATUS' page
function displayStatusOnRequestClick(requests) {
    document.querySelectorAll('.request').forEach((item) => {
        item.addEventListener('click', (event) => {
            event.stopPropagation();
            const { requestId } = item.dataset;
            const matchingRequest = matchRequest(requests, requestId);
            console.log(matchingRequest);
        
            let statusHTML = '';

            if (matchingRequest.status === 'Pending') {
                statusHTML = `
                    <div class="status-pending">
                        <div class="status-header">
                            STATUS:
                            <span class="pending">PENDING</span>
                            <div class="admin-id" style="font-weight: normal; font-size: 15px">
                                ${displayStaff(matchingRequest.staff_id)}
                            </div>
                        </div>
                        <div class="modal-inner-container">
                            <div class="modal-inner-header">
                                DETAILS
                            </div>
                            <p>
                                <b>GCASH Reference Number:</b> ${matchingRequest.reference_number}<br>
                                <b>Cost:</b> ${matchingRequest.cost} PESOS
                            </p>
                            <p>This requested document is pending. Please wait while we process your request.</p>
                            <p class="remarks">
                                ${displayRemarks(matchingRequest.remarks)}
                            </p>
                        </div>
                    </div>
                `;
            } else if (matchingRequest.status === 'To Receive') {
                statusHTML = `
                    <div class="status-to-receive">
                        <div class="status-header">
                            STATUS:
                            <span class="to-receive">TO RECEIVE</span>
                            <div class="date-completed" style="font-weight: normal; font-size: 15px;">
                                ${formatDateSameLine(matchingRequest.date_completed)}
                            </div>
                            <div class="admin-id" style="font-weight: normal; font-size: 15px">
                                ${displayStaff(matchingRequest.staff_id)}
                            </div>
                        </div>

                        <div class="modal-inner-container">
                            <div class="modal-inner-header">
                                DETAILS
                            </div>
                            <p>
                                <b>GCASH Reference Number:</b> ${matchingRequest.reference_number}<br>
                                <b>Cost:</b> ${matchingRequest.cost} PESOS
                            </p>
                            <p>This document is ready to be released. Please go to the registrar and present the reference number of your payment confirmation for validation.</p>
                            <p class="remarks">
                                ${displayRemarks(matchingRequest.remarks)}
                            </p>
                        </div>
                    </div>
                `;
            } else if (matchingRequest.status === 'Released') {
                statusHTML = `
                    <div class="status-released">
                        <div class="status-header">
                            STATUS:
                            <span class="released">RELEASED</span>
                            <div class="date-released" style="font-weight: normal; font-size: 15px;">
                                ${formatDateSameLine(matchingRequest.date_released)}
                            </div>
                            <div class="admin-id" style="font-weight: normal; font-size: 15px">
                                ${displayStaff(matchingRequest.staff_id)}
                            </div>
                        </div>
                        <div class="modal-inner-container">
                            <div class="modal-inner-header">
                                DETAILS
                            </div>
                            <p>
                                <b>GCASH Reference Number:</b> ${matchingRequest.reference_number}<br>
                                <b>Cost:</b> ${matchingRequest.cost} PESOS
                            </p>
                            <p>This document has been released.</p>
                            <p class="remarks">
                                ${displayRemarks(matchingRequest.remarks)}
                            </p>
                        </div>
                    </div>
                `;
            } else if (matchingRequest.status === 'Rejected') {
                statusHTML = `
                    <div class="status-rejected">
                        <div class="status-header">
                            STATUS:
                            <span class="rejected">REJECTED</span>
                            <div class="date-rejected" style="font-weight: normal; font-size: 15px;">
                                ${formatDateSameLine(matchingRequest.date_rejected)}
                            </div>
                            <div class="admin-id" style="font-weight: normal; font-size: 15px">
                                ${displayStaff(matchingRequest.staff_id)}
                            </div>
                        </div>
                        <div class="modal-inner-container">
                            <div class="modal-inner-header">
                                DETAILS
                            </div>
                            <p>
                                <b>GCASH Reference Number:</b> ${matchingRequest.reference_number}<br>
                                <b>Cost:</b> ${matchingRequest.cost} PESOS
                            </p>
                            <p>This document has been rejected.</p>
                            <p class="remarks">
                                ${displayRemarks(matchingRequest.remarks)}
                            </p>
                        </div>
                    </div>
                `;
            }

            let statusOverlayHTML = `
                <div class="overlay js-overlay">
                    <div class="modal status-modal">
                        ${statusHTML}
                        <button class="button-container js-close-button">
                            Close
                        </button>
                    </div>
                </div>
            `;

            const overlayContainer = document.querySelector('.js-overlay-container');

            overlayContainer.innerHTML = statusOverlayHTML;

            const overlay = document.querySelector('.js-overlay');

            overlay.addEventListener('click', (event) => {
                if (event.target.classList.contains('js-close-button')) {
                    overlayContainer.innerHTML = '';
                } else if (event.target.classList.contains('js-overlay')) {
                    overlayContainer.innerHTML = '';
                }
            });
        });
    });
}


function displayStaff(staff) {
    if (staff) {
        return `
            <b>Updated By:</b> ${staff}
        `;
    } else {
        return '';
    }
}

function displayRemarks(remarks) {
    if (remarks) {
        return `
            <b>Remarks:</b> ${remarks}
        `;
    } else {
        return '';
    }
}