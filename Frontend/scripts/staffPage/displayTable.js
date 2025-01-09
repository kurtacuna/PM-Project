// Overview:
// Displays the table on each page

import { styleRows } from "../common/rowStyle.js";
import { search } from "../common/search.js";
import { filterArray } from '../common/filter.js';
import { formatDateTime } from '../common/retrieveDate.js';
import { listenForClickOnRequest } from "./displayPreview.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


export function renderTable(requests, page, filter) {
    const sortedRequests = [...requests].filter((item) => {
        if (item.status === page) {
            return true;
        }
    });
    
    renderHeaders(page, sortedRequests);
    renderRows(sortedRequests, page, filter);
    listenForClickOnRequest(requests);
}

function renderHeaders(page, requests) {
    let pendingHeadersHTML = `
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
            <th class="date-received-column">
                Date Received
            </th>
            <th class="reference-number-column">
                GCash Reference Number
            </th>
        </tr>
    `;

    let toReceiveHeadersHTML = `
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
            <th class="date-completed-column">
                Date Completed
            </th>
            <th class="reference-number-column">
                GCash Reference Number
            </th>
        </tr>
    `;

    let releasedHeadersHTML = `
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
            <th class="date-released-column">
                Date Released
            </th>
            <th class="reference-number-column">
                GCash Reference Number
            </th>
        </tr>
    `;

    let rejectedHeadersHTML = `
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
            <th class="date-rejected-column">
                Date Rejected
            </th>
            <th class="reference-number-column">
                GCash Reference Number
            </th>
        </tr>
    `;

    const tableHeadersContainer = document.querySelector('.js-table-headers-container');

    if (page === 'Pending') {
        tableHeadersContainer.innerHTML = pendingHeadersHTML;
    } else if (page === 'To Receive') {
        tableHeadersContainer.innerHTML = toReceiveHeadersHTML;
    } else if (page === 'Released') {
        tableHeadersContainer.innerHTML = releasedHeadersHTML;
    } else if (page === 'Rejected') {
        tableHeadersContainer.innerHTML = rejectedHeadersHTML;
    }
}

function renderRows(requests, page, dateFilter) {
    let tableArray = requests;

    if (tableArray.length === 0) {
        document.querySelector('.js-requests-container').innerHTML = '';
        document.querySelector('.js-no-requests-container').innerHTML = `
            <div class="no-request">
                <div class="message">
                    No request found.
                </div>  
            </div>
        `;
    } else {
        document.querySelector('.js-no-requests-container').innerHTML = '';

        if (page === 'To Receive') {
            tableArray = sortByDateType(tableArray, 'date_completed');
        } else if (page === 'Released') {
            tableArray = sortByDateType(tableArray, 'date_released');
        } else if (page === 'Rejected') {
            tableArray = sortByDateType(tableArray, 'date_rejected');
        }

        const url = new URL(window.location.href);
        const searchQuery = url.searchParams.get('search');
    
        if (searchQuery) {
            tableArray = search(tableArray, searchQuery, page);
        } else {
            tableArray = filterArray(tableArray, dateFilter, page);
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
                        ${formatDateTime(item[determineDate(page)])}
                    </td>
                    <td>
                        ${item.reference_number}
                    </td>
                </tr>
            `;
        });
    
        document.querySelector('.js-requests-container').innerHTML = tableHTML;
    }
}

function determineDate(page) {
    if (page === 'Pending') {
        return 'date_requested';
    } else if (page === 'To Receive') {
        return 'date_completed';
    } else if (page === 'Released') {
        return 'date_released';
    } else if (page === 'Rejected') {
        return 'date_rejected';
    }
}

function sortByDateType(array, dateType) {
    array = array.sort((a, b) => { return dayjs(b[dateType]) - dayjs(a[dateType]) });

    return array;
}