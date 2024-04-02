document.querySelector('#exportButton').addEventListener('click', function() {
    var currentUrl = window.location.href;
    console.log(currentUrl);
    var exportUrl = currentUrl + '/export_docx';
    console.log(exportUrl);

    fetch(exportUrl, {
        method: 'GET',
    })
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'report.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
