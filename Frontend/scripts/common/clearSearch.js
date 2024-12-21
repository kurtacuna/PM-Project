export function clearSearch() {
    const removeFilterButton = document.querySelector('.js-remove-filter-button');
    const searchBar = document.querySelector('.js-search-bar');
    if (removeFilterButton) {
        removeFilterButton.style.display = 'none';
    }

    if (searchBar) {
        searchBar.value = '';
    }

    const url = new URL(window.location.href);
    url.searchParams.delete('search');
    history.replaceState({}, "", url);
}