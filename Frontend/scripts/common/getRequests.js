// Overview:
// Gets the requests from the server

export async function getRequests() {
    const sessionUsername = sessionStorage.getItem('username');
    const sessionRole = sessionStorage.getItem('role');

    const response = await fetch(`/requests?username=${sessionUsername}&role=${sessionRole}`);
    const requests = await response.json();

    return requests;
}