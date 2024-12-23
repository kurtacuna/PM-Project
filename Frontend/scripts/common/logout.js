export async function logout() {
    const sessionUsername = sessionStorage.getItem('username');
    const sessionRole = sessionStorage.getItem('role');

    const response = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'username': sessionUsername, 'role': sessionRole })
    });

    if (response.status === 200) {
        return true;
    } else if (response.status === 500) {
        return false;
    }
}