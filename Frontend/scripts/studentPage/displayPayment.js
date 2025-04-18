// Overview:
// Displays the payment modal in the 'REQUEST' page

import { checkAllFields } from '../common/checkFields.js';
import { timestamp } from '../common/retrieveDate.js';
import { serverErrorMessage } from "../common/serverErrorMessage.js";
import { inputNumbersOnly } from '../common/inputNumbersOnly.js';
import { refreshAccessToken } from '../common/refreshAccessToken.js';
import { getRegistrarNumber } from '../common/getRegistrarNumber.js';

// All mocks are used for testing only

export function displayPayment(options, mockRegistrarGcashNumber) {
    let secondStepHTML = `
        <div class="payment payment-second-step">
            <span class="payment-header">Submit Transaction Details</span>
            <p>Please enter the GCash reference number generated upon payment.</p>
            <form class="payment js-payment-fields">
                <div class="field-container">
                    <label class="payment-field-label" for="reference-number">GCASH Reference Number</label>
                    <input type="text" name="reference-number" id="reference-number" maxlength="20" required>
                </div>
                <div class="field-container receiving-option-container js-receiving-option-container">
                    <label class="payment-field-label">Receiving Option</label>
                    <div class="option">
                        <div class="radio-label">
                            <input type="radio" name="receiving-option" id="pick-up" value="Pick Up">
                            <label for="pick-up">Pick Up</label>
                        </div>
                    </div>
                    <div class="option">
                        <div class="radio-label">
                            <input type="radio" name="receiving-option" id="delivery" value="Delivery">
                            <label for="delivery">Delivery</label>
                        </div>
                        <div class="delivery-address-container js-delivery-address-container"></div>
                    </div>
                    <input type="radio" name="receiving-option" value ="" checked style="display: none">
                    <div class="js-approval-input-container"></div>
                </div>
                <p>Please make sure that the reference number and delivery address are correct. Once done, click <b>Upload</b> to finish the transaction.</p>
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
            <span class="payment-header">Transaction Completed</span>
            <p>Your payment details have been submitted successfully.</p>
            <p>We are currently reviewing your payment. Please refer to the status page to track the progress of your document.</p>
        </div>
        <div class="button-container">
            <button class="confirm-button js-confirm-button">
                Confirm
            </button>
        </div>
    `;

    console.log('Added overlay event listener');

    const overlayContainer = document.querySelector('.js-overlay-container');
    const proceedButton = document.querySelector('.js-forms-proceed-button');
    
    const proceedButtonAbort = new AbortController();
    proceedButton.addEventListener('click', handleClickOnProceed, { signal: proceedButtonAbort.signal });

    async function handleClickOnProceed() {
        if (checkAllFields(document.querySelector('.js-request-fields'))) {
            proceedButtonAbort.abort();
            const chosenOption = document.getElementById('document-id').value;
            const foundOption = options.find(document => document.document_id === chosenOption);
            const numberOfCopies = document.getElementById('number-of-copies').value;

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
                                <li><b>Send the payment</b> to the school registrar's GCash number.</li>
                                <li><b>Input the correct amount</b> indicated below.</li>
                                <li><b>Save the transaction's reference number.</b></li>
                            </ol>
                            <p>Before sending the payment, please double check the payment amount inputted to avoid errors. Once you have completed the payment, click <b>Proceed</b> to upload the transaction's reference number.</p>
                        </div>
                        <div class="cost-and-gcash-number">
                            Cost: <b class="payment-cost">${foundOption.fee * numberOfCopies}</b> PESOS <br> Registrar GCash Number: <b class="payment-gcash-number">${mockRegistrarGcashNumber? mockRegistrarGcashNumber: await getRegistrarNumber()}</b>
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
            document.querySelector('.js-receiving-option-container').addEventListener('click', (event) => {
                if (event.target.type === 'radio') {
                    checkIfDelivery();
                }
            });
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
                alert('Please fill in all fields.');
            }
        }
    }

    const body = document.body;
    const bodyAbort = new AbortController();

    console.log("Adding body event listener");
    body.addEventListener('click', removeEventListeners, { signal: bodyAbort.signal });

    function removeEventListeners(event) {
        if (event.target.classList.contains('link')) {
            console.log("Link clicked, aborting listeners");
            // proceedButtonAbort.abort();
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

function checkIfDelivery() {
    const receivingOptionRadioButtons = document.getElementsByName('receiving-option');
    const deliveryAddressInput = document.querySelector('.js-delivery-address-container');
    const approvalInputContainer = document.querySelector('.js-approval-input-container');

    receivingOptionRadioButtons.forEach((button) => {
        if (button.checked && button.value === 'Pick Up') {
            deliveryAddressInput.innerHTML = '';
            approvalInputContainer.innerHTML = `
                <input type="text" name="approval" id="approval" value="Yes" style="display: none;">
            `;
        } else if (button.checked && button.value === 'Delivery') {
            if (deliveryAddressInput.innerHTML === '') {
                deliveryAddressInput.innerHTML = `
                    <input type="text" name="delivery-address" id="delivery-address" maxlength="255" placeholder="Street Address, Barangay, City/Municipality, Postal Code">
                `;
                approvalInputContainer.innerHTML = `
                    <input type="text" name="approval" id="approval" value="Undecided" style="display: none;">
                `;
            }
        }
    });
}