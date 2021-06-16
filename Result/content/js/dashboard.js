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

    var data = {"OkPercent": 99.7034526583351, "KoPercent": 0.2965473416649015};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7330736412539418, 1000, 3000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb"], "isController": false}, {"data": [0.8793103448275862, 1000, 3000, "Click Decision Tree links-3"], "isController": false}, {"data": [0.7586206896551724, 1000, 3000, "Click Decision Tree links-2"], "isController": false}, {"data": [0.8793103448275862, 1000, 3000, "Click Decision Tree links-5"], "isController": false}, {"data": [0.9827586206896551, 1000, 3000, "Click Decision Tree links-4"], "isController": false}, {"data": [1.0, 1000, 3000, "Click Decision Tree links-7"], "isController": false}, {"data": [0.9629629629629629, 1000, 3000, "Click Decision Tree links-6"], "isController": false}, {"data": [0.0, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-3"], "isController": false}, {"data": [0.5, 1000, 3000, "Launch KB_Worklist_\/content-reference\/main"], "isController": true}, {"data": [1.0, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-4"], "isController": false}, {"data": [1.0, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-1"], "isController": false}, {"data": [1.0, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-2"], "isController": false}, {"data": [0.89, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-0"], "isController": false}, {"data": [0.9655172413793104, 1000, 3000, "Click Decision Tree links-1"], "isController": false}, {"data": [0.8620689655172413, 1000, 3000, "Click Decision Tree links-0"], "isController": false}, {"data": [0.56, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/config\/all"], "isController": false}, {"data": [1.0, 1000, 3000, "Launch KB_Worklist_cdi\/kb"], "isController": true}, {"data": [1.0, 1000, 3000, "GetJWTToken"], "isController": false}, {"data": [1.0, 1000, 3000, "04_Launch CDSAssistant From Worksheet-49"], "isController": false}, {"data": [1.0, 1000, 3000, "03_OpenAccountInCDEOne-39"], "isController": false}, {"data": [0.14, 1000, 3000, "04_Launch CDSAssistant From Worksheet-48"], "isController": false}, {"data": [1.0, 1000, 3000, "LaunchKB_Worklist_GetJWTToken"], "isController": true}, {"data": [1.0, 1000, 3000, "03_OpenAccountInCDEOne-38"], "isController": false}, {"data": [0.5, 1000, 3000, "04_Launch CDSAssistant From Worksheet-47"], "isController": false}, {"data": [0.0, 1000, 3000, "03_OpenAccountInCDEOne-37"], "isController": false}, {"data": [0.0, 1000, 3000, "Launch KB From Worklist"], "isController": true}, {"data": [0.0, 1000, 3000, "03_OpenAccountInCDEOne-36"], "isController": false}, {"data": [1.0, 1000, 3000, "03_OpenAccountInCDEOne-42"], "isController": false}, {"data": [1.0, 1000, 3000, "03_OpenAccountInCDEOne-41"], "isController": false}, {"data": [0.95, 1000, 3000, "LoginCDE-01"], "isController": false}, {"data": [1.0, 1000, 3000, "03_OpenAccountInCDEOne-44"], "isController": false}, {"data": [0.5, 1000, 3000, "LoginCDE-00"], "isController": false}, {"data": [1.0, 1000, 3000, "03_OpenAccountInCDEOne-43"], "isController": false}, {"data": [1.0, 1000, 3000, "02_SearchAccount In CDEOne-33"], "isController": false}, {"data": [0.45, 1000, 3000, "02_SearchAccount In CDEOne-34"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-05"], "isController": false}, {"data": [0.98, 1000, 3000, "02_SearchAccount In CDEOne-35"], "isController": false}, {"data": [1.0, 1000, 3000, "03_OpenAccountInCDEOne-40"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-04"], "isController": false}, {"data": [1.0, 1000, 3000, "launchCDE-85"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-07"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-06"], "isController": false}, {"data": [1.0, 1000, 3000, "launchCDE-87"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-09"], "isController": false}, {"data": [1.0, 1000, 3000, "Launch KB_Worklist_content-reference\/js\/app.bundle-efa2931ae92cf78c661a.js"], "isController": true}, {"data": [0.0, 1000, 3000, "Search Account in CDEOne"], "isController": true}, {"data": [0.57, 1000, 3000, "02_SearchAccount In CDEOne-31"], "isController": false}, {"data": [1.0, 1000, 3000, "launchCDE-86"], "isController": false}, {"data": [1.0, 1000, 3000, "02_SearchAccount In CDEOne-32"], "isController": false}, {"data": [0.24880382775119617, 1000, 3000, "Click fragmentUris links \/ PDF links"], "isController": false}, {"data": [0.58, 1000, 3000, "Launch KB_Worklist_content-reference\/config\/all"], "isController": true}, {"data": [0.89, 1000, 3000, "04_Launch CDSAssistant From Worksheet-59"], "isController": false}, {"data": [1.0, 1000, 3000, "04_Launch CDSAssistant From Worksheet-58"], "isController": false}, {"data": [1.0, 1000, 3000, "04_Launch CDSAssistant From Worksheet-57"], "isController": false}, {"data": [1.0, 1000, 3000, "04_Launch CDSAssistant From Worksheet-56"], "isController": false}, {"data": [0.99, 1000, 3000, "03_OpenAccountInCDEOne-46"], "isController": false}, {"data": [1.0, 1000, 3000, "04_Launch CDSAssistant From Worksheet-55"], "isController": false}, {"data": [1.0, 1000, 3000, "03_OpenAccountInCDEOne-45"], "isController": false}, {"data": [1.0, 1000, 3000, "04_Launch CDSAssistant From Worksheet-54"], "isController": false}, {"data": [1.0, 1000, 3000, "04_Launch CDSAssistant From Worksheet-53"], "isController": false}, {"data": [1.0, 1000, 3000, "04_Launch CDSAssistant From Worksheet-52"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-10"], "isController": false}, {"data": [0.82, 1000, 3000, "04_Launch CDSAssistant From Worksheet-51"], "isController": false}, {"data": [0.37, 1000, 3000, "04_Launch CDSAssistant From Worksheet-50"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-12"], "isController": false}, {"data": [1.0, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb-3"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-11"], "isController": false}, {"data": [1.0, 1000, 3000, "Launch KB_Worklist_\/content-reference\/index.html"], "isController": true}, {"data": [1.0, 1000, 3000, "LoginCDE-14"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-13"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-16"], "isController": false}, {"data": [1.0, 1000, 3000, "LoginCDE-15"], "isController": false}, {"data": [0.85, 1000, 3000, "LoginCDE-17"], "isController": false}, {"data": [0.0, 1000, 3000, "Click Decision Tree links"], "isController": false}, {"data": [1.0, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb-1"], "isController": false}, {"data": [1.0, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb-2"], "isController": false}, {"data": [0.0, 1000, 3000, "Launch KB_Worklist_\/content-reference\/files\/master.json?genId=f0f3a59f-ec9c-4d31-a067-25a424d0c0a2"], "isController": true}, {"data": [1.0, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb-0"], "isController": false}, {"data": [0.0, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search"], "isController": false}, {"data": [0.0, 1000, 3000, "Open Account in CDEOne\/Launch Worksheet"], "isController": true}, {"data": [0.9940191387559809, 1000, 3000, "Click fragmentUris links \/ PDF links-1"], "isController": false}, {"data": [0.6160287081339713, 1000, 3000, "Click fragmentUris links \/ PDF links-2"], "isController": false}, {"data": [0.992822966507177, 1000, 3000, "Click fragmentUris links \/ PDF links-0"], "isController": false}, {"data": [0.7834928229665071, 1000, 3000, "Click fragmentUris links \/ PDF links-3"], "isController": false}, {"data": [0.0, 1000, 3000, "Launch KB_Worklist_content-reference\/js\/vendors~app.bundle-38e0215af1ed0303d2b0.js"], "isController": true}, {"data": [0.0, 1000, 3000, "LoginCDE"], "isController": true}, {"data": [1.0, 1000, 3000, "04_Launch CDSAssistant From Worksheet-60"], "isController": false}, {"data": [0.0, 1000, 3000, "Launch CDS Assistant From Worksheet"], "isController": true}, {"data": [0.42, 1000, 3000, "05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/reference-search\/searchMultiple"], "isController": false}, {"data": [1.0, 1000, 3000, "Launch KB_Worklist_content-reference\/css\/reference.css?eb5b1e350ce6efef8d20e25ffa52d730f54f866172547367dd39c8fce6c7a1e8"], "isController": true}, {"data": [0.5, 1000, 3000, "Launch CDE"], "isController": true}, {"data": [0.5, 1000, 3000, "Launch CDE-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4721, 14, 0.2965473416649015, 1370.4469392077908, 199, 54802, 440.0, 3076.0, 4203.799999999977, 14347.53999999999, 0.8781233271294909, 100.06583708894118, 2.6831192909660992], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb", 50, 0, 0.0, 1108.02, 1036, 1283, 1103.0, 1140.9, 1164.9, 1283.0, 0.011120677364906567, 0.4797638319819116, 0.07236042312731686], "isController": false}, {"data": ["Click Decision Tree links-3", 29, 0, 0.0, 870.5862068965519, 423, 1819, 760.0, 1410.0, 1808.5, 1819.0, 0.0067528721245863, 0.29079623806517174, 0.01143617632063475], "isController": false}, {"data": ["Click Decision Tree links-2", 29, 0, 0.0, 1077.448275862069, 740, 1758, 989.0, 1433.0, 1689.5, 1758.0, 0.006752004239327352, 0.3812585949812586, 0.01151087576172503], "isController": false}, {"data": ["Click Decision Tree links-5", 29, 0, 0.0, 821.7586206896553, 414, 2268, 720.0, 1399.0, 1886.5, 2268.0, 0.006754092572524398, 0.1111309330627504, 0.011484186296621578], "isController": false}, {"data": ["Click Decision Tree links-4", 29, 0, 0.0, 603.551724137931, 413, 1131, 600.0, 800.0, 970.5, 1131.0, 0.006754353705007561, 0.009078437290600478, 0.011410936524330695], "isController": false}, {"data": ["Click Decision Tree links-7", 11, 0, 0.0, 497.2727272727273, 371, 774, 430.0, 762.0, 774.0, 774.0, 0.002575183054546357, 0.015078903901425737, 0.004403462430186202], "isController": false}, {"data": ["Click Decision Tree links-6", 27, 0, 0.0, 687.1851851851852, 473, 1259, 670.0, 874.9999999999999, 1169.3999999999996, 1259.0, 0.006289911820095476, 0.016990587904080243, 0.0106804286103162], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-3", 50, 0, 0.0, 13071.04, 8869, 38550, 12632.0, 15802.599999999999, 16992.499999999996, 38550.0, 0.011101566231167025, 19.15653744730364, 0.018502971764387463], "isController": false}, {"data": ["Launch KB_Worklist_\/content-reference\/main", 50, 0, 0.0, 1133.28, 1060, 1466, 1104.0, 1241.6, 1423.6999999999998, 1466.0, 0.01112577240674934, 0.03287904776460981, 0.04154411222733514], "isController": true}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-4", 50, 0, 0.0, 260.23999999999995, 208, 797, 223.5, 410.8, 418.45, 797.0, 0.011132817631533126, 0.20311564843318952, 0.018468083311216136], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-1", 50, 0, 0.0, 216.14, 199, 239, 218.0, 227.7, 229.89999999999998, 239.0, 0.011122931079204612, 0.02535246204967145, 0.018299611317515636], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-2", 50, 0, 0.0, 329.5, 280, 482, 310.0, 401.0, 438.3499999999999, 482.0, 0.011122277878100724, 0.05497185841251283, 0.018939371031293197], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search-0", 50, 0, 0.0, 935.9600000000002, 856, 1420, 889.0, 1081.7, 1160.0, 1420.0, 0.011121236378987714, 0.028939107866651038, 0.025938328949156597], "isController": false}, {"data": ["Click Decision Tree links-1", 29, 0, 0.0, 623.6206896551726, 478, 1342, 540.0, 864.0, 1234.5, 1342.0, 0.006754430790142631, 0.02968255718324398, 0.011431082577458182], "isController": false}, {"data": ["Click Decision Tree links-0", 29, 0, 0.0, 894.4827586206897, 457, 1643, 744.0, 1424.0, 1638.5, 1643.0, 0.006753236954550948, 0.028491582876073212, 0.011442252066548725], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/config\/all", 50, 0, 0.0, 1356.34, 557, 2243, 1265.0, 1972.1, 2178.6499999999996, 2243.0, 0.011128043046831479, 0.013464497397484572, 0.018547100652370394], "isController": false}, {"data": ["Launch KB_Worklist_cdi\/kb", 50, 0, 0.0, 744.9399999999999, 209, 903, 871.0, 889.9, 898.9, 903.0, 0.01112629727063027, 0.01014840004957878, 0.01789551914524224], "isController": true}, {"data": ["GetJWTToken", 50, 0, 0.0, 288.8999999999999, 229, 409, 279.0, 349.9, 397.04999999999995, 409.0, 0.011122498077476206, 0.010776875139170257, 0.01765044860927621], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-49", 50, 0, 0.0, 223.71999999999997, 212, 237, 225.0, 231.0, 233.0, 237.0, 0.011122928604813247, 0.04814142536770733, 0.017857514283508766], "isController": false}, {"data": ["03_OpenAccountInCDEOne-39", 50, 0, 0.0, 252.08000000000007, 221, 919, 235.0, 249.9, 301.79999999999995, 919.0, 0.011122851899226963, 0.009591287331071686, 0.01790083977531839], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-48", 50, 0, 0.0, 3197.9800000000005, 2871, 4802, 3130.0, 3375.8, 4092.949999999995, 4802.0, 0.011115806921990825, 8.591141432747477, 0.1686476331445795], "isController": false}, {"data": ["LaunchKB_Worklist_GetJWTToken", 50, 0, 0.0, 294.13999999999993, 229, 504, 280.0, 378.0, 397.59999999999997, 504.0, 0.011130056941371312, 0.010783112197652003, 0.01766244387668787], "isController": true}, {"data": ["03_OpenAccountInCDEOne-38", 50, 0, 0.0, 242.42, 214, 876, 229.0, 238.0, 244.84999999999994, 876.0, 0.011122901386580886, 0.0059416279867770955, 0.017890057210643285], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-47", 50, 0, 0.0, 1117.48, 1045, 1390, 1108.0, 1197.1, 1271.2499999999998, 1390.0, 0.011120729306324493, 0.004105112966592439, 0.01867935000671692], "isController": false}, {"data": ["03_OpenAccountInCDEOne-37", 50, 0, 0.0, 7008.34, 3975, 41697, 4343.5, 10736.399999999994, 37640.59999999997, 41697.0, 0.011115241040671112, 9.376204701085603, 0.23008766048740775], "isController": false}, {"data": ["Launch KB From Worklist", 50, 0, 0.0, 33642.53999999999, 26085, 39923, 34203.5, 37897.4, 39049.5, 39923.0, 0.011049743292363832, 45.48950700320299, 0.19203094205746662], "isController": true}, {"data": ["03_OpenAccountInCDEOne-36", 50, 0, 0.0, 11218.619999999999, 6065, 54802, 6723.0, 35785.799999999996, 46316.299999999996, 54802.0, 0.011107995935362129, 9.370394694310175, 0.23661116107549396], "isController": false}, {"data": ["03_OpenAccountInCDEOne-42", 50, 0, 0.0, 278.94, 234, 400, 270.5, 331.0, 384.8999999999999, 400.0, 0.011122854373584198, 0.037684969244751516, 0.017879119432538667], "isController": false}, {"data": ["03_OpenAccountInCDEOne-41", 50, 0, 0.0, 277.8999999999999, 250, 343, 273.5, 304.2, 316.49999999999994, 343.0, 0.011122842001809019, 0.020545105738185205, 0.017792202342737474], "isController": false}, {"data": ["LoginCDE-01", 10, 0, 0.0, 758.6, 622, 1118, 686.5, 1097.1000000000001, 1118.0, 1118.0, 4.721435316336166, 27.219720107412655, 10.706223441926346], "isController": false}, {"data": ["03_OpenAccountInCDEOne-44", 50, 0, 0.0, 332.3199999999998, 285, 458, 328.0, 368.4, 389.4, 458.0, 0.011122582200887627, 0.07323525217896946, 0.01792212952291463], "isController": false}, {"data": ["LoginCDE-00", 10, 0, 0.0, 2339.9, 2006, 2742, 2290.5, 2734.9, 2742.0, 2742.0, 2.735229759299781, 21.40504265248906, 15.588672729759299], "isController": false}, {"data": ["03_OpenAccountInCDEOne-43", 50, 0, 0.0, 227.08000000000004, 213, 238, 228.0, 235.0, 237.45, 238.0, 0.011122913758488173, 0.008505118625875234, 0.017846628227730536], "isController": false}, {"data": ["02_SearchAccount In CDEOne-33", 50, 0, 0.0, 227.92, 216, 251, 227.0, 237.0, 239.35, 251.0, 0.011122893963449726, 0.0058764508146741225, 0.017292624208800744], "isController": false}, {"data": ["02_SearchAccount In CDEOne-34", 50, 0, 0.0, 2136.16, 1743, 7319, 1824.5, 3329.0999999999985, 3998.8999999999996, 7319.0, 0.011118919063164355, 1.4568055533163287, 0.10734534556488556], "isController": false}, {"data": ["LoginCDE-05", 10, 0, 0.0, 224.2, 213, 264, 220.5, 260.40000000000003, 264.0, 264.0, 4.492362982929021, 19.443508535489666, 5.150423966756514], "isController": false}, {"data": ["02_SearchAccount In CDEOne-35", 50, 0, 0.0, 546.5799999999999, 363, 5513, 420.0, 540.9, 716.4499999999997, 5513.0, 0.01112220365555692, 0.005973839854058893, 0.017226381833704372], "isController": false}, {"data": ["03_OpenAccountInCDEOne-40", 50, 0, 0.0, 247.09999999999994, 221, 891, 233.0, 243.9, 251.89999999999998, 891.0, 0.011122903860960142, 0.007125610285927591, 0.017781439082413822], "isController": false}, {"data": ["LoginCDE-04", 10, 0, 0.0, 564.1, 380, 890, 520.0, 874.6, 890.0, 890.0, 5.291005291005291, 28.271226025132275, 5.993716931216931], "isController": false}, {"data": ["launchCDE-85", 10, 0, 0.0, 234.8, 220, 247, 235.5, 246.9, 247.0, 247.0, 8.071025020177562, 6.825691081517352, 3.09757112590799], "isController": false}, {"data": ["LoginCDE-07", 10, 0, 0.0, 228.20000000000002, 219, 248, 226.0, 246.9, 248.0, 248.0, 3.0998140111593306, 1.6558576797892126, 3.638648868567886], "isController": false}, {"data": ["LoginCDE-06", 10, 0, 0.0, 236.9, 209, 327, 226.5, 321.3, 327.0, 327.0, 4.297378599054577, 2.5482112161581436, 5.040187204555221], "isController": false}, {"data": ["launchCDE-87", 10, 0, 0.0, 222.6, 210, 230, 224.5, 230.0, 230.0, 230.0, 43.47826086956522, 94.11090353260869, 21.696671195652172], "isController": false}, {"data": ["LoginCDE-09", 10, 0, 0.0, 266.70000000000005, 207, 378, 235.0, 376.2, 378.0, 378.0, 4.522840343735866, 2.2172518091361377, 5.273702510176391], "isController": false}, {"data": ["Launch KB_Worklist_content-reference\/js\/app.bundle-efa2931ae92cf78c661a.js", 50, 0, 0.0, 261.68, 204, 445, 221.0, 422.6, 426.9, 445.0, 0.011127832534132402, 0.20303230341626682, 0.019296574444198147], "isController": true}, {"data": ["Search Account in CDEOne", 50, 0, 0.0, 4376.5599999999995, 3527, 10390, 3825.0, 6226.9, 9043.25, 10390.0, 0.011111375314924154, 1.5056013380484825, 0.17769519741913864], "isController": true}, {"data": ["02_SearchAccount In CDEOne-31", 50, 0, 0.0, 1240.64, 963, 6039, 1027.5, 1158.0, 3373.7999999999793, 6039.0, 0.011118347920235193, 0.004104233900243069, 0.018707923307192616], "isController": false}, {"data": ["launchCDE-86", 10, 0, 0.0, 220.20000000000002, 208, 230, 224.5, 230.0, 230.0, 230.0, 8.130081300813009, 6.875635162601626, 3.159933943089431], "isController": false}, {"data": ["02_SearchAccount In CDEOne-32", 50, 0, 0.0, 225.26, 210, 243, 227.0, 235.8, 239.7, 243.0, 0.01112041024527844, 0.03387164019045259, 0.01725618347631586], "isController": false}, {"data": ["Click fragmentUris links \/ PDF links", 418, 0, 0.0, 2969.9545454545455, 1000, 14691, 3003.5, 3632.2, 3832.2999999999997, 6762.800000000001, 0.09265198805011009, 22.618001616311712, 0.6299173660774251], "isController": false}, {"data": ["Launch KB_Worklist_content-reference\/config\/all", 50, 0, 0.0, 1351.88, 594, 2370, 1242.0, 2022.6999999999998, 2195.45, 2370.0, 0.011129427675859426, 0.013466172744521316, 0.019158048988513095], "isController": true}, {"data": ["04_Launch CDSAssistant From Worksheet-59", 50, 0, 0.0, 964.3399999999997, 875, 1078, 958.0, 1028.0, 1058.6, 1078.0, 0.011120919762341497, 0.03733675045834871, 0.01824525898509152], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-58", 50, 0, 0.0, 300.7199999999999, 233, 406, 295.5, 365.09999999999997, 379.44999999999993, 406.0, 0.011122772720376609, 0.046354155312169514, 0.018248298994367872], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-57", 50, 0, 0.0, 285.4, 237, 370, 282.0, 329.0, 359.6499999999999, 370.0, 0.011122656428483877, 0.051563071078891, 0.018248108202981363], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-56", 50, 0, 0.0, 288.63999999999993, 227, 478, 283.0, 329.59999999999997, 342.44999999999993, 478.0, 0.011122747977217053, 0.05148116108197198, 0.018248258400121727], "isController": false}, {"data": ["03_OpenAccountInCDEOne-46", 50, 0, 0.0, 284.34, 232, 1065, 252.5, 280.8, 571.7999999999973, 1065.0, 0.011122822207025975, 0.005431065530774402, 0.01790079198943243], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-55", 50, 0, 0.0, 303.99999999999994, 242, 406, 300.5, 366.49999999999994, 382.8999999999999, 406.0, 0.011122767771735891, 0.0408892060546119, 0.018248290875504197], "isController": false}, {"data": ["03_OpenAccountInCDEOne-45", 50, 0, 0.0, 224.43999999999994, 210, 241, 225.0, 232.8, 238.24999999999997, 241.0, 0.011122938502385315, 0.005431122315617829, 0.0179118413969076], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-54", 50, 0, 0.0, 321.60000000000014, 258, 463, 308.5, 415.09999999999997, 432.49999999999994, 463.0, 0.011122438697010755, 0.05418756549726087, 0.01824775098728327], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-53", 50, 0, 0.0, 294.31999999999994, 241, 402, 291.0, 338.7, 357.5999999999999, 402.0, 0.011122738079984054, 0.05167793559923529, 0.018248242162473838], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-52", 50, 0, 0.0, 309.9999999999999, 240, 459, 309.0, 373.4, 417.6999999999997, 459.0, 0.011122703439807266, 0.06422731239614175, 0.018248185330933794], "isController": false}, {"data": ["LoginCDE-10", 10, 0, 0.0, 225.1, 209, 251, 221.5, 249.8, 251.0, 251.0, 4.4424700133274095, 4.715786039537983, 5.2754331408262995], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-51", 50, 0, 0.0, 1016.7800000000001, 897, 1936, 981.5, 1132.0, 1177.75, 1936.0, 0.011120870292619012, 0.07433020284078183, 0.018245177823828066], "isController": false}, {"data": ["04_Launch CDSAssistant From Worksheet-50", 50, 0, 0.0, 2909.8599999999997, 2655, 3331, 2905.0, 3196.6, 3259.8, 3331.0, 0.011116642258225815, 2.833050659122394, 0.11321822471780958], "isController": false}, {"data": ["LoginCDE-12", 10, 0, 0.0, 227.60000000000002, 210, 255, 229.5, 253.20000000000002, 255.0, 255.0, 4.434589800443459, 4.677106430155211, 5.274736696230599], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb-3", 50, 0, 0.0, 224.98, 209, 252, 222.0, 231.9, 250.0, 252.0, 0.011122846950515788, 0.1741529347242379, 0.01816152353638906], "isController": false}, {"data": ["LoginCDE-11", 10, 0, 0.0, 230.6, 209, 284, 223.0, 281.5, 284.0, 284.0, 4.426737494466578, 7.362044876051351, 5.2351358455068615], "isController": false}, {"data": ["Launch KB_Worklist_\/content-reference\/index.html", 50, 0, 0.0, 215.46, 203, 243, 217.0, 221.9, 229.45, 243.0, 0.011127914261646197, 0.01206248518596414, 0.01911197540230192], "isController": true}, {"data": ["LoginCDE-14", 10, 0, 0.0, 216.2, 209, 230, 213.0, 229.9, 230.0, 230.0, 4.526935264825712, 2.2236801154368493, 5.3359481100045265], "isController": false}, {"data": ["LoginCDE-13", 10, 0, 0.0, 219.9, 209, 229, 221.0, 228.9, 229.0, 229.0, 3.101736972704715, 1.8392330955334986, 3.637877054900744], "isController": false}, {"data": ["LoginCDE-16", 10, 0, 0.0, 221.5, 209, 256, 215.5, 253.8, 256.0, 256.0, 4.476275738585497, 13.677120635631155, 5.263121083258729], "isController": false}, {"data": ["LoginCDE-15", 10, 0, 0.0, 237.70000000000005, 222, 260, 235.0, 259.9, 260.0, 260.0, 4.424778761061947, 2.7827710176991154, 5.228498340707965], "isController": false}, {"data": ["LoginCDE-17", 10, 0, 0.0, 1026.4, 774, 1457, 958.0, 1452.7, 1457.0, 1457.0, 2.3849272597185784, 46.142054093131414, 2.7552431135225377], "isController": false}, {"data": ["Click Decision Tree links", 29, 0, 0.0, 5737.793103448274, 4363, 7604, 5515.0, 7418.0, 7569.5, 7604.0, 0.006747299218988483, 0.881710187255585, 0.08369572982918166], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb-1", 50, 0, 0.0, 437.9, 410, 621, 431.0, 451.9, 464.59999999999997, 621.0, 0.011122409007015792, 0.28719493804150836, 0.018139085001676148], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb-2", 50, 0, 0.0, 219.4, 206, 238, 219.0, 228.0, 229.45, 238.0, 0.011122928604813247, 0.008353058688575573, 0.018183381332477905], "isController": false}, {"data": ["Launch KB_Worklist_\/content-reference\/files\/master.json?genId=f0f3a59f-ec9c-4d31-a067-25a424d0c0a2", 50, 0, 0.0, 16683.440000000002, 10691, 22836, 16807.0, 20653.899999999998, 21691.499999999993, 22836.0, 0.011089277555745798, 26.180233326370193, 0.01947879251906247], "isController": true}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/nextgen\/ng\/cdi\/kb-0", 50, 0, 0.0, 224.46000000000004, 206, 274, 223.5, 234.7, 237.45, 274.0, 0.011122906335340499, 0.010145307145710963, 0.017890065170220508], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/search", 50, 0, 0.0, 14816.659999999998, 10699, 40902, 14439.5, 17446.8, 18845.599999999995, 40902.0, 0.011096564747678544, 19.459373302225593, 0.09993518531207644], "isController": false}, {"data": ["Open Account in CDEOne\/Launch Worksheet", 50, 0, 0.0, 20593.58, 12319, 99412, 13383.5, 58729.19999999998, 79285.29999999992, 99412.0, 0.011091730161275976, 18.886052938568117, 0.6262408179884792], "isController": true}, {"data": ["Click fragmentUris links \/ PDF links-1", 418, 0, 0.0, 371.5430622009568, 297, 1406, 328.0, 450.20000000000005, 571.4499999999996, 1104.06, 0.09269692385923461, 1.1048222788740383, 0.15458980093501923], "isController": false}, {"data": ["Click fragmentUris links \/ PDF links-2", 418, 0, 0.0, 1362.5885167464116, 241, 7777, 1417.5, 1861.2, 2011.0, 3164.76, 0.09268845525376126, 13.12943796391348, 0.15439464578097897], "isController": false}, {"data": ["Click fragmentUris links \/ PDF links-0", 418, 0, 0.0, 295.3851674641151, 202, 1157, 220.0, 857.5000000000001, 887.05, 1067.8000000000002, 0.09271960349725922, 0.4329153219921139, 0.16676583514410134], "isController": false}, {"data": ["Click fragmentUris links \/ PDF links-3", 418, 0, 0.0, 932.9114832535885, 236, 5296, 850.0, 1240.3000000000002, 1395.4499999999996, 2775.9500000000007, 0.09265749224492258, 7.957315647403772, 0.15443355536495745], "isController": false}, {"data": ["Launch KB_Worklist_content-reference\/js\/vendors~app.bundle-38e0215af1ed0303d2b0.js", 50, 0, 0.0, 12590.199999999999, 8313, 16252, 12629.0, 15125.7, 15830.85, 16252.0, 0.01110284072841741, 19.159228937272726, 0.019339977546170055], "isController": true}, {"data": ["LoginCDE", 10, 0, 0.0, 7223.599999999999, 6300, 8578, 7060.5, 8542.8, 8578.0, 8578.0, 1.0931351114997814, 57.6899920064495, 25.341732824114562], "isController": true}, {"data": ["04_Launch CDSAssistant From Worksheet-60", 50, 0, 0.0, 305.28, 233, 500, 294.0, 382.8, 431.45, 500.0, 0.011122542613241387, 0.030738189250062564, 0.01824792147484915], "isController": false}, {"data": ["Launch CDS Assistant From Worksheet", 50, 0, 0.0, 11840.120000000003, 11068, 13522, 11729.0, 12739.0, 13111.499999999998, 13522.0, 0.011094213391425594, 11.955416440437164, 0.4997704780596398], "isController": true}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/reference-search\/searchMultiple", 50, 14, 28.0, 1044.5, 211, 2473, 1168.0, 1802.8999999999999, 2253.7, 2473.0, 0.011127827580988328, 0.03515198143488886, 0.04071980735226696], "isController": false}, {"data": ["Launch KB_Worklist_content-reference\/css\/reference.css?eb5b1e350ce6efef8d20e25ffa52d730f54f866172547367dd39c8fce6c7a1e8", 50, 0, 0.0, 367.52000000000015, 281, 680, 310.5, 551.2, 598.7999999999997, 680.0, 0.011127344670613907, 0.05499559704880564, 0.019784723087682362], "isController": true}, {"data": ["Launch CDE", 10, 0, 0.0, 1842.1000000000001, 1742, 2078, 1783.5, 2071.5, 2078.0, 2078.0, 3.6036036036036037, 18.45263231981982, 6.531531531531532], "isController": true}, {"data": ["Launch CDE-0", 10, 0, 0.0, 1164.5, 1066, 1394, 1099.5, 1389.5, 1394.0, 1394.0, 4.780114722753346, 6.045164615200765, 2.586116754302103], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 14, 100.0, 0.2965473416649015], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4721, 14, "400", 14, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["05_Launch KnowledgeBase From CDSAssistant-\/content-reference\/reference-search\/searchMultiple", 50, 14, "400", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
