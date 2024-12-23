// Overview:
// Sends the login form data to the server

import { checkAllFields } from './checkFields.js';

document.getElementById('password').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.querySelector('.js-login-button').click();
    }
});

document.querySelector('.js-login-button').addEventListener('click', async () => {
    const loginForm = document.querySelector('.js-login-fields');
    if (checkAllFields(loginForm)) {
        const formData = Object.fromEntries(new FormData(loginForm));
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.status === 201) {
            const { username, role, accessToken } = await response.json();
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('role', role);
            sessionStorage.setItem('accessToken', accessToken);

            if (role === 'student') {
                window.location.href = '/student/studentPage.html';
            } else if (role === 'staff' && username === 'admin') {
                window.location.href = '/staff/admin.html';
            } else if (role === 'staff') {
                window.location.href = '/staff/staffPage.html';
            }
        } else if (response.status === 401) {
            alert('User unauthorized. Please double check your username and password.');
        }
    } else {
        alert('Please fill in all fields.');
    }
});