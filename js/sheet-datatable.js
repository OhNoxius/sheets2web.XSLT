function makeDataTable(tableid) {
    let dTable;
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

        let noVis = [];
        $('table#' + tableid + ' th.noVis').each(function () { noVis.push($(this).index()); });
        let orderColumns;
        if (noVis.length) orderColumns = [[1, 'asc']];
        else orderColumns = [[0, 'asc']];

        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        let scrollY = vh - 50 - 36 - 21 - 16; //100% viewheight - heading - tableheader - searchbar  - footer

        if (isDatabase) {
            scrollY -= 2 * 36;
            if ($('table.mainsheet th.linkedinfo').index() > 0) orderColumns[0][0] += 1;
        }

        //INITIALIZE DATATABLE:
        //---------------------
        dTable = $('table#' + tableid).DataTable({
            // responsive: true,
            "orderCellsTop": true,
            "autoWidth": true,
            "scrollY": scrollY,//"calc(100vh - 50px - 2*36px - 16px)", //100% viewheight - heading - (tableheader+searchbar) - tablefooter
            "scrollCollapse": true,
            "paging": false,
            "ordering": true,
            "order-column": true,
            "order": orderColumns, //[[0, 'asc'], [1, 'asc']],
            // "fixedColumns": true,
            /* "dom": '<"top"i>ft', */
            "createdRow": function (row, data, dataIndex) {
                if (!isDatabase) {
                    let hasDetails = false;
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
            "initComplete": function () {
                this.api().columns().every(function () {
                    let column = this;
                    let th = column.header();
                    //if (sheetNames.includes(column.header().innerText)) {
                    //var select = $('<select><option value=""></option></select>')
                    if (th.classList.contains("details-control")) {
                        $("table.mainsheet thead tr:eq(1) th").eq(column.index()).empty();
                    }
                    else if (th.classList.contains("linkedinfo")) {
                        $("table.mainsheet thead tr:eq(1) th").eq(column.index()).empty();
                        linkedSheetType.forEach(function (value, index, array) {
                            $('<input type="checkbox" id="' + th.innerText + value + '" name="' + th.innerText + '" value="' + value + '" class="headercheckbox" />' +
                                '<label for="' + th.innerText + value + '">' + value + '</label>')
                                .appendTo($("table.mainsheet thead tr:eq(1) th").eq(column.index()));
                        });
                        $('input:checkbox').on('change', function (e) {
                            //build a regex filter string with an or(|) condition
                            let checkboxes = $('input:checkbox:checked').map(function () {
                                return this.value;
                            }).get().join('|');

                            //filter in column 1, with an regex, no smart filtering, not case sensitive
                            column.search(checkboxes, true, false, false).draw(false);

                        });
                        //$(document).on('keypress',function(e) {
                            //         //     if(e.which == 13) {
                            //         //         alert('You pressed enter!');
                            //         //     }
                            //         // });
                    }
                    else {
                        let datalist = $('<input type="search" list="' + th.innerText + '-list" id="' + th.innerText + '" name="' + th.innerText + '" class="headersearch" />' +
                            '<datalist id="' + th.innerText + '-list"></datalist>')
                            //.appendTo($(column.footer()).empty())
                            .appendTo($("table.mainsheet thead tr:eq(1) th").eq(column.index()).empty())
                            .on('input', function () {
                                // var val = $.fn.dataTable.util.escapeRegex(
                                //     $(this).val()
                                // );
                                // column
                                //     .search(val ? '^' + val + '$' : '', true, false) //CHECKEN!!!!!
                                //     .draw();
                                if (column.search() !== this.value) {
                                    column
                                        .search(this.value)
                                        .draw();
                                }
                            });

                        let ARR = column.data().unique().toArray();
                        let SET = new Set(ARR.join('$').split('$'));
                        ARR = [...SET].sort();

                        //column.data().unique().sort().each(function (d, j) {
                        ARR.forEach(function(val) {
                            datalist.append('<option value="' + val + '">' + val + '</option>')
                        });
                    }


                    //}
                });
            }
        });

        /////NEW: link +sheet as a dropdown////////////
        if (isDatabase) {
            linkSheet(dTable, tableid);
            // // append search box to column header
            // let ths = document.querySelector("table.dataTable").querySelectorAll("thead th");//$('table#' + tableid + ' thead th');
            // ths.forEach(
            //     function (th, index, listObj) {
            //         if (sheetNames.includes(th.innerText)) {
            //             th.innerHTML = '<label for="' + th.innerText + '">' + th.innerText + '</label>' + '<br/>' +
            //                 '<input type="search" list="' + th.innerText + '-list" id="' + th.innerText + '" name="' + th.innerText + '" class="headersearch" />' +
            //                 '<datalist id="' + th.innerText + '-list"></datalist>';

            //             let fragment = document.createDocumentFragment();
            //             let opt;
            //             keys[th.innerText].forEach(function (keyValue, index) {
            //                 opt = document.createElement('option');
            //                 opt.value = keyValue;
            //                 fragment.appendChild(opt);
            //             });
            //             th.querySelector("datalist").appendChild(fragment);
            //         }
            //     },
            //     'thisTh'
            // );
            // //Apply the search
            // dTable.columns().every(function () {
            //     var that = this;
            //     $('input', this.header()).on('keyup change', function () { //on "select" of zoiets  + on keypress 
            //         if (that.search() !== this.value) {
            //             that
            //                 .search(this.value)
            //                 .draw();
            //         }
            //         // $(document).on('keypress',function(e) {
            //         //     if(e.which == 13) {
            //         //         alert('You pressed enter!');
            //         //     }
            //         // });
            //     });
            // });
            // //klik op table header NIET MEER SORTEREN
            // $(ths).find('.headersearch').on('click', function (e) {
            //     e.stopPropagation();
            // });
        }
        else {
            //Add event listener for opening and closing details
            $('table#' + tableid + ' tbody').on('click', 'td.details-control', function () {
                let tr = $(this).closest('tr');
                let row = dTable.row(tr);

                //select data (columns) that are hidden
                cells = dTable.cells(row, '.noVis');
                idx = dTable.cell(row, '.noVis').index().column;

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
    return dTable.data().any();
}

function format(h, d) {
    // `d` is the original data object for the row
    return '<tr class="detailsRow">' +
        '<td class="detailsHeader">' + h + ':</td>' +
        '<td>' + d + '</td>' +
        '</tr>'
}