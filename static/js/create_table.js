document.addEventListener('DOMContentLoaded', function() {
    var currentUrl = window.location.origin;
    var get_detail_url = currentUrl + '/reports/get_details';
    fetch(get_detail_url)
      .then(response => response.json())
      .then(data => {
        const select = document.getElementById('ticket_type');
        data.detail_names.forEach(detail => {
          let option = new Option(detail.name, detail.value);
          select.appendChild(option);
        });
      })
      .catch(error => console.error('Ошибка:', error));
  });

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
            var rows = data.row + 1;
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
        var selectedDetail = document.getElementById('ticket_type').value;
        var table = document.createElement('table');
        table.classList.add('table', 'table-bordered');

        var tbody = document.createElement('tbody');

        for (var i = 0; i < rows; i++) {
            var row = document.createElement('tr');
            for (var j = 0; j < cols; j++) {
                var cell = document.createElement('td');
                if (i === 0) {
                    switch (j) {
                        case 0:
                            cell.textContent = 'Position';
                            break;
                        case 1:
                            cell.textContent = 'Nominal';
                            break;
                        case 2:
                            cell.textContent = 'Measurements';
                            break;
                        default:
                            cell.textContent = '';
                            break;
                    }
                } else {
                    if (j === 0) {
                        cell.textContent = i;
                    } else {
                        cell.setAttribute('contenteditable', 'true');
                    }
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

        var nextButton = document.getElementById('nextButton');
        nextButton.addEventListener('click', function() {
            var tableName = document.getElementById('ticket_title').value;
            var tableData = [];
            var tbody = document.querySelector('table tbody');

            tbody.querySelectorAll('tr').forEach(function(row) {
            var rowData = [];
            row.querySelectorAll('td').forEach(function(cell, index) {
                if (row.rowIndex !== 0 && index !== 0) {
                    var cellData = cell.textContent.split(',').map(function(item) {
                        return item.trim();
                    });
                    rowData.push(cellData);
                } else {
                    rowData.push(cell.textContent);
                }
            });
                tableData.push(rowData);
            });
            console.log(selectedDetail)
            var dataToSend = {
                [tableName]: {
                    [selectedDetail]: tableData
                }
            };
            
            console.log(dataToSend);

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
            generateTable(rows, cols);
            
        });

        function clearTable() {
            var tbody = document.querySelector('table tbody');
            tbody.querySelectorAll('tr').forEach((row, index) => {
                if (index !== 0) { // Пропускаем заголовок таблицы
                    row.querySelectorAll('td').forEach((cell, cellIndex) => {
                        if (cellIndex !== 0) { // Пропускаем столбец с номером позиции
                            cell.textContent = ''; // Очищаем данные ячейки
                        }
                    });
                }
            });
        }

        var saveButton = document.getElementById('saveButton');
        saveButton.addEventListener('click', function() {
            var tableName = document.getElementById('ticket_title').value;
            // console.log(tableName)
            var tableData = [];
            var tbody = document.querySelector('table tbody');

            tbody.querySelectorAll('tr').forEach(function(row) {
            var rowData = [];
            row.querySelectorAll('td').forEach(function(cell, index) {
                if (row.rowIndex !== 0 && index !== 0) {
                    var cellData = cell.textContent.split(',').map(function(item) {
                        return item.trim();
                    });
                    rowData.push(cellData);
                } else {
                    rowData.push(cell.textContent);
                }
            });
                tableData.push(rowData);
            });
            console.log(selectedDetail)
            var dataToSend = {
                [tableName]: {
                    [selectedDetail]: tableData
                }
            };
            
            console.log(dataToSend);

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
                    window.location.reload();
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
