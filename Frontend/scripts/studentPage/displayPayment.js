// Overview:
// Displays the payment modal in the 'REQUEST' page

import { checkAllFields } from '../common/checkFields.js';
import { timestamp } from '../common/retrieveDate.js';
import { serverErrorMessage } from "../common/serverErrorMessage.js";
import { inputNumbersOnly } from '../common/inputNumbersOnly.js';
import { refreshAccessToken } from '../common/refreshAccessToken.js';

export function displayPayment(options) {
    let secondStepHTML = `
        <div class="payment payment-second-step">
            <span class="payment-header">Submit GCash Payment Details</span>
            <p>Please enter the GCash reference number generated upon payment.</p>
            <form class="payment js-payment-fields">
                <div class="field-container">
                    <label class="payment-field-label" for="reference-number">Reference Number</label>
                    <input type="text" name="reference-number" id="reference-number">
                </div>
                <p>Please make sure that the reference number is correct. Once done, click <b>Upload</b> to finish the transaction.</p>
            </form>
        </div>
        <div class="button-container">
            <button class="upload-button js-upload-button" type="button">
                Upload
            </button>
        </div>
    `;

    let thirdStepHTML = `
        <div class="payment payment-third-step">
            <span class="payment-header">Payment Confirmation Submitted</span>
            <p>Your payment details have been submitted successfully.</p>
            <p>We are currently reviewing your payment. Please refer to the status page to track the progress of your document.</p>
        </div>
        <div class="button-container">
            <button class="confirm-button js-confirm-button">
                Confirm
            </button>
        </div>
    `;

    const overlayContainer = document.querySelector('.js-overlay-container');
    const proceedButton = document.querySelector('.js-proceed-button');
    
    const proceedButtonAbort = new AbortController();
    proceedButton.addEventListener('click', handleClickOnProceed, { signal: proceedButtonAbort.signal });

    function handleClickOnProceed() {
        if (checkAllFields(document.querySelector('.js-request-fields'))) {
            proceedButtonAbort.abort();
            const chosenOption = document.getElementById('document-id').value;
            const foundOption = options.find(document => document.document_id === chosenOption);
            const numberOfCopies = document.getElementById('number-of-copies').value;

            console.log(foundOption);

            let firstStepHTML = `
                <div class="overlay">
                    <div class="modal payment-modal">
                        <button class="close-button">
                            &times;
                        </button>
                        <div class="payment payment-first-step">
                            <span class="payment-header">Payment Instructions</span>
                            <p>Your form is complete! Finish the transaction using GCash by following these steps:</p>
                            <ol type="1">
                                <li><b>Open the GCash App</b> on your mobile device.</li>
                                <li><b>Send the payment</b> to the school registrar's GCash number: [<b>Registrar's Contact Number</b>]</li>
                                <li>This transaction will cost <b style="font-size: 25px">${foundOption.fee * numberOfCopies}</b> PESOS. Please make sure to input this amount correctly.</li>
                                <li><b>Save the transaction's reference number.</b></li>
                            </ol>
                            <p>Before sending the payment, please double check the payment amount inputted to avoid errors. Once you have completed the payment, click <b>Proceed</b> to upload the transaction's reference number.</p>
                        </div>
                        <div class="button-container">
                            <button class="proceed-button">
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            `;
            overlayContainer.innerHTML = firstStepHTML;
            
        } else {
            alert('Please fill in all fields.');
        }
    }
    
    const overlayContainerAbort = new AbortController();
    overlayContainer.addEventListener('click', handleOverlayClick, { signal: overlayContainerAbort.signal });

    async function handleOverlayClick(event) {
        if (event.target.classList.contains('close-button')) {
            overlayContainerAbort.abort();
            overlayContainer.innerHTML = '';
            displayPayment(options);
        } else if (event.target.classList.contains('confirm-button')) {
            overlayContainerAbort.abort();
            overlayContainer.innerHTML = '';
            displayPayment(options);
        } else if (event.target.classList.contains('overlay')) {
            overlayContainerAbort.abort();
            overlayContainer.innerHTML = '';
            displayPayment(options);
        }

        if (event.target.classList.contains('proceed-button')) {
            overlayContainer.innerHTML =  `
                <div class="overlay">
                    <div class="modal payment-modal">
                        <button class="close-button">
                            &times;
                        </button>
                        ${secondStepHTML}
                    </div>
                </div>
            `;

            inputNumbersOnly(document.getElementById('reference-number'));
        }

        if (event.target.classList.contains('upload-button')) {
            if (checkAllFields(document.querySelector('.js-payment-fields'))) {
                if (await sendRequest()) {
                    overlayContainer.innerHTML =  `
                        <div class="overlay">
                            <div class="modal payment-modal">
                                <button class="close-button js-close-button">
                                    &times;
                                </button>
                                ${thirdStepHTML}
                            </div>
                        </div>
                    `;
                } else {
                    serverErrorMessage();
                }
            } else {
                alert('Please input the reference number.');
            }
        }
    }

    const body = document.body;
    const bodyAbort = new AbortController();
    body.addEventListener('click', removeEventListeners, { signal: bodyAbort.signal });

    function removeEventListeners(event) {
        if (event.target.classList.contains('link')) {
            proceedButtonAbort.abort();
            overlayContainerAbort.abort();
            bodyAbort.abort();
        }
    }
}

// Send the form data to the server
async function sendRequest() {
    const requestForm = document.querySelector('.js-request-fields');
    const paymentForm = document.querySelector('.js-payment-fields');
    const documentTimestamp = { 'timestamp': timestamp() };
    const sessionUsername = sessionStorage.getItem('username');
    const formDataObject = {
        'username': sessionUsername,
        ...documentTimestamp,
        ...Object.fromEntries(new FormData(requestForm)),
        ...Object.fromEntries(new FormData(paymentForm))
    };

    console.log(formDataObject);

    let sessionAccessToken = sessionStorage.getItem('accessToken');
    let response = await fetch('/requests', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionAccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    });

    if (response.status === 401 || response.status === 403) {
        const accessToken = await refreshAccessToken();
        sessionStorage.setItem('accessToken', accessToken);
        sessionAccessToken = accessToken;

        response = await fetch('/requests', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        });        
    }

    if (response.status === 500) {
        serverErrorMessage();
        return;
    }

    if (response.status === 200) {
        requestForm.reset();
        return true;
    }
}
