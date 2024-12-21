export function checkAllFields(form) {
    const formData = Object.fromEntries(new FormData(form));
    for (let data in formData) {
        if (formData[data] === '') {
            return false;
        }
    }
    
    return true;
}