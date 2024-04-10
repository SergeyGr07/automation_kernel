document.addEventListener("DOMContentLoaded", function() {
    var currentUrl = window.location.origin;
    var putDataUrl = currentUrl + '/reports/custom_table';

    function createTable() {
        var titleInput = document.getElementById('titleInput');
        var rowsInput = document.getElementById('rowsInput');
    
        var title = titleInput.value;
        console.log(title)
        var rows = parseInt(rowsInput.value);
        console.log(rows)
    
        if (title && rows > 0) {
            generateTable(rows);
        } else {
            alert('Пожалуйста, введите корректные данные');
        }
    }
    
    window.createTable = createTable;
    
    function generateTable(rows) {
        var modalBody = document.getElementById('tableBody');
        var table = document.createElement('table');
        table.classList.add('table', 'table-bordered');
    
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        var headers = ['Position', 'Nominal', 'Measurements'];
    
        headers.forEach(function(headerText) {
            var th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
    
        thead.appendChild(headerRow);
        table.appendChild(thead);
    
        var tbody = document.createElement('tbody');
    
        for (var i = 1; i <= rows; i++) {
            var row = document.createElement('tr');
            for (var j = 0; j < 3; j++) {
                var cell = document.createElement('td');
                if (j === 0) {
                    cell.textContent = i;
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
            var tableName = document.getElementById('titleInput').value;
            var tableData = [];
            var tbody = document.querySelector('table tbody');
            var selectedDetail = document.getElementById('detailInput').value;
            var rowsInput = document.getElementById('rowsInput').value;
            console.log(rowsInput)
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

            var isChecked = document.getElementById('myCheckbox').checked;
            console.log(isChecked)

            if (isChecked) {
                var dataToSend = {
                    [tableName]: {
                        [selectedDetail]: tableData,
                        isChecked: isChecked, 
                        rows: rowsInput
                    }
                };
            } else {
                var dataToSend = {
                    [tableName]: {
                        [selectedDetail]: tableData,
                    }
                };
            }
            
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
