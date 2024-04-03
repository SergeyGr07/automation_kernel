document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('ticketForm');
    var currentUrl = window.location.origin;
    var exportUrl = currentUrl + '/reports/select_detail';
    var putDataUrl = currentUrl + '/reports/put_data';
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var selectedDetail = document.getElementById('ticket_type').value;
        
        fetch(exportUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                detail: selectedDetail
            })
        })
        .then(response => response.json())
        .then(data => {
            var rows = data.row;
            var cols = data.col;
            console.log(rows, cols)

            generateTable(rows, cols);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    });

    function generateTable(rows, cols) {
        var modalBody = document.getElementById('tableBody');

        var table = document.createElement('table');
        table.classList.add('table', 'table-bordered');

        var tbody = document.createElement('tbody');

        for (var i = 0; i < rows; i++) {
            var row = document.createElement('tr');
            for (var j = 0; j < cols; j++) {
                var cell = document.createElement('td');
                if (j === 0) {
                    if (i === 0) {
                        cell.textContent = 'Position';
                    } else {
                        cell.textContent = i;
                    }
                } else {
                    cell.setAttribute('contenteditable', 'true');
                }
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        modalBody.innerHTML = '';
        modalBody.appendChild(table);

        var modal = new bootstrap.Modal(document.getElementById('tableModal'));
        modal.show();

        var saveButton = document.getElementById('saveButton');
        saveButton.addEventListener('click', function() {
            var tableName = document.getElementById('ticket_title').value;
            console.log(tableName)
            var tableData = [];
            tbody.querySelectorAll('tr').forEach(function(row) {
                var rowData = [];
                row.querySelectorAll('td').forEach(function(cell) {
                    rowData.push(cell.textContent);
                });
                tableData.push(rowData);
            });

            var dataToSend = {
                [tableName]: tableData
            };

            fetch(putDataUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
            .then(response => {
                if (response.ok) {
                    alert('Данные успешно сохранены!');
                } else {
                    throw new Error('Произошла ошибка при сохранении данных');
                }
            })
            .catch(error => {
                console.error('Ошибка при сохранении данных:', error);
            });

            modal.hide();
        });

        var closeButton = document.querySelector('.btn-close');
        closeButton.addEventListener('click', function () {
            modal.hide();
        });
    }
});
