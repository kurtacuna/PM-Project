const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const byDateRequested = (documents) => {
    const sortedDocuments = [...documents].sort((documentA, documentB) => {
        return dayjs(documentB['date-requested'], 'MM/DD/YYYY - h:mm:ss A') - dayjs(documentA['date-requested'], 'MM/DD/YYYY - h:mm:ss A');
    });

    return sortedDocuments;
}

module.exports = { byDateRequested }