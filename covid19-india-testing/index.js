var statenames = ["Ladakh", "Arunachal Pradesh", "Assam", "Chandigarh", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Punjab", "Rajasthan", "Sikkim", "Tripura", "Uttarakhand", "Telangana", "Bihar", "Kerala", "Madhya Pradesh", "Andaman and Nicobar Islands", "Gujarat", "Odisha", "Dadra and Nagar Haveli and Daman and Diu", "Jammu and Kashmir", "Chhattisgarh", "Goa", "Haryana", "Himachal Pradesh", "Jharkhand", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Andhra Pradesh", "Puducherry", "Maharashtra", "Delhi"];

color = d3.scaleQuantize([0, 10], d3.schemeBlues[5])
altcolor = d3.scaleQuantize([0, 10], d3.schemeOranges[5])

class CovidTestingData {
    constructor(updatedon, statename, testPositivity) {
        this.updatedon = updatedon;
        this.statename = statename;
        this.testPositivity = testPositivity;
        this.id = 0;

        var date_split = updatedon.split('/')
        var date = parseInt(date_split[0])
        var month = parseInt(date_split[1])
        var year = parseInt(date_split[2])
        this.epoch = Date.UTC(year, month, date)
    }
}

var idToPathSelectionMap = function(id) {
    var paths = d3.select("#map").select("svg").select("g")._groups[0][0].children
    const idStr = String(id)

    for (let index = 0; index < paths.length; index++) {
        const element = paths[index];

        if (id == 0 && element.id === undefined && element.geometry != null) {
            return d3.select(element)
        }

        if (idStr === element.id) {
            return d3.select(element)
        }
    }

    console.log(typeof id)

    return null
}

var idxmap = function(d) {
    var index = parseInt(d.id)
    if (d.id === undefined && d.geometry != null) {
        index = 0;
    }
    return index
}

var testdataMapCore = function(testingData, statename) {
    var testData = testingData[statename]

    if (testData === null || testData === undefined) {
        console.log("statename:" + statename)
        return "Not available"
    }

    return testData
}

var testdataMap = function(testingData, d) {
    var idx = idxmap(d)
    var statename = statenames[idx]

    return testdataMapCore(testingData, statename)
}

var testpositivityrate = function(testData) {
    if (testData === null || testData === undefined || !(testData instanceof CovidTestingData) || testData.testPositivity === "") {
        return NaN
    }

    return parseFloat(testData.testPositivity.replace('%', ''))
}

var statecolor = function(testingData, d, colorFn) {
    var testData = testdataMap(testingData, d)
    var rate = testpositivityrate(testData)

    if (rate === NaN) {
        return "grey"
    } else {
        return colorFn(rate)
    }
}

var statecolorAlt = function(testingData, statename, colorFn) {
    var testData = testdataMapCore(testingData, statename)
    var rate = testpositivityrate(testData)

    if (rate === NaN) {
        return "grey"
    } else {
        return colorFn(rate)
    }
}

// https://api.covid19india.org/state_test_data.json

d3.json("./data/data.json").then(function(data) {
    var states_tested_data = data.states_tested_data
    var testingData = fetchRecentTestingData(states_tested_data)

    d3.json("./india-states.json").then(function(data) {

        var testingDataArray = []

        for (const key in testingData) {
            if (testingData.hasOwnProperty(key)) {
                var dataElement = testingData[key]
                dataElement.id = statenames.indexOf(dataElement.statename)
                testingDataArray.push(dataElement)
            }
        }
    
        testingDataArray.sort((a, b) => {
            var aTP = parseFloat(a.testPositivity.replace('%', ''))
            var bTP = parseFloat(b.testPositivity.replace('%', ''))
            return bTP - aTP
        })

        let width = 700;
        let height = 700;
        var states = data;
        let features = topojson.feature(states, states.objects.Admin2);
    
        var projection = d3.geoMercator().fitSize([width, height], features)
        var path = d3.geoPath(projection)
    
        // Create SVG
        let svg = d3.select("#map")
                    .append("svg")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", `0 0 ${width} ${height}`)
        
        let g = svg.append("g");
        
        console.log(states.result);
            
        // Bind TopoJSON data
        g.selectAll("path")
            .data(features.features) // Bind TopoJSON data elements
            .enter().append("path")
            .attr("d", path)
            .attr("id", d => { return d.id; })
            .style("fill", d => statecolor(testingData, d, color))
            .style("stroke", "skyblue")
            .on("mouseenter", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .append("title").text(d => {
                var testData = testdataMap(testingData, d)
                return statenames[idxmap(d)] + 
                        "\nTest Positivity: " + testData.testPositivity + 
                        "\nUpdated: " + testData.updatedon
            })
    
        // Create Event Handlers for mouse enter/out events
        function handleMouseOver(d, i) {
            d3.select(this).style("fill", d => statecolor(testingData, d, altcolor));
        }
    
        function handleMouseOut(d, i) {
            d3.select(this).style("fill", statecolor(testingData, d, color));
        }

        var rows = d3.select('#statesrows')
                        .selectAll('tr')
                        .data(testingDataArray).enter()
                        .append('tr')

        rows.selectAll('td')
            .data(function (d) {
                    return [{ 'value': d.statename, 'name': 'statename', 'id': d.id },
                            { 'value': d.testPositivity, 'name': 'testPositivity', 'id': d.id },
                            { 'value': d.updatedon, 'name': 'updatedon', 'id': d.id }]
                })
            .enter()
            .append('td')
            .text(d => d.value)
            .on("mouseenter", tablerowMouseOver)
            .on("mouseout", tablerowMouseOut);
        
        function tablerowMouseOver(d, i) {
            var statemapId = d.id
            var pathSelection = idToPathSelectionMap(statemapId)
            if (pathSelection === null) {
                return
            }

            pathSelection.style("fill", d => statecolor(testingData, d, altcolor));
        }
    
        function tablerowMouseOut(d, i) {
            var statemapId = d.id
            var pathSelection = idToPathSelectionMap(statemapId)
            if (pathSelection === null) {
                return
            }

            pathSelection.style("fill", d => statecolor(testingData, d, color));
        }
    })
})

function fetchRecentTestingData(states_tested_data) {

    var recentTestData = []

    for (let index = 0; index < states_tested_data.length; index += 1) {
        const state_testing_data = states_tested_data[index];
        var statename = state_testing_data.state
        var date = state_testing_data.updatedon
        var testPositivity = state_testing_data.testpositivityrate

        var testingData = new CovidTestingData(date, statename, testPositivity)

        var existingTestingData = recentTestData[statename]
        var shouldReplace = false
        if (existingTestingData != null && existingTestingData != undefined  && existingTestingData instanceof CovidTestingData) {
            var existingEpoch = existingTestingData.epoch
            var epoch = testingData.epoch

            if (epoch > existingEpoch && testingData.testPositivity != "") {
                shouldReplace = true
            }
        } else {
            shouldReplace = true
        }

        if (shouldReplace) {
            recentTestData[statename] = testingData
        }
    }

    return recentTestData
}
