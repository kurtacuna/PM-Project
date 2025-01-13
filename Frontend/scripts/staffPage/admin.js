// Overview:
// Displays the admin-specific link and contents

import { clearSelected } from "../common/clearSelected.js";
import { displaySettings } from "../admin/displaySettings.js";
import { displayStatistics } from "../admin/displayStatistics.js";

document.querySelector('.js-settings-link').addEventListener('click', function() {
    clearSelected();
    this.classList.add('selected');
    displaySettings();
});

document.querySelector('.js-statistics-link').addEventListener('click', function() {
    clearSelected();
    this.classList.add('selected');
    displayStatistics();
});