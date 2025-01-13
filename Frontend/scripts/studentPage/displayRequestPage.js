// Overview:
// Displays the 'REQUEST' page

import { displayPayment } from "./displayPayment.js";
import { clearSearch } from '../common/clearSearch.js';
import { inputNumbersOnly } from "../common/inputNumbersOnly.js";
import { refreshAccessToken } from "../common/refreshAccessToken.js";
import { serverErrorMessage } from "../common/serverErrorMessage.js";

// All mocks are used for testing only

export async function displayRequestPage(mockOptions, mockRegistrarGcashNumber) {
    // Remove elements from the 'STATUS' page
    document.querySelector('.js-table-container').innerHTML = '';
    document.querySelector('.js-search-and-filter-container').innerHTML = '';
    document.querySelector('.js-no-requests-container').innerText = '';

    clearSearch();
    document.title = 'Request';
    document.querySelector('.js-top-text').innerText = 'REQUEST';

    let options;

    if (mockOptions) {
        options = mockOptions;
    } else {
        options = await getDocumentOptions();
    }

    displayForms(options);
    displayPayment(options, mockRegistrarGcashNumber);
    console.log('displayed request page');
}

function displayForms(options) {
    document.querySelector('.js-forms-container').innerHTML = `
        <form class="fields js-request-fields">
            <div class="student-information-container">
                <div class="header">
                    STUDENT INFORMATION
                </div>
                <div class="field-container">
                    <label class="field-label" for="student-number">
                        Student Number
                    </label>
                    <input type="text" name="student-number" id="student-number" maxlength="20" value="TUPM-01-0001">
                </div>
                <div class="name-fields-container">
                    <div class="field-container">
                        <label class="field-label" for="lastname">
                            Last Name
                        </label>
                        <input type="text" name="lastname" id="lastname" maxlength="50" value="Dela Cruz">
                    </div>
                    <div class="field-container">
                        <label class="field-label" for="firstname">
                            First Name
                        </label>
                        <input type="text" name="firstname" id="firstname" maxlength="100" value="Juan">
                    </div>
                    <div class="field-container">
                        <label class="field-label" for="middlename">
                            Middle Name
                        </label>
                        <input type="text" name="middlename" id="middlename" maxlength="50" value="D">
                    </div>
                </div>
                <div class="email-and-number">
                    <div class="field-container">
                        <label class="field-label" for="email-address">
                            Email Address
                        </label>
                        <input type="text" name="email-address" id="email-address" maxlength="50" value="kurtlouvandrich.acuna@tup.edu.ph">
                    </div>
                    <div class="field-container">
                        <label class="field-label" for="contact-number">
                            Contact Number
                        </label>
                        <input type="tel" name="contact-number" id="contact-number" maxlength="20" value="09080706050">
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
                    <input type="text" name="purpose-of-request" id="purpose-of-request" maxlength="255" value="For employment">
                </div>
                <div class="type-and-copies">
                    <div class="field-container">
                        <label class="field-label" for="document-id">
                            Type of Document
                        </label>
                        <select name="document-id" id="document-id">
                            <option selected value="" style="display: none"></option>
                            ${displayDocumentTypes(options)}
                        </select>
                    </div>
                    <div class="field-container">
                        <label class="field-label" for="number-of-copies">
                            Number of Copies
                        </label>
                        <input type="number" name="number-of-copies" id="number-of-copies" min="1" max="50" value="2">
                    </div>
                </div>
                <div class="field-container">
                    <label class="field-label" for="document-details">
                        Document Details
                    </label>
                    <input type="text" name="document-details" id="document-details" maxlength="255" value="Please include all from 1st to 4th year">
                </div>
            </div>
        </form>
        <div class="proceed-button-container">
            <button class="forms-proceed-button js-forms-proceed-button">
                PROCEED
            </button> 
        </div>
    `;

    inputNumbersOnly(document.getElementById('contact-number'));
}

function displayDocumentTypes(options) {
    let optionsHTML = '';
    options.forEach((document) => {
        optionsHTML += `
            <option value="${document.document_id}">${document.document_type}</option>
        `;
    });
    return optionsHTML;
}

async function getDocumentOptions() {
    let sessionAccessToken = sessionStorage.getItem('accessToken');

    let response = await fetch('/documents', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionAccessToken}`
        }
    });

    if (response.status === 401  || response.status === 403) {
        const accessToken = await refreshAccessToken();
        sessionStorage.setItem('accessToken', accessToken);
        sessionAccessToken = accessToken;

        response = await fetch('/documents', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`
            }
        });
    }
    
    if (response.status === 500) {
        serverErrorMessage();
        return;
    }

    if (response.status === 200) {
        const options = await response.json();
        return options;
    } 
}