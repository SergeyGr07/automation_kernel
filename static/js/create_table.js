document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('ticketForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        var rows = parseInt(document.getElementById('table_rows').value);
        var cols = parseInt(document.getElementById('table_cols').value);

        generateTable(rows, cols);
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
            modal.hide();
        });

        var closeButton = document.querySelector('.btn-close');
        closeButton.addEventListener('click', function () {
            modal.hide();
        });
    }
});
