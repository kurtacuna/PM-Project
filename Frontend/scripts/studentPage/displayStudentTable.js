// Overview:
// Displays the table in the 'STATUS' page

import { filterArray } from '../common/filter.js';
import { search, matchRequest } from '../common/search.js';
import { styleRows } from '../common/rowStyle.js';
import { formatDateTime, formatDateSameLine } from '../common/retrieveDate.js';
import { refreshAccessToken } from '../common/refreshAccessToken.js';
import { serverErrorMessage } from '../common/serverErrorMessage.js';

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
        
            let status = '';
            let date = '';

            if (matchingRequest.status === 'Pending') {
                status = 'PENDING'
                date = '';
            } else if (matchingRequest.status === 'To Receive') {
                status = 'TO RECEIVE';
                date = matchingRequest.date_completed;
            } else if (matchingRequest.status === 'Released') {
                status = 'RELEASED';
                date = matchingRequest.date_released;
            } else if (matchingRequest.status === 'Rejected') {
                status = 'REJECTED';
                date = matchingRequest.date_rejected;
            }

            const statusHTML = showStatusDetails(
                status,
                date,
                matchingRequest
            );

            const statusOverlayHTML = `
                <div class="overlay js-overlay">
                    <div class="modal status-modal">
                        ${statusHTML}
                        <div class="buttons-container">
                            <button class="button-container js-close-button">
                                Close
                            </button>
                            ${matchingRequest.status === 'Pending' && matchingRequest.approval === 'No' && matchingRequest.delivery_fee ? `
                                <button class="js-approve-button">
                                    Approve
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;

            
            const overlayContainer = document.querySelector('.js-overlay-container');
            overlayContainer.innerHTML = statusOverlayHTML;

            document.querySelector('.js-overlay').addEventListener('click', async (event) => {
                if (event.target.classList.contains('js-approve-button')) {
                    console.log('approve');
                    if (await approveFee(matchingRequest.request_id)) {
                        document.querySelector('.js-approve-button').innerText = 'Approved';
                        document.querySelector('.js-approve-button').style.backgroundImage = 'radial-gradient(circle at center, #2ca018 30%, rgb(19 117 0))';
                    } else {
                        serverErrorMessage();
                    }
                } else if (event.target.classList.contains('js-close-button')) {
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

function showStatusDetails(status, date, matchingRequest) {
    return `
        <div class="status">
            <div class="status-header js-status-header">
                STATUS:
                <span class="${status.toLowerCase()}">${status}</span>
                <div class="delivery-fee">
                    ${matchingRequest.receiving_option === 'Delivery' && matchingRequest.delivery_fee ? `
                        <b>${matchingRequest.approval === 'Yes' ? '(Approved)' : ''} Delivery Fee:</b> ${matchingRequest.delivery_fee} PESOS
                    ` : ''}
                </div>
                <div class="date">
                    ${date ? formatDateSameLine(date) : ''}
                </div>
                <div class="admin-id">
                    ${displayStaff(matchingRequest.staff_id)}
                </div>
            </div>
            <div class="modal-inner-container">
                <div class="modal-inner-header">
                    DETAILS
                </div>
                <p>
                    <b>Request ID:</b> ${matchingRequest.request_id}
                    <p>
                        <b>GCASH Reference Number:</b> ${matchingRequest.reference_number}<br>
                        <b>Cost:</b> ${matchingRequest.cost} PESOS
                    </p>
                    <p>
                        <b>Receiving Option:</b> ${matchingRequest.receiving_option}<br>
                        ${showDeliveryLink(matchingRequest)}
                    </p>
                    <p class="remarks">
                        ${displayRemarks(matchingRequest.remarks)}
                    </p>
                </p>
            </div>
        </div>
    `;
}

function showDeliveryLink(matchingRequest) {
    if (matchingRequest.receiving_option === 'Delivery' && matchingRequest.share_link) {
        if (!matchingRequest.delivery_fee) {
            return '';
        } else {
            return `
                <b>Track Delivery Link:</b> ${matchingRequest.share_link}
            `;
        }
    } else {
        return '';
    }
}

async function approveFee(requestId) {
    let sessionAccessToken = sessionStorage.getItem('accessToken');

    let response = await fetch('/requests/approve', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${sessionAccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId })
    });

    if (response.status === 401 || response.status === 403) {
        const accessToken = await refreshAccessToken();
        sessionStorage.setItem('accessToken', accessToken);
        sessionAccessToken = accessToken;

        response = await fetch('/requests/approve', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requestId })
        });
    }

    if (response.status === 500) {
        return;
    }

    if (response.status === 200) {
        return true;
    }
}