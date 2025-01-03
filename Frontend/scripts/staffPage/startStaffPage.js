// Overview:
// Initializes the staff page

import { initiateStaffLinks } from "./links.js";

await initiateStaffLinks();

// Display pending page as defualt
document.querySelector('.js-pendning-link').click();