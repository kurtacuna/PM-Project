import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import customParseFormat from 'https://unpkg.com/dayjs@1.11.10/esm/plugin/customParseFormat/index.js';
dayjs.extend(customParseFormat);

export function timestamp() {
    const timestamp = dayjs().format('MMDDYYYYhmmssa')
    return timestamp;
}

export function formatDateTime(dateTime) {
    const formattedDateTime = dayjs(dateTime).format('MM/DD/YYYY [<br>] [<span style="font-size: 13px">]h:mm:ss A[</span>]');

    return formattedDateTime;
}

export function formatDateSameLine(dateTime) {
    const formattedDateTime = dayjs(dateTime).format('MM/DD/YYYY h:mm:ss A');

    return formattedDateTime;
}