// Overview:
// Displays the admin-specific link and contents

import { clearSelected } from "../common/clearSelected.js";
import { serverErrorMessage } from "../common/serverErrorMessage.js";
import { checkAllFields } from "../common/checkFields.js";
import { styleRows } from "../common/rowStyle.js";
import { inputNumbersOnly } from '../common/inputNumbersOnly.js';

document.querySelector('.js-settings-link').addEventListener('click', function() {
    clearSelected();
    this.classList.add('selected');
    displaySettings();
});

async function displaySettings() {
    clearInnerContainer();
    document.querySelector('.js-settings').innerHTML = '';
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
                            <input type="text" name="document-id" placeholder="Document ID" value="test">
                            </div>
                            <div class="add-document-type">
                                <input type="text" name="document-type" placeholder="Document Type" value="test">
                            </div>
                            <div class="add-fee">
                                <input type="text" name="fee" id ="fee" placeholder="Fee" value="123">
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
                                <input type="text" name="document-id" placeholder="Document ID">
                            </div>
                            <div class="edit-fee">
                                <input type="text" name="fee" id="fee" placeholder="Fee">
                            </div>
                            <sup><i>Max of 5 digits</i></sup>
                        </form>
                        <div>
                            <button class="js-update-fee-button">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    inputNumbersOnly(document.getElementById('fee'));
    listenForRemove();

    const addButtonAbort = new AbortController();
    document.querySelector('.js-add-document-button').addEventListener('click', handleAddButtonClick, { signal: addButtonAbort.signal });
    document.querySelector('.js-add-document-button').param = documents;

    const updateButtonAbort = new AbortController();
    document.querySelector('.js-update-fee-button').addEventListener('click', handleUpdateButtonClick, { signal: updateButtonAbort.signal });
    document.querySelector('.js-update-fee-button').param = documents;

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('link')) {
            addButtonAbort.abort();
            updateButtonAbort.abort();
        }
    });
}

function clearInnerContainer() {
    document.querySelector('.js-search-and-filter').innerHTML = '';
    document.querySelector('.js-table-headers-container').innerHTML = '';
    document.querySelector('.js-requests-container').innerHTML = '';
    document.querySelector('.js-preview-container').innerHTML = '';
    document.querySelector('.js-no-requests-container').innerHTML = '';
}

async function getDocumentsAvailable() {
    const response = await fetch('/documents');
    const documents = await response.json();

    return documents;
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
        if (await addDocumentOption(event.currentTarget.param) === false) {
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
    
    let serverResponse;
    await fetch('/documents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    }).then(response => serverResponse = response);

    if (serverResponse.status === 200) {
        document.querySelector('.js-settings-link').click();
    } else if (serverResponse.status === 500) {
        return false;
    }
}

async function handleUpdateButtonClick(event) {
    if (checkAllFields(document.querySelector('.js-edit-fee-fields'))) {
        if (await updateDocumentFee(event.currentTarget.param) === false) {
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

    let serverResponse;
    await fetch('/documents', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    }).then(response => serverResponse = response);

    if (serverResponse.status === 200) {
        document.querySelector('.js-settings-link').click();
    } else if (serverResponse.status === 500) {
        return false;
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
            if (await removeDocument(documentId) === false) {
                serverErrorMessage();
            }; 
        });
    });
}

async function removeDocument(documentId) {
    const idObject = { documentId };

    let serverResponse;
    await fetch('/documents', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(idObject)
    }).then(response => serverResponse = response);

    if (serverResponse.status === 200) {
        setTimeout(() => {
            document.querySelector('.js-settings-link').click();
        }, 50);
    } else if (serverResponse.status === 500) {
        return false;
    }
}