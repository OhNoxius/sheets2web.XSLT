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
                transformRE(xml, xslSessions, { thisFilter: tr.attr("summary"), category: tableid.substring(6, tableid.length) }).then(function (sessionresponse) {
                    //console.log({sessionresponse});
                    //stupidBelgians(belgians, document.querySelectorAll("div#dummy table tr td span.artist"));
                    stupidBelgians(belgians, sessionresponse.querySelectorAll("table tr td span.artist"));
                    //sessions = document.querySelector("div#dummy").innerHTML;
                    tr.addClass('loaded');
                    row.child(sessionresponse, 'child').show();
                    makeSessionsDataTable(tr.next('tr').find('table.sessions'));
                    //stupidBelgians(belgians, "table.sessions tr td span.artist");
                }, function (error) {
                    console.error("transformRE (sortAZ_sessions.xsl) transform error!", error);
                })
            }
            else row.child.show();

            tr.addClass('shown');
        }
    });
}