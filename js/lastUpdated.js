function fetchHeader(url, wch) {
    return new Promise(function (resolve) {
        var req = new XMLHttpRequest();
        req.open("HEAD", url);
        req.send(null);
        req.onload = function () {
            resolve(this.getResponseHeader(wch));
        }
    });
}

/* function lastUpdated(datafile) {
    fetchHeader(datafile, 'Last-Modified').then(function (response) {
        return response;
    }, function (error) {
        console.error("fetchHeader failed!", error);
    })
} */

function lastUpdated(datafile, id) {
    fetchHeader(datafile, 'Last-Modified').then(function (response) {
        var date = new Date(response);
        var node = document.createElement("p");
        node.setAttribute("class", "details");
        var textnode = document.createTextNode(datafile +" last updated on " + date.toLocaleDateString("nl-BE"));
        node.appendChild(textnode);
        document.getElementById(id).appendChild(node);
    }, function (error) {
        console.error("fetchHeader GET failed!", error);
    })
}