import { serverErrorMessage } from "../common/serverErrorMessage.js";
import { checkAllFields } from "../common/checkFields.js";
import { styleRows } from "../common/rowStyle.js";
import { inputNumbersOnly } from '../common/inputNumbersOnly.js';
import { refreshAccessToken } from "../common/refreshAccessToken.js";
import { getRegistrarNumber } from "../common/getRegistrarNumber.js";
import { clearInnerContainer } from "./clearInnerContainer.js";

export async function displaySettings() {
    clearInnerContainer();
    document.title = 'Settings';
    document.querySelector('.js-top-text').innerText = 'SETTINGS';

    const documents = await getDocumentsAvailable();
    console.log(documents);

    document.querySelector('.js-settings').innerHTML += `
        <div class="section-header">
            Manage Documents
        </div>
        <div class="documents js-documents">
            <div class="left-section">
                <div class="document-container js-document-container">
                    <table cellspacing="0">
                        <thead>
                            <tr style="background-color: white">
                                <th></th>
                                <th>Document ID</th>
                                <th>Document Type</th>
                                <th>Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${displayDocumentsAvailable(documents)}
                        </tbody>
                    </table>
                </div>
                <div class="right-section">
                    <div class="section">
                        <div class="section-header">
                            Add a Document
                        </div>
                        <form class="js-add-document-fields">
                            <div class="add-document-id">
                            <input type="text" name="document-id" placeholder="Document ID" maxlength="20" value="test">
                            </div>
                            <div class="add-document-type">
                                <input type="text" name="document-type" placeholder="Document Type" maxlength="100" value="test">
                            </div>
                            <div class="add-fee">
                                <input type="text" name="fee" id ="fee" placeholder="Fee" maxlength="5" value="123">
                            </div>
                            <sup><i>Max of 5 digits</i></sup>
                        </form>
                        <div>
                            <button class="js-add-document-button">
                                Add
                            </button>
                        </div>
                    </div>
                    <div class="section">
                        <div class="section-header">
                            Edit Fee
                        </div>
                        <form class="js-edit-fee-fields">
                            <div class="edit-document-id">
                                <input type="text" name="document-id" placeholder="Document ID" maxlength="20">
                            </div>
                            <div class="edit-fee">
                                <input type="text" name="fee" id="fee" placeholder="Fee" maxlength="5">
                            </div>
                            <sup><i>Max of 5 digits</i></sup>
                        </form>
                        <div>
                            <button class="js-update-fee-button">
                                Update
                            </button>
                        </div>
                    </div>
                    <div class="section">
                        <div class="section-header">
                            Change GCash Number
                        </div>
                        <form class="js-change-gcash-number-fields">
                            <div class="change-gcash-number">
                                <input type="tel" name="gcash-number" id="gcash-number" placeholder="GCash Number" maxlength="20">
                            </div>
                            <sup><i>Current: ${await getRegistrarNumber()}</i></sup>
                        </form>
                        <div>
                            <button class="js-change-gcash-number-button">
                                Change
                            </button>
                        </div>
                    </div>
                    <div class="section">
                        <div class="section-header">
                            Download All Requests
                        </div>
                        <div>
                            <button class="js-download-all-requests-button">
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    inputNumbersOnly(document.getElementById('fee'));
    inputNumbersOnly(document.getElementById('gcash-number'));
    listenForRemove();

    const addButtonAbort = new AbortController();
    document.querySelector('.js-add-document-button').addEventListener('click', handleAddButtonClick, { signal: addButtonAbort.signal });
    document.querySelector('.js-add-document-button').param = documents;

    const updateButtonAbort = new AbortController();
    document.querySelector('.js-update-fee-button').addEventListener('click', handleUpdateButtonClick, { signal: updateButtonAbort.signal });
    document.querySelector('.js-update-fee-button').param = documents;

    const changeButtonAbort = new AbortController();
    document.querySelector('.js-change-gcash-number-button').addEventListener('click', handleChangeButtonClick, { signal: changeButtonAbort.signal });

    const downloadButtonAbort = new AbortController();
    document.querySelector('.js-download-all-requests-button').addEventListener('click', handleDownloadButtonClick, { signal: downloadButtonAbort.signal });

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('link')) {
            addButtonAbort.abort();
            updateButtonAbort.abort();
            changeButtonAbort.abort();
            downloadButtonAbort.abort();
        }
    });
}

async function getDocumentsAvailable() {
    let sessionAccessToken = sessionStorage.getItem('accessToken');
    let response = await fetch('/documents', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionAccessToken}`
        }
    });

    if (response.status === 401 || response.status === 403) {
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
        const documents = await response.json();

        return documents;
    }
}

function displayDocumentsAvailable(documents) {
    let documentsHTML = '';
    documents.forEach((document, index) => {
        documentsHTML += `
            <tr ${styleRows(index)}>
                <td>
                    <button class="remove-document-button js-remove-document-button" data-document-id="${document.document_id}">
                        &times;
                    </button>
                </td>
                <td>${document.document_id}</td>
                <td>${document.document_type}</td>
                <td>${document.fee}</td>
            </tr>
        `;
    });

    return documentsHTML;
}

async function handleAddButtonClick(event) {
    if (checkAllFields(document.querySelector('.js-add-document-fields'))) {
        if (await addDocumentOption(event.currentTarget.param)) {
            serverErrorMessage();
        }
    } else {
        alert(`Please fill in all fields in 'Add a Document' when adding a document.`);
    }
}

// Send the form data for adding a document option to the server
async function addDocumentOption(documents) {
    const addDocumentForm = document.querySelector('.js-add-document-fields');
    const formDataObject = Object.fromEntries(new FormData(addDocumentForm));

    if (checkIfDocumentExists(documents, formDataObject['document-id'])) {
        alert(`Document ID ${formDataObject['document-id']} already exists.`);
        return;
    }

    let sessionAccessToken = sessionStorage.getItem('accessToken');
    console.log('Session Storage before:', sessionStorage);
    let response = await fetch('/documents', {
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

        response = await fetch('/documents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        });
    }

    if (response.status === 500) {
        return true;
    }

    if (response.status === 200) {
        document.querySelector('.js-settings-link').click();
    } 
}

async function handleUpdateButtonClick(event) {
    if (checkAllFields(document.querySelector('.js-edit-fee-fields'))) {
        if (await updateDocumentFee(event.currentTarget.param)) {
            serverErrorMessage();
        }
    } else {
        alert(`Please fill in all fields in 'Edit Fee' when changing the fee of a document.`);
    }
}

// Send the form data for updating a document option's fee to the server
async function updateDocumentFee(documents) {
    const editFeeForm = document.querySelector('.js-edit-fee-fields');
    const formDataObject = Object.fromEntries(new FormData(editFeeForm));
    
    if (!checkIfDocumentExists(documents, formDataObject['document-id'])) {
        alert(`Document ID ${formDataObject['document-id']} does not exist.`);
        return;
    }

    let sessionAccessToken = sessionStorage.getItem('accessToken');
    let response = await fetch('/documents', {
        method: 'PUT',
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

        response = await fetch('/documents', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        });
    }

    if (response.status === 500) {
        return true;
    }

    if (response.status === 200) {
        document.querySelector('.js-settings-link').click();
    }
}

function checkIfDocumentExists(documents, documentId) {
    const result = documents.find(document => document.document_id === documentId);

    return result;
}

function listenForRemove() {
    document.querySelectorAll('.js-remove-document-button').forEach((button) => {
        button.addEventListener('click', async () => {
            const { documentId } = button.dataset;
            if (await removeDocument(documentId)) {
                serverErrorMessage();
            }; 
        });
    });
}

async function removeDocument(documentId) {
    const idObject = { documentId };

    let sessionAccessToken = sessionStorage.getItem('accessToken');
    let response = await fetch('/documents', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionAccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(idObject)
    });

    if (response.status === 401 || response.status === 403) {
        const accessToken = await refreshAccessToken();
        sessionStorage.setItem('accessToken', accessToken);
        sessionAccessToken = accessToken;

        response = await fetch('/documents', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(idObject)
        });
    }

    if (response.status === 500) {
        serverErrorMessage();
        return;
    }

    if (response.status === 200) {
        setTimeout(() => {
            document.querySelector('.js-settings-link').click();
        }, 50);
    }
}

async function handleChangeButtonClick() {
    if (checkAllFields(document.querySelector('.js-change-gcash-number-fields'))) {
        if (await changeGcashNumber()) {
            serverErrorMessage();
        }
    } else {
        alert(`Please fill in all fields in 'Change Gcash Number' when changing the GCash number`);
    }
}

async function changeGcashNumber() {
    let sessionAccessToken = sessionStorage.getItem('accessToken');
    const changeGcashNumberForm = document.querySelector('.js-change-gcash-number-fields');
    const formDataObject = Object.fromEntries(new FormData(changeGcashNumberForm));

    console.log(formDataObject);

    let response = await fetch('/registrar/number', {
        method: 'PUT',
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

        response = await fetch('/registrar/number', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        });
    }

    if (response.status === 500) {
        return true;
    }

    if (response.status === 200) {
        document.querySelector('.js-settings-link').click();
    }
}

async function handleDownloadButtonClick() {
    if (await downloadAllRequests()) {
        serverErrorMessage();
    } else {
        alert(`Please click the button again if the download doesn't start`);
    }
}

async function downloadAllRequests() {
    let sessionAccessToken = sessionStorage.getItem('accessToken');

    let response = await fetch('/requests/download_all_requests' , {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionAccessToken}`,
        }
    });

    if (response.status === 401 || response.status === 403) {
        const accessToken = await refreshAccessToken();
        sessionStorage.setItem('accessToken', accessToken);
        sessionAccessToken = accessToken;

        response = await fetch('/requests/download_all_requests' , {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`,
            }
        });
    }

    if (response.status === 500) {
        return true;
    }

    if (response.status === 200) {
        // Create a URL for the response blob and trigger the download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'requests.xlsx'; // Change the filename if needed
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        return;
    }
}