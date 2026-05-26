/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 85.71428571428571, "KoPercent": 14.285714285714286};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8333333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "DELETE_PET"], "isController": false}, {"data": [1.0, 500, 1500, "GET_ORDER_BY_ID"], "isController": false}, {"data": [1.0, 500, 1500, "LOGIN_USER"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE_USER"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE_USER"], "isController": false}, {"data": [0.5, 500, 1500, "ADD_PET"], "isController": false}, {"data": [1.0, 500, 1500, "FIND_PET_STATUS"], "isController": false}, {"data": [1.0, 500, 1500, "PLACE_ORDER"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE_USER"], "isController": false}, {"data": [1.0, 500, 1500, "VERIFY_UPDATED_USER"], "isController": false}, {"data": [1.0, 500, 1500, "GET INVENTORY"], "isController": false}, {"data": [0.0, 500, 1500, "VERIFY_DELETED_USER"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE_EXISTING_PET"], "isController": false}, {"data": [1.0, 500, 1500, "GET_USER"], "isController": false}, {"data": [1.0, 500, 1500, "VERIFY_UPDATED_PET"], "isController": false}, {"data": [1.0, 500, 1500, "LOGOUT_USER"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "VERIFY_ORDER_DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE_ORDER"], "isController": false}, {"data": [0.0, 500, 1500, "VERIFY_PET_DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "GET_PET_ID"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21, 3, 14.285714285714286, 294.9523809523809, 1, 1306, 253.0, 277.8, 1203.3999999999985, 1306.0, 3.3589251439539347, 1.4395393474088292, 0.7913092810300704], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["DELETE_PET", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.4763779527559056, 0.8189283956692913], "isController": false}, {"data": ["GET_ORDER_BY_ID", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.7477368551587302, 0.7672991071428571], "isController": false}, {"data": ["LOGIN_USER", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.8604866600790513, 0.8762042984189723], "isController": false}, {"data": ["CREATE_USER", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.490133217131474, 1.5835097111553784], "isController": false}, {"data": ["DELETE_USER", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.4591879826254825, 0.8182010135135135], "isController": false}, {"data": ["ADD_PET", 1, 0, 0.0, 1306.0, 1306, 1306, 1306.0, 1306.0, 1306.0, 1306.0, 0.7656967840735069, 0.35368611217457885, 0.3267670846094946], "isController": false}, {"data": ["FIND_PET_STATUS", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.2270562267657992, 0.7188080855018587], "isController": false}, {"data": ["PLACE_ORDER", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.6682942708333333, 1.3205788352272727], "isController": false}, {"data": ["UPDATE_USER", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.49609375, 1.62109375], "isController": false}, {"data": ["VERIFY_UPDATED_USER", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.9296875, 0.76171875], "isController": false}, {"data": ["GET INVENTORY", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 3.0944088855421685, 0.7726217369477911], "isController": false}, {"data": ["VERIFY_DELETED_USER", 1, 1, 100.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.459316037735849, 0.7186025943396226], "isController": false}, {"data": ["UPDATE_EXISTING_PET", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.8354668674698795, 1.690355170682731], "isController": false}, {"data": ["GET_USER", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.8000816231343282, 0.7105585354477612], "isController": false}, {"data": ["VERIFY_UPDATED_PET", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.6322544642857142, 0.6661551339285714], "isController": false}, {"data": ["LOGOUT_USER", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.4421329941860466, 0.7305293120155039], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 337.890625, 0.0], "isController": false}, {"data": ["VERIFY_ORDER_DELETE", 1, 1, 100.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.4685428503787878, 0.732421875], "isController": false}, {"data": ["DELETE_ORDER", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.4842199900793651, 0.8525545634920635], "isController": false}, {"data": ["VERIFY_PET_DELETE", 1, 1, 100.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.54296875, 0.74609375], "isController": false}, {"data": ["GET_PET_ID", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.84765625, 0.74609375], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 3, 100.0, 14.285714285714286], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21, 3, "404/Not Found", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["VERIFY_DELETED_USER", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["VERIFY_ORDER_DELETE", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["VERIFY_PET_DELETE", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
