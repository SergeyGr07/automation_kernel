document.getElementById('dateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var startDate = document.getElementById('startDate').value.split('-').reverse().join('-');
    var endDate = document.getElementById('endDate').value.split('-').reverse().join('-');
    console.log(startDate)
    console.log(endDate)
    var currentUrl = window.location.origin;
    var putDataUrl = currentUrl + '/get_data?start_date=' + startDate + '&end_date=' + endDate;
    console.log(putDataUrl)

    fetch(putDataUrl)
        .then(response => response.json())
        .then(data => {
            var tableContainer = document.getElementById('tableContainer');
            tableContainer.innerHTML = '';

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var heading = document.createElement('h3');
                    heading.textContent = key;
                    tableContainer.appendChild(heading);

                    var table = document.createElement('table');
                    table.classList.add('table', 'table-bordered', 'mt-4');

                    var thead = document.createElement('thead');
                    var headerRow = document.createElement('tr');
                    var headers = ['№', 'Value', 'Name', 'Average', 'Allowance', 'Geometry'];
                    headers.forEach(function(header) {
                        var th = document.createElement('th');
                        th.textContent = header;
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);
                    table.appendChild(thead);

                    var tbody = document.createElement('tbody');
                    var rows = Object.values(data[key])[0];
                    rows.forEach(function(row) {
                        var tr = document.createElement('tr');
                        row.forEach(function(cell, index) {
                            var td = document.createElement('td');
                            if (Array.isArray(cell)) {
                                td.textContent = cell.join(', ');
                            } else if (cell === null) {
                                td.textContent = '';
                            } else {
                                td.textContent = cell;
                            }
                            tr.appendChild(td);
                        });
                        tbody.appendChild(tr);
                    });
                    table.appendChild(tbody);

                    tableContainer.appendChild(table);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});