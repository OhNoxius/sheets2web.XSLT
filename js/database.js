var targetElement;// = document.querySelector("section div#results");
var sheet;
var tables, navs;
var xml, xslHeader, xslMenu, xslTable, xslFilters;
var inputValues;
var isEdge = (window.navigator.userAgent.indexOf("Edge") > -1);

function detectEdge() {
    return (window.navigator.userAgent.indexOf("Edge") > -1)
}

function transformTable(sheet, inputField) { //Deze functie is misschien overbodig? gewoon direct transformRE aanschrijven?
    return new Promise(function (resolve) {
        var any = false;
        transformRE(xml, xslTable, { sheet: sheet, input: inputField, edge: isEdge }, targetElement).then(function (response) {
            any = makeDataTable(sheet);
            resolve([any, sheet]);
        })
    }, function (error) {
        reject(Error(error));
    });
}

function transformSearch(inputfield) {
    targetElement.textContent = '';
    for (var i = 0; i < navs.length; i++) {
        //transformRE(xml, xslTable, { sheet: navs[i].id, input: inputField }, targetElement).then(function (response) { OPPASSEN, zou nice zijn om direct te gebruiken, maar de for loop loopt door terwijl de promise bezig is
        transformTable(navs[i].id, inputfield).then(function (response) {
            //console.log(response);
            if (!response[0]) document.querySelector("div#" + response[1] + "_wrapper").style.display = "none";
            else document.querySelector("div#" + response[1] + "_wrapper").style.display = "block";
        })
    }
}

document.addEventListener('DOMContentLoaded', function () {

    targetElement = document.querySelector("section div#results");
    console.log("Edge? ", isEdge);

    //LOAD XML, this is the first action where every other action should wait for
    loadDocRE(datafile, xml).then(function (xmlDoc) {

        var promiseTable = loadDocRE('xsl/database.xsl');
        var promiseHeader = loadDocRE('xsl/sheet-header.xsl');
        var promiseFilters = loadDocRE('xsl/sheet-filters.xsl');
        //var promiseMenu = loadDocRE('xsl/sheet-menu.xsl');

        Promise.all([promiseHeader, promiseTable, promiseFilters]).then(function (xslDocs) {

            xml = xmlDoc;
            xslHeader = xslDocs[0];
            xslTable = xslDocs[1];
            xslFilters = xslDocs[2]
            //xslMenu = xslDocs[2];

            //XSL HEADER
            transformRE(xml, xslHeader, { title: headerTitle, edit: editLink}, document.querySelector("header div#heading"));
            lastUpdated(datafile, "activity");

            //XSL FILTERS //gebeurt nu in JS!
            // if (isDatabase) {
            //     transformRE(xml, xslFilters, {}, document.querySelector("header div#filters")).then(function (response) {

            //         //Object.entries(keys).sort((a, b) => b[0].localeCompare(a[0]));
            //         // for (let [key, value] of Object.entries(object1)) {
            //         //     console.log(`${key}: ${value}`);
            //         //   }
            //         Object.keys(keys).forEach(function (keyName) {
            //             var fragment = document.createDocumentFragment();

            //             keys[keyName].forEach(function (keyValue, index) {
            //                 var opt = document.createElement('option');
            //                 //opt.innerHTML = keyValue;
            //                 opt.value = keyValue;
            //                 fragment.appendChild(opt);
            //             });

            //             document.querySelector("header datalist#" + keyName + "-list").appendChild(fragment);
            //         });
            //     });
            // }

            //EXTRA for database version:

            transformRE(xml, xslTable, { edge: isEdge, types: linkedSheetType.join() }, targetElement).then(function (response) {
                any = makeDataTable(document.querySelector("table.mainsheet").getAttribute("id"));
                //resolve([any, sheet]);
                // document.querySelector("a.btn#search").addEventListener('click', function () {
                //     inputValues = document.querySelector("input.searchfield").value;//.toUpperCase()
                //     targetElement.textContent = '';

                //     transformRE(xml, xslTable, { edge: isEdge, input: inputValues }, targetElement).then(function (response) {
                //         any = makeDataTable(document.querySelector("table").getAttribute("id"));
                //     }, false);
                // }, false);
            })

            //NOT NECESSARY for database version?

            // transformRE(xml, xslMenu, {}, document.querySelector("nav div#menu")).then(function (response) {

            //     //ADD EVENT LISTENERS to menu buttons
            //     navs = document.getElementsByClassName("nav");
            //     for (var i = 0; i < navs.length; i++) {
            //         navs[i].addEventListener('click', function () {
            //             targetElement.textContent = '';
            //             sheet = this.id;
            //             transformTable(this.id, '');
            //         }, false);
            //     }
            //     //alternatieve (betere?) methode
            //     /* document.addEventListener('click', function(event) {
            //         if (event.target.matches('a.nav')) {
            //             console.log("`event.target` is", event.target);
            //             targetElement.textContent = '';
            //             transformTable(event.target.getAttribute("summary"), '');
            //         }
            //     }, false); */

            //     //event listener click op inputfield
            //     document.getElementById("search").addEventListener('click', function () {
            //         transformSearch(document.getElementById("searchinput").value);
            //     }, false);
            //     //event listener ENTER
            //     document.getElementById("searchinput").addEventListener('keypress', function (e) {
            //         if (e.charCode === 13) transformSearch(document.getElementById("searchinput").value);
            //     });
            // }, function (error) {
            //     console.error("sheet-menu.xsl", error);
            // })

            // //GET REFRESH URL
            // var url = window.location.href;
            // if (url.indexOf("#") != -1) {
            //     sheet = url.substring(url.indexOf("#~") + 2);
            //     transformTable(sheet, '');
            // }

            //XSL TABLE
            //xslTable(sheet, '');


        })
    }, function (error) {
        console.error("data XML could not be loaded:", error);
    })
})