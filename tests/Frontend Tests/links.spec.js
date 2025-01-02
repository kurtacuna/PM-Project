import { initiateLinks } from "../../Frontend/scripts/studentPage/links.js";
import { getRequests } from "../../Frontend/scripts/common/getRequests.js";

describe('student links.js', () => {
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
            "remarks": "as/dfa'sfasdfa",
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

    beforeEach(async () => {
        jest.mock('../../Frontend/scripts/common/getRequests.js', () => {
            getRequests: jest.fn(() => {Promise.resolve(mockRequests)});
        });

        await initiateLinks();
    });

    it('initializes the status page as default', async () => {
        expect(jest.isMockFunction(getRequests)).toHaveBeenCalled();
    })
});
