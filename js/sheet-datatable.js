function makeDataTable(tableid) {
    if (!$.fn.dataTable.isDataTable('table#' + tableid)) {

        //Format all the hyperlinks in <td> elements FIRST!so that column width is accordingly
        var cellval, secondslash, thirdslash, shortURL;
        $('table#' + tableid + ' td:contains("http"), table#' + tableid + ' td:contains("www")').html(function () {
            cellval = $(this).text(); //MOET ENKEL TEKST TOT EINDE LIJN ZIJN
            secondslash = cellval.indexOf('/', cellval.indexOf('/') + 1);
            thirdslash = cellval.indexOf('/', secondslash + 1);
            if (cellval.slice(secondslash + 1, secondslash + 4) == 'www') shortURL = cellval.slice(secondslash + 5, thirdslash);
            else shortURL = cellval.slice(secondslash + 1, thirdslash);
            return "<a class='tableLink' href='" + $(this).text() + "' target='_blank'>" + shortURL + "</a>"
        });

        //search QUESTION MARKS       
        $('table#' + tableid + ' td').filter(function () {
            return this.textContent.startsWith('?')
        }).html(function () {
            cellval = $(this).text(); //MOET ENKEL TEKST TOT EINDE LIJN ZIJN
            return "<span class='uncertain'>" + cellval.slice(1, cellval.length) + "</span>"
        });

        var table = $('table#' + tableid).DataTable({
            "scrollY": "calc(100vh - 50px - 2*36px - 20px)",
            "scrollCollapse": true,
            "paging": false,
            "ordering": true,
            "order-column": true,
            "order": [[0, 'asc'], [1, 'asc']],
            "fixedColumns": true,
            /* "dom": '<"top"i>ft', */
            "columnDefs": [{
                "targets": 'details-control',
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {
                "targets": 'titlecolumn',
                "className": 'titlecolumn'
            },
            {
                "targets": 'noVis',
                "visible": false
            },
            {
                "targets": 'date',
                "className": 'date',
                "width": "calc(20px + 10ex)",
                //"type": "date" //dit zorgt ervoor dat onvolledige data (-00-00) niet juist gesorteerd worden??
            },
            {
                "targets": 'collection',
                "data": 'collection'
            },
            {
                "targets": 'url',
                "className": 'url',
                //"render": function ( data, type, row, meta ) {
                //return '<a href="'+data+'">' + table.column(meta.column).header() + '</a>';
                //},
                //"visible": false
            }],
            // "columns": [{
            //     "render": function ( data, type, row, meta ) {
            //         return '<a href="'+data+'">Download</a>';
            //     }
            // }],
            "language": {
                "decimal": "",
                "emptyTable": "",
                "info": "_TOTAL_ results.",
                "infoEmpty": "",
                "infoFiltered": "(filtered from _MAX_ results)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Show _MENU_ entries",
                "loadingRecords": "Loading...",
                "processing": "Processing...",
                "search": tableid + ":",
                /* "search": "Filter " + tableid + ":", */
                "zeroRecords": "Nothing found...",
                "paginate": {
                    "first": "First",
                    "last": "Last",
                    "next": "Next",
                    "previous": "Previous"
                },
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                }
            },
        });

        /////NEW: link +sheet as a dropdown////////////
        if (isDatabase) linkSheet(table, tableid);
        else {
            //Add event listener for opening and closing details
            $('table#' + tableid + ' tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = table.row(tr);

                //select data (columns) that are hidden
                cells = table.cells(row, '.noVis');
                idx = table.cell(row, '.noVis').index().column;

                //format that data into a new table
                var details = '<table class="detailInfo">';
                for (var i = 0; i < cells.data().length; i++) {
                    title = row.column(idx + i).header();
                    if (cells.data()[i]) details = details + format($(title).html(), cells.data()[i]);
                }
                details = details + '</table>';

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    row.child(details, 'child').show();
                    tr.addClass('shown');
                }
            });
        }
    }
    return table.data().any();
}

function format(h, d) {
    // `d` is the original data object for the row
    return '<tr class="detailsRow">' +
        '<td class="detailsHeader">' + h + ':</td>' +
        '<td>' + d + '</td>' +
        '</tr>'
}