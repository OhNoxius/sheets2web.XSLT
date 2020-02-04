var xslLinkedSheet;

function linkSheet(table, tableid) {
    $('table#' + tableid + ' tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        var sessions = '';
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            if (!tr.hasClass('loaded')) {
                //document.querySelector("div#dummy").textContent = '';
                loadDocRE('xsl/linkedsheet.xsl').then(function (xslDoc) {
                    xslLinkedSheet = xslDoc;

                    transformRE(xml, xslTable, { id: tr.attr("id") }).then(function (versions) {
                        //console.log({versions});                    
                        //sessions = document.querySelector("div#dummy").innerHTML;
                        tr.addClass('loaded');
                        row.child(versions, 'child').show();
                        //makeSessionsDataTable(tr.next('tr').find('table.sessions'));
                    }, function (error) {
                        console.error("transformRE (sortAZ_sessions.xsl) transform error!", error);
                    })
                })
            }
            else row.child.show();

            tr.addClass('shown');
        }
    });
}