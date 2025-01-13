import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { clearInnerContainer } from "./clearInnerContainer.js";
import { getRequests } from "../common/getRequests.js";

export async function displayStatistics() {
    clearInnerContainer();
    document.querySelector('.js-statistics').innerHTML = '';
    document.title = 'Statistics';
    document.querySelector('.js-top-text').innerText = 'STATISTICS';

    document.querySelector('.js-statistics').innerHTML += `
        <div class="tabs-container js-tabs-container">
            <div class="tab js-total-requests-tab">
                Per Month
            </div>
            <div class="tab js-per-status-tab">
                Per Status
            </div>
        </div>
        <div class="charts-container js-charts-container"></div>
    `;

    const requests = await getRequests();

    document.querySelector('.js-tabs-container').addEventListener('click', (event) => {
        if (event.target.classList.contains('js-total-requests-tab')) {
            clearSelectedTab();
            event.target.classList.add('selected-tab');
            displayChartPage(requests);
        } else if (event.target.classList.contains('js-per-status-tab')) {
            clearSelectedTab();
            event.target.classList.add('selected-tab');
            displayChartPage(requests);
        }
    });
    
    document.querySelector('.js-total-requests-tab').click();
}

function clearSelectedTab() {
    document.querySelectorAll('.tab').forEach((tab) => {
        if (tab.classList.contains('selected-tab')) {
            tab.classList.remove('selected-tab');
        }
    });
}

let totalRequestsChart;
let requestsPerStatusChart;
function displayChartPage(requests) {
    document.querySelector('.js-charts-container').innerHTML = `
        <select name="filter-by-year" id="filter-by-year">
            ${determineYearRange(requests)}
        </select>
        <div class="js-total-requests-page">
            <div>
                <canvas id="total-requests"></canvas>
            </div>
            <div class="page-table js-total-requests-table"></div>
        </div>
        <div class="js-per-status-page">
            <div class="per-status-chart-container">
                <canvas id="per-status"></canvas>
            </div>
            <div class="page-table js-per-requests-table"></div>
        </div>
    `;
    
    document.body.addEventListener('changeYear', () => {
        if (totalRequestsChart) {
            totalRequestsChart.destroy();
        }
        if (requestsPerStatusChart) {
            requestsPerStatusChart.destroy();
        }

        if (document.querySelector('.js-total-requests-tab').classList.contains('selected-tab')) {
            const sortedData = filterByYear(requests, 'Total Requests');
            document.querySelector('.js-per-status-page').style.display = 'None';
            displayTotalRequestsChart(sortedData);
            displayTotalRequestsTable(sortedData);
        } else if (document.querySelector('.js-per-status-tab').classList.contains('selected-tab')) {
            const sortedData = filterByYear(requests, 'Per Status');
            document.querySelector('.js-total-requests-page').style.display = 'None';
            displayPerStatusChart(sortedData);
            displayPerStatusTable(sortedData);
        }
    })
    
    const selectYear = document.getElementById('filter-by-year');
    selectYear.addEventListener('change', () => {
        const changeYearEvent = new CustomEvent('changeYear');
        document.body.dispatchEvent(changeYearEvent);
    });

    selectYear.value = dayjs().year();
    const defaultChart = new Event('change');
    selectYear.dispatchEvent(defaultChart);
}

function displayTotalRequestsChart(sortedData) {
    const selectYear = document.getElementById('filter-by-year');
    const totalRequests = document.getElementById('total-requests').getContext('2d');
    totalRequestsChart = new Chart(totalRequests, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Requests',
                data: sortedData,
                backgroundColor: 'rgb(99, 1, 1)'
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Requests Per Month (${selectYear.value})`,
                    font: {
                        size: 25
                    }
                }
            }
        }
    });
}

function displayTotalRequestsTable(sortedData) {
    document.querySelector('.js-total-requests-table').innerHTML = `
        <table>
            <tr>
                <th>Month</th>
                <th>Requests</th>
            </tr>
            <tr>
                <td>January</td>
                <td>${sortedData[0]}</td>
            </tr>
            <tr>
                <td>February</td>
                <td>${sortedData[1]}</td>
            </tr>
            <tr>
                <td>March</td>
                <td>${sortedData[2]}</td>
            </tr>
            <tr>
                <td>April</td>
                <td>${sortedData[3]}</td>
            </tr>
            <tr>
                <td>May</td>
                <td>${sortedData[4]}</td>
            </tr>
            <tr>
                <td>June</td>
                <td>${sortedData[5]}</td>
            </tr>
            <tr>
                <td>July</td>
                <td>${sortedData[6]}</td>
            </tr>
            <tr>
                <td>August</td>
                <td>${sortedData[7]}</td>
            </tr>
            <tr>
                <td>September</td>
                <td>${sortedData[8]}</td>
            </tr>
            <tr>
                <td>October</td>
                <td>${sortedData[9]}</td>
            </tr>
            <tr>
                <td>November</td>
                <td>${sortedData[10]}</td>
            </tr>
            <tr>
                <td>December</td>
                <td>${sortedData[11]}</td>
            </tr>
            <tr>
                <td><b>Total<b></td>
                <td>${sortedData.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</td>
            </tr>
        </table>
    `;
}

function displayPerStatusChart(sortedData) {
    const selectYear = document.getElementById('filter-by-year');
    const requestsPerStatus = document.getElementById('per-status').getContext('2d');

    requestsPerStatusChart = new Chart(requestsPerStatus, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'To Receive', 'Released', 'Rejected'],
            datasets: [
                {
                    label: 'Requests Per Status',
                    data: sortedData,
                    backgroundColor: [
                        '#ffee00',
                        '#d0ff00',
                        'rgb(0 191 0)',
                        'red'
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '40%',
            plugins: {
                title: {
                    display: true,
                    text: `Requests Per Status (${selectYear.value})`,
                    font: {
                        size: 25
                    }
                }
            }
        }
    });
}

function displayPerStatusTable(sortedData) {
    document.querySelector('.js-per-requests-table').innerHTML = `
        <table>
            <tr>
                <th>Status</th>
                <th>Quantity</th>
            </tr>
            <tr>
                <td>Pending</td>
                <td>${sortedData[0]}</td>
            </tr>
            <tr>
                <td>To Receive</td>
                <td>${sortedData[1]}</td>
            </tr>
            <tr>
                <td>Released</td>
                <td>${sortedData[2]}</td>
            </tr>
            <tr>
                <td>Rejected</td>
                <td>${sortedData[3]}</td>
            </tr>
        </table>
    `;
}

function determineYearRange(requests) {
    requests = [...requests, {date_requested: "2024-01-13T10:01:13.000Z"}];

    if (requests.length === 0) {
        return `
            <option value="No data" disabled></option>
        `;
    }

    let maxYear = dayjs(requests[0].date_requested).year();
    let minYear = dayjs(requests[requests.length - 1].date_requested).year();

    let optionsHTML = '';
    while (minYear <= maxYear) {
        optionsHTML += `
            <option class="js-year-option" value="${minYear}">${minYear}</option>
        `;
        minYear += 1;
    }

    return optionsHTML;
}

function filterByYear(requests, tab) {
    const year = parseInt(document.getElementById('filter-by-year').value);

    let requestsByYear = [];
    requests.forEach((request) => {
        if (dayjs(request.date_requested).year() === year) {
            requestsByYear.push(request);
        }
    });

    if (tab === 'Total Requests') {
        return countByMonth(requestsByYear);
    } else if (tab === 'Per Status') {
        return filterByStatus(requestsByYear);
    }
}

function countByMonth(requests) {
    requests = requests.sort((a, b) => { return dayjs(a.date_requested).month() - dayjs(b.date_requested).month() });

    let requestsPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    requests.forEach((request) => {
        requestsPerMonth[dayjs(request.date_requested).month()] += 1;
    });

    return requestsPerMonth;
}

function filterByStatus(requests) {
    const statusCounts = {
        'Pending': 0,
        'To Receive': 0,
        'Released': 0,
        'Rejected': 0
    };

    requests.forEach((request) => {
        if (statusCounts.hasOwnProperty(request.status)) {
            statusCounts[request.status] += 1;
        }
    });

    return Object.values(statusCounts);
}
