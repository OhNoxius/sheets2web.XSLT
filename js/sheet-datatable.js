function makeDataTable(tableid) {
    let table;
    if (typeof isDatabase == 'undefined') isDatabase = false;
    if (!$.fn.dataTable.isDataTable('table#' + tableid)) {

        //Format all the hyperlinks in <td> elements FIRST!so that column width is accordingly
        let cellval, secondslash, thirdslash, shortURL;
        // $('table#' + tableid + ' td:contains("http"), table#' + tableid + ' td:contains("www")').html(function () {
        //     cellval = $(this).text(); //MOET ENKEL TEKST TOT EINDE LIJN ZIJN
        //     secondslash = cellval.indexOf('/', cellval.indexOf('/') + 1);
        //     thirdslash = cellval.indexOf('/', secondslash + 1);
        //     if (cellval.slice(secondslash + 1, secondslash + 4) == 'www') shortURL = cellval.slice(secondslash + 5, thirdslash);
        //     else shortURL = cellval.slice(secondslash + 1, thirdslash);
        //     return "<a title='" + cellval + "' class='tableLink' href='" + $(this).text() + "' target='_blank'>" + shortURL + "</a>"
        // });

        //SLIM ALTERNATIEF, mr voorlopig nog volledig url weergave, en $ teken loopt mis
        $('table#' + tableid + ' td:contains("http"), table#' + tableid + ' td:contains("www")').html(function () {
            let content = $(this).text();
            let exp_match = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; //find https?
            let element_content = content.replace(exp_match, "<a class='url' target='_blank' title='$1' href='$1'>$1</a>");
            let new_exp_match = /(^|[^\/])(www\.[\S]+(\b|$))/gim; //find www?
            let new_content = element_content.replace(new_exp_match, '$1<a class="url" title="http://$2" target="_blank" href="http://$2">$2</a>');
            return new_content;
        });

        //search QUESTION MARKS       
        $('table#' + tableid + ' td').filter(function () {
            return this.textContent.startsWith('?')
        }).html(function () {
            cellval = $(this).text(); //MOET ENKEL TEKST TOT EINDE LIJN ZIJN
            return "<span class='uncertain'>" + cellval.slice(1, cellval.length) + "</span>"
        });

        //let noVis1 = $('table#' + tableid + ' th.noVis').index();
        let noVis = [];
        $('table#' + tableid + ' th.noVis').each(function () {
            noVis.push($(this).index());
        });
        let orderColumns;
        if (noVis.length) orderColumns = [[1, 'asc']];
        else orderColumns = [[0, 'asc']];
        //console.log(noVis);

        let hasDetails;
        table = $('table#' + tableid).DataTable({
            // responsive: true,
            "autoWidth": true,
            "scrollY": "calc(100vh - 50px - 2*36px - 16px)", //100% viewheight - heading - (tableheader+searchbar) - tablefooter
            "scrollCollapse": true,
            "paging": false,
            "ordering": true,
            "order-column": true,
            "order": orderColumns, //[[0, 'asc'], [1, 'asc']],
            // "fixedColumns": true,
            /* "dom": '<"top"i>ft', */
            "createdRow": function (row, data, dataIndex) {

                if (!isDatabase) {
                    hasDetails = false;
                    for (let i = 0; i < noVis.length; i++) {
                        if (data[noVis[i]]) {
                            //$(row).addClass('important');
                            //console.log(row.querySelector("td.details"));
                            //console.log(data[noVis1]);
                            hasDetails = true;
                            break;
                        }
                    }
                    if (hasDetails) $(row).find("td.details").addClass('details-control');
                }
            },
            "columnDefs": [{
                "targets": 'details',
                "orderable": false,
                "data": null,
                "defaultContent": '',
            },
            {
                "targets": 'details-control',
                // "createdCell": function (td, cellData, rowData, rowIndex, colIndex) {
                //     if (true) {
                //         //console.log(rowData);
                //         //$(td).addClass('details-control');
                //     }
                // },
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": '',
                //"width": '1px' //padding + icon width... doet niks?
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
                "targets": 'urlCol',
                "className": 'urlCol',
                // "type": 'html',
                // "width": "20",
                // "render": function ( data, type, row ) {
                //     return ;
                // }
                // "render": function (data, type, row, meta) {
                //     let celltext = $(data).text();
                //     //return '<a href="'+data+'">' + table.column(meta.col).header() + '</a>'; //werkt niet? zou column header moeten weergeven
                //     return (data ? '<a class="tableLink" title="' + celltext + '" href="' + celltext + '">' + celltext.substr(0, 20) + 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww</a>' : '<a href="' + data + '">search</a>');
                // },
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
                "info": "_TOTAL_ results",
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
        if (isDatabase) {
            linkSheet(table, tableid);
            //append search box to column header
            var ths = document.querySelector("table.dataTable").querySelectorAll("thead th");//$('table#' + tableid + ' thead th');
            ths.forEach(
                function (th, index, listObj) {
                    if (sheetNames.includes(th.innerText)) {
                        //console.log(th + ', ' + index + ', ' + this);
                        th.innerHTML = '<label for="' + th.innerText + '">' + th.innerText + '</label>'+
                        '<input list="' + th.innerText + '-list" id="' + th.innerText + '" name="' + th.innerText + '" class="searchfield" />'+
                        '<datalist id="' + th.innerText + '-list"></datalist>';
                    }
                },
                'thisTh'
            );
            //console.log({title});
            // $(title).html(title.innerText + ' <input type="text" class="filter" placeholder="" />');
            //title.innerHTML = title.innerText + ' <input type="text" class="filter" placeholder="" />';
            // Apply the search
            table.columns().every(function () {
                var that = this;
                $('input', this.header()).on('keyup change', function () { //on "select" of zoiets  + on keypress 
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                    // $(document).on('keypress',function(e) {
                    //     if(e.which == 13) {
                    //         alert('You pressed enter!');
                    //     }
                    // });
                });
            });
            //klik op table header NIET MEER SORTEREN
            $(ths).find('.searchfield').on('click', function (e) {
                e.stopPropagation();
            });
        }
        else {
            //Add event listener for opening and closing details
            $('table#' + tableid + ' tbody').on('click', 'td.details-control', function () {
                let tr = $(this).closest('tr');
                let row = table.row(tr);

                //select data (columns) that are hidden
                cells = table.cells(row, '.noVis');
                idx = table.cell(row, '.noVis').index().column;

                //format that data into a new table
                let title = "", details = "", detailsTable = "";
                for (let i = 0; i < cells.data().length; i++) {
                    title = row.column(idx + i).header();
                    if (cells.data()[i]) details = details + format($(title).html(), cells.data()[i]);
                }
                detailsTable = '<table class="detailInfo">' + details + '</table>';

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