// Overview:
// Gets the requests from the server

import { refreshAccessToken } from "./refreshAccessToken.js";
import { serverErrorMessage } from "./serverErrorMessage.js";

export async function getRequests() {
    const sessionUsername = sessionStorage.getItem('username');
    const sessionRole = sessionStorage.getItem('role');
    let sessionAccessToken = sessionStorage.getItem('accessToken');

    let response = await fetch(`/requests?username=${sessionUsername}&role=${sessionRole}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionAccessToken}`
        }
    });

    if (response.status === 401 || response.status === 403) {
        const accessToken = await refreshAccessToken();

        if (accessToken) {
            sessionStorage.setItem('accessToken', accessToken);
        }
        sessionAccessToken = accessToken;

        response = await fetch(`/requests?username=${sessionUsername}&role=${sessionRole}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionAccessToken}`
            }
        });
    }

    console.log(response);

    if (response.status === 500) {
        serverErrorMessage();
        return;
    }

    if (response.status === 200) {
        const requests = await response.json();
        return requests;
    }
}