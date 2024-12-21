// Overview:
// Adds a 'selected' class to the link of the current page for styling

export function clearSelected() {
    document.querySelectorAll('.link').forEach((link) => {
        if (link.classList.contains('selected')) {
            link.classList.remove('selected');
        }
    });
}