export function search(array, searchQuery) {
    return array.filter((item) => {
        return item.request_id.toLowerCase().includes(searchQuery.toLowerCase());
    });
}

export function matchRequest(requests, requestId) {
    let matchingRequest;
    requests.filter((item) => {
        if (item.request_id === requestId) {
            matchingRequest = item;
        }
    });

    return matchingRequest;
}