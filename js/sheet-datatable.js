function makeDataTable(tableid, database = false) {
    //if (dropdown) isDatabase = false;
    let table = document.getElementById(tableid);//document.querySelector("table#"+tableid);
    let dTable;
    //if (typeof isDatabase == 'undefined') isDatabase = false;
    if (!$.fn.dataTable.isDataTable(table)) {

        //Format all the hyperlinks in <td> elements FIRST!so that column width is accordingly
        let cellval, secondslash, thirdslash, shortURL;
        // OPTION 1
        // $('table#' + tableid + ' td:contains("http"), table#' + tableid + ' td:contains("www")').html(function () {
        //     cellval = $(this).text(); //MOET ENKEL TEKST TOT EINDE LIJN ZIJN
        //     secondslash = cellval.indexOf('/', cellval.indexOf('/') + 1);
        //     thirdslash = cellval.indexOf('/', secondslash + 1);
        //     if (cellval.slice(secondslash + 1, secondslash + 4) == 'www') shortURL = cellval.slice(secondslash + 5, thirdslash);
        //     else shortURL = cellval.slice(secondslash + 1, thirdslash);
        //     return "<a title='" + cellval + "' class='tableLink' href='" + $(this).text() + "' target='_blank'>" + shortURL + "</a>"
        // });

        // OPTION2: SLIM ALTERNATIEF, mr voorlopig nog volledig url weergave, en $ teken loopt mis
        $(table).find('td:contains("http"), td:contains("www")').html(function () {
            let content = $(this).text();
            let exp_match = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; //find https?
            let element_content = content.replace(exp_match, "<a class='url' target='_blank' title='$1' href='$1'>$1</a>");
            let new_exp_match = /(^|[^\/])(www\.[\S]+(\b|$))/gim; //find www?
            let new_content = element_content.replace(new_exp_match, '$1<a class="url" title="http://$2" target="_blank" href="http://$2">$2</a>');
            return new_content;
        });

        //search QUESTION MARKS       
        $(table).find('tbody tr td').filter(function () {
            return this.textContent.startsWith('?')
        }).html(function () {
            cellval = $(this).text(); //MOET ENKEL TEKST TOT EINDE LIJN ZIJN
            return "<span class='doubt' title='?'>" + cellval.slice(1, cellval.length) + "</span>"
        });

        //TOOLTIPS
        var getTooltip = function (sheetArg, idArg) {
            return new Promise(function (resolve) {
                transform(xml, xslTooltip, { sheet: sheetArg, id: idArg }).then(function (response) {
                    resolve(response);
                })
            }, function (error) {
                reject(Error(error));
            });
        }

        // $(function () {
        //     $(document).tooltip({
        //         items: ".tooltip",
        //         content: function () {
        //             if (this.textContent) {
        //                 let sheet = this.getAttribute("sheet").replace(/[^a-z_]/gi, "_");
        //                 let value = this.textContent.replace(/[^a-z_]/gi, "_");
        //                 let query = xml.querySelector(sheet + " " + value);
        //                 if (query) {
        //                     let result = Array.from(query.attributes, function ({ name, value }) {
        //                         if (value && name != 'id') return ("<li style='list-style-type:none;'>" + [name] + ":<span class='inline description'>" + value + "</span></li>")
        //                     });
        //                     return result;
        //                 }
        //             }
        //         }
        //     })
        // });

        let xmltag = /[^A-Za-z0-9-]/gi; //BADBADBADBADABDABDADB

        $(table).find('.tooltip').tooltipster({
            content: '',//'Loading...',
            // 'instance' is basically the tooltip. More details in the "Object-oriented Tooltipster" section.
            functionBefore: function (instance, helper) {
                let el = helper.origin;
                var $origin = $(helper.origin);

                // we set a variable so the data is only loaded once via Ajax, not every time the tooltip opens
                if ($origin.data('loaded') !== true) {
                    if (el.textContent) {
                        let sheet = el.getAttribute("sheet").replace(xmltag, "_");
                        let value = el.textContent.replace(xmltag, "_");
                        let query = xml.querySelector(sheet + " " + value);
                        if (query) {
                            let result = Array.from(query.attributes, function ({ name, value }) {
                                if (value && name != 'id') {
                                    if (value.includes('www') || value.includes('http')) {
                                        let exp_match = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; //find https?
                                        let newvalue = value.replace(exp_match, "<a class='url' target='_blank' title='$1' href='$1'>$1</a>");
                                        let new_exp_match = /(^|[^\/])(www\.[\S]+(\b|$))/gim; //find www?
                                        value = newvalue.replace(new_exp_match, '$1<a class="url" title="http://$2" target="_blank" href="http://$2">$2</a>');
                                    }
                                    return ("<li style='list-style-type:none;'><span class='inline description'>" + name + ": </span>" + value + "</li>")
                                }
                            });
                            instance.content(result);
                            $origin.data('loaded', true);
                        }
                    }
                }
            },
            interactive: true
        });

        // $(function () {
        //     $(document).tooltip({
        //         items: "[title]",
        //         content: function () {
        //             let element = $(this);
        //             let attr = $(this).attr('title');
        //             if (element.is("[data-geo]")) {
        //                 let text = element.text();
        //                 return "<img class='map' alt='" + text +
        //                     "' src='http://maps.google.com/maps/api/staticmap?" +
        //                     "zoom=11&size=350x350&maptype=terrain&sensor=false&center=" +
        //                     text + "'>";
        //             }
        //             if (typeof attr === typeof undefined || attr === false) {                        
        //                 return "AWESOME";
        //             }
        //             else { 
        //                 return element.attr("title");
        //             }
        //         }
        //     });
        // });

        let noVis = [];
        $(table).children('thead').children('tr:first-child').children('th.noVis').each(function () { noVis.push($(this).index()); });
        let orderColumns;
        if (noVis.length) {
            orderColumns = [[1, 'asc']];
            //noVis.forEach((o, i, a) => a[i] = a[i]-1);
        }
        else orderColumns = [[0, 'asc']];

        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        let scrollY = vh - 50 - 36 - 21 - 16; //100% viewheight - heading - tableheader - searchbar  - footer
        let tabledom = "ftir";

        if (database) {
            scrollY = scrollY - 50 + 20 - ((linkedSheetType.length - 2) * 19); // - 2nd header + no search filter
            tabledom = "tirf";
            document.querySelector("header").style.background = "linear-gradient(0deg, lightblue, transparent)";
            if ($('table.mainsheet th.linkedinfo').index() > 0) {
                orderColumns[0][0] += 1;
                //noVis.forEach((o, i, a) => a[i] = a[i]-1);
                //noVis.push($('table.mainsheet th.linkedinfo').index());
            }
        }


        //INITIALIZE DATATABLE:
        //---------------------
        dTable = $(table).DataTable({
            // responsive: true,
            "autoWidth": false,
            "dom": tabledom,
            "ordering": true,
            "order": orderColumns, //[[0, 'asc'], [1, 'asc']],
            "order-column": true,
            "orderClasses": false,
            "orderCellsTop": true,
            "paging": false,
            "processing": true,
            "scrollY": scrollY,
            "scrollCollapse": true,
            // "fixedColumns": true,
            /* "dom": '<"top"i>ft', */
            "createdRow": function (row, data, dataIndex) {
                //if (!database) {
                let hasDetails = false;
                //let dataNoVis = data.slice(noVis[0]).reduce( (accumulator, currentValue, currentIndex, array) => accumulator + currentValue );
                for (let i = 0; i < noVis.length; i++) {
                    if (data[noVis[i]]) {
                        hasDetails = true;
                        break;
                    }
                }

                if (hasDetails) $(row).children("td.details").addClass('details-control');
                //}
            },
            "columnDefs": [{
                "targets": 'details',
                "orderable": false,
                "data": null,
                "defaultContent": '',
            },
            {
                "targets": '_all',
                "type": 'html'
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
                "width": 'calc(20px + 10ex)',
                //"type": "date" //dit zorgt ervoor dat onvolledige data (-00-00) niet juist gesorteerd worden??
            },
            // {
            //     "targets": 'collection',
            //     "data": 'collection'
            // },
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
                "loadingRecords": "Initializing...",
                "processing": '<div class="spinner"></div>',
                "search": 'filter "' + tableid + '":',
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
                if (database) {
                    //$('table#' + tableid + ' thead tr').clone(true).appendTo('#' + tableid + ' thead' );
                    this.api().columns().every(function () {
                        let column = this;
                        let th = column.header();
                        //let headerText = th.innerText;
                        //if (sheetNames.includes(column.header().innerText)) {
                        if (th.classList.contains("details-control")) {
                            $("table.mainsheet thead tr:eq(1) th").eq(column.index()).empty();
                        }
                        else if (th.classList.contains("linkedinfo")) {
                            $("table.mainsheet thead tr:eq(1) th").eq(column.index()).empty();
                            linkedSheetType.forEach(function (value, index, array) {
                                $('<div class="nowrap"><input type="checkbox" id="' + th.innerText + value + '" name="' + th.innerText + '" value="' + value + '" class="headercheckbox" />' +
                                    '<label for="' + th.innerText + value + '">' + value + '</label></div>')
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
                        }
                        else if (th.classList.contains("date")) {
                            $('<input type="search" id="' + th.innerText + '" name="' + th.innerText + '" class="headersearch" />')
                                .appendTo($("table.mainsheet thead tr:eq(1) th").eq(column.index()).empty())
                                .on('input', function () {
                                    if (column.search() !== this.value) {
                                        column
                                            .search(this.value)
                                            .draw();
                                    }
                                });
                        }
                        else {
                            let input = $('<input type="search" list="' + th.innerText + '-list" id="' + th.innerText + '-input" name="' + th.innerText + '" class="headersearch" />'
                            )//+ '<datalist id="' + th.innerText + '-list"></datalist>')
                                //.appendTo($(column.footer()).empty())
                                .appendTo($("table.mainsheet thead tr:eq(1) th").eq(column.index()).empty())
                                .on('change search', function () {
                                    if (column.search() !== this.value) {
                                        column
                                            .search(this.value)
                                            .draw('page');
                                    }
                                });

                            let ARR = column.data().map(function (value, index) {
                                return value.replace(/<\/?[^>]+(>|$)/g, "");
                            }).unique().toArray();
                            //let ARR = column.nodes().toJQuery().map(function (val, i) { return $(val).text() });
                            //console.log(ARR);
                            const delims = /([:\r\n]+)/g
                            ARR = ARR.join(delimiter).replace(delims, ";").split(delimiter);
                            ARR.forEach((o, i, a) => a[i] = a[i].trim());
                            let SET = new Set(ARR);
                            ARR = [...SET].sort();

                            //OPTION 1: HTML5 datalists
                            // ////column.data().unique().sort().each(function (d, j) {
                            // let datalist = $('<datalist id="' + th.innerText + '-list"></datalist>').insertAfter($(input));
                            // ARR.forEach(function (val) {
                            //     datalist.append('<option value="' + val + '" />')
                            // });
                            //OPTION 2: jQuery UI autocomplete
                            //$(function () {
                            $(input).on("click change", function () {
                                $(input).autocomplete({
                                    minLength: 0, //in combination with on("focus") makes that all the options are shown when click on input
                                    autoFocus: true,
                                    source: ARR,
                                    select: function (event, ui) {
                                        if (column.search() !== ui.item.value) {
                                            column
                                                .search(ui.item.value)
                                                .draw('page');
                                        }
                                    }
                                });
                            });
                        }
                        //}
                    });
                }
            }
        });

        // dTable.processing(true);

        // setTimeout(function () {
        //     dTable.processing(false);
        // }, 2000);

        // $(document).on("processing.dt", function (e, settings, processing) {
        //     if (processing) {
        //         $.blockUI(
        //             {
        //                 message: "Please Wait..!",
        //             });
        //     } else {
        //         $.unblockUI();
        //     }
        // });

        // $(document).on("processing.dt", function (e, settings, processing) {
        //     if (processing) {
        //         console.log("event trigger: processing true");
        //         // dTable.processing(true);
        //         // setTimeout(function () {
        //         //     dTable.processing(false);
        //         // }, 2000);
        //     }
        //     else {
        //         console.log("event trigger: processing false");
        //         //dTable.processing(false);
        //     }
        // });

        /////NEW: link +sheet as a dropdown////////////

        //Add event listener for opening and closing details
        $(table).find('tbody').on('click', 'td.details-control', function () {
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
            if (detailsTable != "") detailsTable = '<table class="detailsTable">' + details + '</table>';

            let childDiv = document.createElement('div');
            childDiv.classList.add("childdiv");
            let childFragment = new DocumentFragment;

            let domParser = new DOMParser();
            let detailsString = [
                '<table class="detailInfo">', details, '</table>'
            ].join('\n');
            let detailsDOM = domParser.parseFromString(detailsString, 'text/html');

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                tr.addClass('shown');
                if (!tr.hasClass('loaded')) {
                    if (database) {
                        transform(xml, xslTable, { id: tr.attr("id") }).then(function (linkedsheet) {
                            tr.addClass('loaded');

                            childFragment.appendChild(detailsDOM.querySelector("table.detailInfo"));
                            childFragment.appendChild(linkedsheet);
                            childDiv.appendChild(childFragment);

                            //linkedsheet.appendChild(detailsDOM.querySelector("table.detailInfo"));
                            row.child(childDiv, 'child').show();

                            makeDataTable(tr.next('tr').find('table.linkedsheet').attr("id"));
                        }, function (error) {
                            console.error("transform(xslTable) transform error!", error);
                        })
                    }
                    else {
                        childFragment.appendChild(detailsDOM.querySelector("table.detailInfo"));
                        childDiv.appendChild(childFragment);
                        row.child(childDiv, 'child').show();
                    }
                }
                else {
                    row.child.show(); //data is already present, just show it
                }
            }
        });

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

// jQuery.fn.dataTable.Api.register('processing()', function (show) {
//     return this.iterator('table', function (ctx) {
//         ctx.oApi._fnProcessingDisplay(ctx, show);
//     });
// });