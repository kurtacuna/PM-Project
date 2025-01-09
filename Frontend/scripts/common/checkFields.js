export function checkAllFields(form) {
    const formData = Object.fromEntries(new FormData(form));

    if ('share-link' in formData) {
        delete formData['share-link'];
    }

    for (let data in formData) {
        if (formData[data] === '') {
            return false;
        }
    }
    
    return true;
}