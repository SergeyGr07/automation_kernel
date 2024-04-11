document.getElementById('dateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var startDate = document.getElementById('startDate').value;
    console.log(startDate)
    var endDate = document.getElementById('endDate').value;
    console.log(endDate)
    var currentUrl = window.location.origin;
    var putDataUrl = currentUrl + '/get_data?start_date=' + startDate + '&end_date=' + endDate;
    console.log(putDataUrl)

    fetch(putDataUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            var tableContainer = document.getElementById('tableContainer');
            tableContainer.innerHTML = '';

            for (var key in data) {
                var table = document.createElement('table');
                table.className = 'table table-striped';

                var thead = document.createElement('thead');
                var headerRow = document.createElement('tr');
                data[key][0].forEach(function(header) {
                    var th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                var tbody = document.createElement('tbody');
                data[key].slice(1).forEach(function(row) {
                    var tr = document.createElement('tr');
                    row.forEach(function(cell) {
                        var td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);

                var heading = document.createElement('h3');
                heading.textContent = key;
                tableContainer.appendChild(heading);
                tableContainer.appendChild(table);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });