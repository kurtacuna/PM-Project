// Overview:
// Displays the content preview of a request

import { matchRequest } from "../common/search.js";
import { displayPage } from "./displayPage.js";
import { serverErrorMessage } from "../common/serverErrorMessage.js";
import { formatDateTime } from "../common/retrieveDate.js";
import { refreshAccessToken } from "../common/refreshAccessToken.js";

export function listenForClickOnRequest(requests) {
    document.querySelectorAll('.request').forEach((item) => {
        item.addEventListener('click', () => {
            document.querySelector('.js-search-and-filter').innerHTML = '';
            document.querySelector('.js-table-headers-container').innerHTML = '';
            document.querySelector('.js-requests-container').innerHTML = '';

            displayPreview(requests, item);
        });
    });
}

function displayPreview(requests, item) {
    const { requestId } = item.dataset;
    const matchingRequest = matchRequest(requests, requestId);
    
    document.querySelector('.js-preview-container').innerHTML = `
        <div>
            ${matchingRequest.staff_id ? `Updated By: ${matchingRequest.staff_id}` : `` }
        </div>
        <div class="cost-container">
            Reference Number: ${matchingRequest.reference_number} - ${matchingRequest.cost} PESOS
        </div>
        <form class="fields">
            <div class="student-information-container">
                <div class="header">
                    STUDENT INFORMATION
                </div>
                <div class="field-container">
                    <label class="field-label" for="student-number" >
                        Student Number
                    </label>
                    <input type="text" name="student-number" id="student-number" value="${matchingRequest.student_id}" disabled>
                </div>
                <div class="name-fields-container">
                    <div class="field-container">
                        <label class="field-label" for="lastname">
                            Last Name
                        </label>
                        <input type="text" name="lastname" id="lastname" value="${matchingRequest.lastname}" disabled>
                    </div>
                    <div class="field-container">
                        <label class="field-label" for="firstname">
                            First Name
                        </label>
                        <input type="text" name="firstname" id="firstname" value="${matchingRequest.firstname}" disabled>
                    </div>
                    <div class="field-container">
                        <label class="field-label" for="middlename">
                            Middle Name
                        </label>
                        <input type="text" name="middlename" id="middlename" value="${matchingRequest.middlename}" disabled>
                    </div>
                </div>
                <div class="email-and-number">
                    <div class="field-container">
                        <label class="field-label" for="email-address">
                            Email Address
                        </label>
                        <input type="text" name="email-address" id="email-address" value="${matchingRequest.email_address}" disabled>
                    </div>
                    <div class="field-container">
                        <label class="field-label" for="contact-number">
                            Contact Number
                        </label>
                        <input type="text" name="contact-number" id="contact-number" value="${matchingRequest.contact_number}" disabled>
                    </div>
                </div>
            </div>
            <div class="document-request-container">
                <div class="header">
                    DOCUMENT REQUEST
                </div>
                <div class="field-container">
                    <label class="field-label" for="purpose-of-request">
                        Purpose of Request
                    </label>
                    <input type="text" name="purpose-of-request" id="purpose-of-request" value="${matchingRequest.purpose_of_request}" disabled>
                </div>
                <div class="type-and-copies">
                    <div class="field-container">
                        <label class="field-label" for="type-of-document">
                            Type of Document
                        </label>
                        <input type="text" name="type-of-document" id="type-of-document" value="${matchingRequest.document_type}" disabled>
                    </div>
                    <div class="field-container">
                        <label class="field-label" for="number-of-copies">
                            Number of Copies
                        </label>
                        <input type="number" name="number-of-copies" id="number-of-copies" value="${matchingRequest.number_of_copies}" disabled>
                    </div>
                </div>
                <div class="field-container">
                    <label class="field-label" for="document-details">
                        Document Details
                    </label>
                    <input type="text" name="document-details" id="document-details" value="${matchingRequest.document_details}" disabled>
                </div>
            </div> 
        </form>
        <div class="js-additional-field">
            ${determineFooter(matchingRequest)}
        </div>
    `;

    if (document.querySelector('.js-update-button')) {
        document.querySelector('.js-update-button').addEventListener('click', async () => {
            if (await sendUpdate(requestId, matchingRequest.email_address)) {
                serverErrorMessage();
            }
        });
    } 
    
    if (document.querySelector('.js-release-button')) {
        document.querySelector('.js-release-button').addEventListener('click', async () => {
            if (await sendUpdate(requestId, matchingRequest.email_address)) {
                serverErrorMessage();
            }
        });
    }

    if (document.querySelector('.js-go-back-button')) {
        document.querySelector('.js-go-back-button').addEventListener('click', () => {
            displayPage(requests, matchingRequest.status);
        });
    }
}

// Sends the updated status and remarks to the server
async function sendUpdate(requestId, studentEmail) {
    const remarks = document.getElementById('remarks').value;
    const staffId = sessionStorage.getItem('username');
    let status;
    if (document.getElementById('status')) {
        status = document.getElementById('status').value;
    } else {
        status = 'Released';
    }
    
    const remarksAndStatusObject = { requestId, remarks, status, staffId, studentEmail }
    
    let sessionAccessToken = sessionStorage.getItem('accessToken');
    let response = await fetch('/requests', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${sessionAccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(remarksAndStatusObject)
    });

    if (response.status === 401 || response.status === 403) {
        const accessToken = await refreshAccessToken();
        sessionStorage.setItem('accessToken', accessToken);
        sessionAccessToken = accessToken;

        response = await fetch('/requests', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(remarksAndStatusObject)
        });
    }
    
    if (response.status === 500) {
        serverErrorMessage();
        return;
    }

    if (response.status === 200) {
        return true;
    }
}

// Determine the footer of a preview based on the status
function determineFooter(matchingRequest) {
    const status = matchingRequest.status;
    const remarks = matchingRequest.remarks || '';
    let dateCompleted = matchingRequest.date_completed;
    let dateReleased = matchingRequest.date_released;
    let dateRejected = matchingRequest.date_rejected;
    
    if (dateCompleted) {
        dateCompleted = formatDateTime(dateCompleted);
    } 
    
    if (dateReleased) {
        dateReleased = formatDateTime(dateReleased);
    } 
    
    if (dateRejected) {
        dateRejected = formatDateTime(dateRejected);
    }

    let forPending = `
        <div class="fields remarks-and-status">
            <div class="field-container">
                <label class="field-label open" for="remarks">
                    Add Remarks
                </label>
                <input type="text" name="remarks" id="remarks" value="${remarks}">
            </div>
            <div class="field-container">
                <label class="field-label open" for="status">
                    Status
                </label>
                <select name="status" id="status">
                    <option value="Pending">Pending</option>
                    <option value="To Receive">To Receive</option>
                    <option value="Released">Released</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
        </div>
        <div class="update-button-container">
            <button class="update-button js-update-button">
                UPDATE
            </button> 
        </div>
    `;

    let forToReceive = `
        <div class="fields field-container">
            <label class="field-label" for="remarks">
                Remarks
            </label>
            <input type="text" name="remarks" id="remarks" value="${remarks}" disabled>
        </div>
        <div class="completed-on">
            <div class="text">
                Completed on: ${dateCompleted}
            </div>
        </div>
        <div class="buttons-container">
            <button class="js-go-back-button">
                Go Back
            </button>
            <button class="js-release-button">
                Release
            </button>
        </div>
    `;

    let forReleased = `
        <div class="fields field-container">
            <label class="field-label" for="remarks">
                Remarks
            </label>
            <input type="text" name="remarks" id="remarks" value="${remarks}" disabled>
        </div>
        <div class="released-on">
            <div class="text">
                Released on: ${dateReleased}
            </div>
        </div>
        <div class="back-button-container">
            <button class="js-go-back-button">
                Go Back
            </button>
        </div>
    `;

    let forRejected = `
        <div class="fields field-container">
            <label class="field-label" for="remarks">
                Remarks
            </label>
            <input type="text" name="remarks" id="remarks" value="${remarks}" disabled>
        </div>
        <div class="rejected-on">
            <div class="text">
                Rejected on: ${dateRejected}
            </div>
        </div>
        <div class="back-button-container">
            <button class="js-go-back-button">
                Go Back
            </button>
        </div>
    `;

    if (status === 'Pending') {
        return forPending;
    } else if (status === 'To Receive') {
        return forToReceive;
    } else if (status === 'Released') {
        return forReleased;
    } else if (status === 'Rejected') {
        return forRejected;
    }
}