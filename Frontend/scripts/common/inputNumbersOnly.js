export function inputNumbersOnly(inputElement) {
    inputElement.addEventListener('keydown', (event) => {
        if (
            !((event.key >= '0' && event.key <= '9') ||
            event.key === 'Control' ||
            event.key === 'Backspace' ||
            event.key === 'ArrowLeft' ||
            event.key === 'ArrowRight')
        ) {
            event.preventDefault();
        }
    });
}