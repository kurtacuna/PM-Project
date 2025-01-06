import { initiateStudentLinks } from "../../Frontend/scripts/studentPage/links.js";

describe('integration test: student page', () => {
    let mockRequests = [
        {
            "request_id": "student11228202464858am",
            "student_id": "student1",
            "document_id": "1TOR",
            "cost": "200.00",
            "status": "Released",
            "date_requested": "2024-12-27T22:48:58.000Z",
            "date_completed": "2024-12-28T05:35:24.000Z",
            "date_released": "2024-12-28T05:35:41.000Z",
            "date_rejected": null,
            "staff_id": "admin",
            "remarks": "test remarks",
            "reference_number": "123",
            "lastname": "TEST",
            "firstname": "TEST",
            "middlename": "TEST",
            "email_address": "test.email@gmail.com",
            "contact_number": 123,
            "purpose_of_request": "TEST",
            "document_type": "Transcript of Records",
            "number_of_copies": 2,
            "document_details": "TEST"
        }
    ];

    let mockOptions = [
        {
          "document_id": "1TOR",
          "document_type": "Transcript of Records",
          "fee": "100.00"
        },
        {
          "document_id": "2CTC",
          "document_type": "Certified True Copy of Grades",
          "fee": "100.00"
        }
    ];

    let mockRegistrarGcashNumber = '09080706050'

    beforeEach(() => {
        document.querySelector('.student-test-container').innerHTML = `
            <div class="js-overlay-container"></div>
            <div class="sidebar-container js-sidebar-container">
                <a>
                    <div class="logo-container">
                        <img class="logo" src="../images/Technological_University_of_the_Philippines_Seal.svg.png" alt="tup-logo">
                    </div>
                </a>
                <div class="links-container">
                    <div class="link js-status-link">
                        <img class="status-icon" src="../images/icons/lets-icons_status-list.png" alt="status-link">
                    </div>
                    <div class="link js-request-link">
                        <img class="request-icon" src="../images/icons/material-symbols-light_note-add.png" alt="request-link">
                    </div>
                </div>
                <div class="link js-logout-link">
                    <img class="logout-icon" src="../images/icons/ic_twotone-logout.png" alt="logout-link">
                </div>
            </div>
            <div class="top-text js-top-text">
                STUDENT
            </div>
            <main class="inner-container js-inner-container">
                <div class="search-and-filter-container js-search-and-filter-container"></div>
                <div class="table-container js-table-container"></div>
                <div class="forms-container js-forms-container"></div>
                <div class="no-requests-container js-no-requests-container"></div>
            </main>
        `;

        initiateStudentLinks(mockRequests, mockOptions, mockRegistrarGcashNumber);
        console.log('reset page');
    });

    describe('suite: clicking the status link', () => {
        beforeEach(() => {
            document.querySelector('.js-status-link').click();
        });

        it('displays the status page', () => {
            expect(document.querySelector('.js-top-text').innerText).toEqual('STATUS');
            expect(document.querySelector('.js-status-link').classList.contains('selected')).toBeTruthy();
            expect(document.querySelector('.js-search-and-filter-container').innerHTML).toBeTruthy();
            expect(document.querySelector('.js-table-container').innerHTML).toBeTruthy();
        });
        
        it('displays the table', () => {
            expect(document.querySelector('.number-column').innerText).toEqual('[1]');
            expect(document.querySelector('.request-student11228202464858am').innerHTML.includes('1.')).toBeTruthy();
            expect(document.querySelector('.request-student11228202464858am').innerHTML.includes('student11228202464858am')).toBeTruthy();
            expect(document.querySelector('.request-student11228202464858am').innerHTML.includes('Transcript of Records')).toBeTruthy();
            expect(document.querySelector('.request-student11228202464858am').innerHTML.includes('12/28/2024')).toBeTruthy();
            expect(document.querySelector('.request-student11228202464858am').innerHTML.includes('Released')).toBeTruthy();
        });
    })

    describe('suite: clicking the request link', () => {
        it('displays the form', () => {
            document.querySelector('.js-request-link').click();
            expect(document.querySelector('.js-top-text').innerText).toEqual('REQUEST');
            expect(document.querySelector('.js-request-link').classList.contains('selected')).toBeTruthy();
            expect(document.querySelector('.js-forms-container').innerHTML).toBeTruthy();
        });
    })
    
    describe('suite: clicking a request', () => {
        beforeEach(() => {
            document.querySelector('.js-status-link').click();
        });

        it('displays the status modal', () => {
            document.querySelector('.request-student11228202464858am').click();
            expect(document.querySelector('.status-header').innerText).toEqual('STATUS: RELEASED\n12/28/2024 1:35:41 PM\nUpdated By: admin');
            expect(document.querySelector('.remarks').innerText).toEqual('Remarks: test remarks');
        });

        it('closes the status modal', () => {
            document.querySelector('.request-student11228202464858am').click();
            document.querySelector('.js-close-button').click();
            expect(document.querySelector('.js-overlay-container').innerHTML).toBeFalsy();
        });
    });

    describe('suite: clicking the proceed button in the request page', () => {
        it('displays the payment modal', () => {
            document.querySelector('.js-request-link').click();
            document.getElementById('document-id').value = '1TOR';
            document.querySelector('.js-forms-proceed-button').click();

            expect(document.querySelector('.payment-cost').innerText).toEqual('200');
            console.log(document.querySelector('.payment-cost').innerText);
            ;
            
        });
    });

    describe('suite: clicking the filter button', () => {
        beforeEach(() => {
            document.querySelector('.js-status-link').click();
            document.querySelector('.js-filter-button').click();
        });

        it('displays the filter menu', () => {
            expect(document.querySelector('.js-filter-menu-container').innerHTML.includes('Pending')).toBeTruthy(); 
        });
        
        it('clicking a filter displays the corresponding existing requests', () => {
            document.querySelector('.js-filter-released').click();
            expect(document.querySelectorAll('.request').length).toEqual(1);
        });
        
        it('clicking a filter with inexistent requests displays nothing', () => {
            document.querySelector('.js-filter-pending').click();
            expect(document.querySelectorAll('.request').length).toEqual(0);
        });

        it('clicking the close button closes the filter menu', () => {
            expect(document.querySelector('.js-filter-menu-container').innerHTML).toBeTruthy();
            document.querySelector('.js-remove-filter-button').click();
            expect(document.querySelector('.js-filter-menu-container').innerHTML).toBeFalsy();
        });        
    });

    describe('suite: searching for a request', () => {
        beforeEach(() => {
            document.querySelector('.js-status-link').click();
        });

        it('searches for an existing request', () => {
            document.querySelector('.js-search-bar').value = '58am';
            document.querySelector('.js-search-bar').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            expect(document.querySelectorAll('.request').length).toEqual(1);
        });
        
        it('searches for an inexistent request', () => {
            document.querySelector('.js-search-bar').value = 'no request';
            document.querySelector('.js-search-bar').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            expect(document.querySelectorAll('.request').length).toEqual(0);
            console.log(document.querySelectorAll('.request'));
        });
        
    });
});
