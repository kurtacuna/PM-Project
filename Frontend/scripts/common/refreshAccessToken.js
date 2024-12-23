// Overview:
// Refreshes user's access token

import { serverErrorMessage } from "./serverErrorMessage.js";

export async function refreshAccessToken() {
    const sessionRole = sessionStorage.getItem('role');
    const sessionUsername = sessionStorage.getItem('username');

    if (!sessionRole || !sessionUsername) {
        alert('Please log in first.');
        if (window.location.href.includes('student')) {
            window.location.href = '/student/studentLogin.html';
            return;
        } else if (window.location.href.includes('staff')) {
            window.location.href = '/staff/staffLogin.html';
            return;
        }
    }

    const response = await fetch('/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'role': sessionRole, 'username': sessionUsername})
    });

    if (response.status === 500) {
        serverErrorMessage();
        return;
    }

    if (response.status === 201) {
        const { accessToken } = await response.json();
        return accessToken;
    } else if (response.status === 401 || response.status === 403) {
        alert('Please log in again.');
        if (sessionRole === 'student') {
            window.location.href = '/student/studentLogin.html';
        } else if (sessionRole === 'staff') {
            window.location.href = '/staff/staffLogin.html';
        }
    }
}