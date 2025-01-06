import { refreshAccessToken } from "./refreshAccessToken.js";
import { serverErrorMessage } from "./serverErrorMessage.js";

export async function getRegistrarNumber() {
    let sessionAccessToken = sessionStorage.getItem('accessToken');

    let response = await fetch('/registrar/number', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionAccessToken}`
        }
    });

    if (response.status === 401 || response.status === 403) {
        const accessToken = await refreshAccessToken();
        sessionStorage.setItem('accessToken', accessToken);
        sessionAccessToken = accessToken;

        response = await fetch('/registrar/number', {
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
        const registrarGcashNumber = await response.json();
        return registrarGcashNumber[0].gcash_number;
    }
}