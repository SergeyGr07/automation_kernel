document.addEventListener("DOMContentLoaded", function() {
    var currentUrl = window.location.origin;
    var putDataUrl = currentUrl + '/reports/custom_table';

    function createTable() {
        var titleInput = document.getElementById('titleInput');
        var rowsInput = document.getElementById('rowsInput');
        var colsInput = document.getElementById('colsInput');

        var title = titleInput.value;
        console.log(title)
        var rows = parseInt(rowsInput.value);
        console.log(rows)
        var cols = parseInt(colsInput.value);
        console.log(cols)

        if (title && rows > 0 && cols > 0) {
            generateTable(rows, cols);
        } else {
            alert('Пожалуйста, введите корректные данные');
        }
    }

    window.createTable = createTable;

    function generateTable(rows, cols) {
        var modalBody = document.getElementById('tableBody');
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
                        case 3:
                            cell.setAttribute('contenteditable', 'true');
                            break;
                        case 4:
                            cell.setAttribute('contenteditable', 'true');
                            break;
                        default:
                            cell.setAttribute('contenteditable', 'true');
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

        var saveButton = document.getElementById('saveButton');
        saveButton.addEventListener('click', function() {
            var tableName = document.getElementById('titleInput').value;
            var tableData = [];
            var tbody = document.querySelector('table tbody');
            var selectedDetail = document.getElementById('detailInput').value;
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
