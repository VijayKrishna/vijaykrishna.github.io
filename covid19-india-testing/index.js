var statenames = ["Ladakh", "Arunachal Pradesh", "Assam", "Chandigarh", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Punjab", "Rajasthan", "Sikkim", "Tripura", "Uttarakhand", "Telangana", "Bihar", "Kerala", "Madhya Pradesh", "Andaman and Nicobar Islands", "Gujarat", "Odisha", "Dadra and Nagar Haveli and Daman and Diu", "Jammu and Kashmir", "Chhattisgarh", "Goa", "Haryana", "Himachal Pradesh", "Jharkhand", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Andhra Pradesh", "Puducherry", "Maharashtra", "Delhi"];

color = d3.scaleQuantize([0, 10], d3.schemeBlues[5])
altcolor = d3.scaleQuantize([0, 10], d3.schemeOranges[5])

class CovidTestingData {
    constructor(updatedon, statename, testPositivity) {
        this.updatedon = updatedon;
        this.statename = statename;
        this.testPositivity = testPositivity;

        var date_split = updatedon.split('/')
        var date = parseInt(date_split[0])
        var month = parseInt(date_split[1])
        var year = parseInt(date_split[2])
        this.epoch = Date.UTC(year, month, date)
    }
}


var idxmap = function(d) {
    var index = parseInt(d.id)
    if (d.id === undefined && d.geometry != null) {
        index = 0;
    }
    return index
}

var testdataMap = function(testingData, d) {
    var idx = idxmap(d)
    var statename = statenames[idx]
    var testData = testingData[statename]

    if (testData === null || testData === undefined) {
        console.log("idx:" + idx)
        console.log("statename:" + statename)
        return "Not available"
    }


    return testData
}

var testpositivityrate = function(testData) {
    if (testData === null || testData === undefined || !(testData instanceof CovidTestingData) || testData.testPositivity === "") {
        return NaN
    }

    return parseFloat(testData.testPositivity.replace('%', ''))
}

var statecolor = function(testingData, d, colorFn) {
    var testData = testdataMap(testingData, d)
    console.log(testData)
    var rate = testpositivityrate(testData)

    if (rate === NaN) {
        return "grey"
    } else {
        return colorFn(rate)
    }
}

// https://api.covid19india.org/state_test_data.json

d3.json("./covid-testing-data-snapshot-5-24.json").then(function(data) {
    var states_tested_data = data.states_tested_data
    var testingData = fetchRecentTestingData(states_tested_data)

    d3.json("./india-states.json").then(function(data) {

        let width = 600;
        let height = 600;
        var states = data;
        let features = topojson.feature(states, states.objects.Admin2);
    
        var projection = d3.geoMercator().fitSize([width, height], features);
        var path = d3.geoPath(projection);
    
        // Create SVG
        let svg = d3.select("#map")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
        
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
    });
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
