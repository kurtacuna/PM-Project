// Overview:
// Initializes the student page

import { initiateStudentLinks } from "./links.js";

await initiateStudentLinks();

// Display status page as defaul
document.querySelector('.js-status-link').click();

