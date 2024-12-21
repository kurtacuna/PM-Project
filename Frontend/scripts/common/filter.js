import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function filterArray(array, filter, page) {
    if (filter === '' || filter === undefined) {
        return array;
    } else {
        if (typeof filter === 'string') {
            return array.filter((item) => {
                return item.status === filter;
            });
        } else if (typeof filter === 'object') {
            let { startDate, endDate } = filter;
            startDate = dayjs(startDate);
            endDate = dayjs(endDate);
            return array.filter((item) => {
                if (page === 'Pending') {
                    const itemDate = dayjs(item['date-received']);
                    return itemDate >= startDate && itemDate <= endDate;
                } else if (page === 'To Receive') {
                    const itemDate = dayjs(item['date-completed']);
                    return itemDate >= startDate && itemDate <= endDate;
                } else if (page === 'Released') {
                    const itemDate = dayjs(item['date-released']);
                    return itemDate >= startDate && itemDate <= endDate;
                } else if (page === 'Rejected') {
                    const itemDate = dayjs(item['date-rejected']);
                    return itemDate >= startDate && itemDate <= endDate;
                }
            })
        }
    }
}