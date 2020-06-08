var statenames = ["Ladakh", "Arunachal Pradesh", "Assam", "Chandigarh", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Punjab", "Rajasthan", "Sikkim", "Tripura", "Uttarakhand", "Telangana", "Bihar", "Kerala", "Madhya Pradesh", "Andaman and Nicobar Islands", "Gujarat", "Odisha", "Dadra and Nagar Haveli and Daman and Diu", "Jammu and Kashmir", "Chhattisgarh", "Goa", "Haryana", "Himachal Pradesh", "Jharkhand", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Andhra Pradesh", "Puducherry", "Maharashtra", "Delhi"];

color = d3.scaleQuantize([0, 10], d3.schemeBlues[5])
altcolor = d3.scaleQuantize([0, 10], d3.schemeOranges[5])
alt2color = d3.scaleQuantize([0, 10], d3.schemeReds[5])

class CovidTestingData {
    constructor(updatedon, statename, testPositivity) {
        this.updatedon = updatedon;
        this.statename = statename;
        this.testPositivity = testPositivity;
        this.id = 0;

        var date_split = updatedon.split('/')
        var date = parseInt(date_split[0])
        var month = parseInt(date_split[1]) - 1
        var year = parseInt(date_split[2])
        this.epoch = Date.UTC(year, month, date)
        this.date = new Date(year, month, date)
    }

    testPositivityNum() {
        if (this.testPositivity === "") {
            return 0.0
        }
    
        return parseFloat(this.testPositivity.replace('%', ''))
    }
}

class StatewiseTestingData {
    constructor(all, recent, all_flat) {
        this.all = all
        this.recent = recent
        this.all_flat = all_flat
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
    console.log(id)

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

var colorToTexture = {}

var stateFill = function(svg, testingData, d, colorFn, texturize = true) {
    var color = statecolor(testingData, d, colorFn)

    if (!texturize) {
        return color
    }

    var texture = colorToTexture[color]

    if (texture === null || texture == undefined) {
        texture = textures.circles().radius(0.5).size(2).background(color)
        svg.call(texture)
        colorToTexture[color] = texture
    }

    return texture.url()
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

// Create Time series curves
let width = 700;
let height = 700;
var margin = {top: 1, right: 5, bottom: 30, left: 20}
var timeWidth = width - margin.left - margin.right
var timeHeight = height/4 - margin.top - margin.bottom
let timePlotSvg = d3.select("#timelines")
                    .append("svg")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", `0 0 ${timeWidth + margin.left + margin.right} ${timeHeight + margin.top + margin.bottom}`)

let timeG = timePlotSvg.append("g")
                       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
let latestIndiaTestingData = null

d3.json("./data/data.json").then(function(data) {
    var states_tested_data = data.states_tested_data
    var statewiseTestingData = fetchRecentTestingData(states_tested_data)
    var testingData = statewiseTestingData.recent

    // Add X axis
    var x = d3.scaleTime()
                .domain(d3.extent(statewiseTestingData.all_flat, function(d) { return d.date; }))
                .range([ 0, timeWidth ]);
    timeG.append("g")
            .attr("transform", "translate(0," + (timeHeight) + ")")
            .call(d3.axisBottom(x))

    // Add Y axis
    var y = d3.scaleLinear()
            .domain([-0.5, d3.max(statewiseTestingData.all_flat, function(d) { 
                let tp = d.testPositivityNum()
                return (tp === NaN) ? 0 : tp
            })])
            .range([ timeHeight, 0 ])
    timeG.append("g").call(d3.axisLeft(y))

    const inlineHt = 50
    const inlineWd = 100
    var inlineX = d3.scaleTime()
                    .domain(d3.extent(statewiseTestingData.all_flat, function(d) { return d.date; }))
                    .range([ 0, inlineWd ])
    var inlineY = d3.scaleLinear()
                    .domain([-0.5, d3.max(statewiseTestingData.all_flat, function(d) { 
                        let tp = d.testPositivityNum()
                        return (tp === NaN) ? 0 : tp
                    })])
                    .range([ inlineHt, 0 ])

    console.log(d3.extent(statewiseTestingData.all_flat, function(d) { return d.date; }))

    d3.csv("./data/covid-19-positive-rate-india.csv").then(function(data) {
        plotIndiaAvg(data, x, y, inlineX, inlineY, statewiseTestingData)
    })

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

        // Create Map's SVG
        let svg = d3.select("#map")
                    .append("svg")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", `0 0 ${width} ${height}`)
        
        // let filter = svg.append("filter")
        //                 .attr("id", "noise")
        //                 .attr("x", "0%").attr("y", "0%")
        //                 .attr("width", "100%").attr("height", "100%")
        // filter.append("feTurbulence")
        //         .attr("baseFrequency", "0.6")
        
        // filter.append("feDisplacementMap")
        //         .attr("in2", "turbulence")
        //         .attr("in", "SourceGraphic")
        //         .attr("scale", "50")
        //         .attr("xChannelSelector", "R")
        //         .attr("yChannelSelector", "G")

        
        let g = svg.append("g") // keep this first
        let labelG = svg.append("g")
        
        // Bind TopoJSON data
        g.selectAll("path")
            .data(features.features) // Bind TopoJSON data elements
            .enter().append("path")
            .attr("d", path)
            .attr("id", d => { return d.id; })
            .style("fill", d => stateFill(svg, testingData, d, color))
            .style("stroke", "steelblue")
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
            highlight(svg, d3.select(this), d, labelG, timeG, statewiseTestingData, x, y)
        }
    
        function handleMouseOut(d, i) {
            deHighlight(svg, d3.select(this), d, labelG, timeG, statewiseTestingData)
        }

        var rows = d3.select('#statesrows')
                        .selectAll('tr')
                        .data(testingDataArray).enter()
                        .append('tr')

        rows.selectAll('td')
            .data(function (d) {
                    return [{ 'value': d.statename, 'name': 'statename', 'id': d.id },
                            { 'value': d.testPositivity, 'name': 'testPositivity', 'id': d.id },
                            { 'value': d.updatedon, 'name': 'updatedon', 'id': d.id },
                            { 'value': "", 'name': 'trend', 'id': d.id}]
                })
            .enter()
            .append('td')
            .attr("id", d => d.id)
            .attr("class", d => d.name)
            .text(d => d.value)
            .on("mouseenter", tablerowMouseOver)
            .on("mouseout", tablerowMouseOut)

        rows.select(".trend").each(function() {
            const thisSel = d3.select(this)
            const idx = parseInt(thisSel.attr("id"))

            let inlineSVG = thisSel.append("svg")
                            .attr("preserveAspectRatio", "xMinYMin meet")
                            .attr("viewBox", `0 0 ${inlineWd} ${inlineHt}`)
                            .on("mouseover", tablerowMouseOver)
                            .on("mouseout", tablerowMouseOut)
            let inlineG = inlineSVG.append("g")

            const statename = statenames[idx]
            const stateTestPositivityData = statewiseTestingData.all[statename]
            const latestPosData = testingData[statename]
            const testposRate = latestPosData.testPositivityNum()
            const statecol = alt2color(testposRate)
            plotTimeSeries(inlineG, "", statecol, stateTestPositivityData, inlineX, inlineY, "inlinetimeplot")
        })
        
        
        function tablerowMouseOver(d, i) {
            var statemapId = d.id
            var pathSelection = idToPathSelectionMap(statemapId)
            if (pathSelection === null) {
                return
            }

            highlight(svg, pathSelection, d, labelG, timeG, statewiseTestingData, x, y)
        }
    
        function tablerowMouseOut(d, i) {
            var statemapId = d.id
            var pathSelection = idToPathSelectionMap(statemapId)
            if (pathSelection === null) {
                return
            }

            deHighlight(svg, pathSelection, d, labelG, timeG, statewiseTestingData)
        }
    })
})

function plotIndiaAvg(data, x, y, inlineX, inlineY, statewiseTestingData) {
    var latestTPR = 0.0
    var latestUpdatedOnDate = null
    var latestUpdatedOn = ""
    var latestTestingData = null
    var dailyTestData = []

    const oldestPlottedDate = new Date("Apr 01 2020")
    var plotableTestingData = []

    function padDate(num) {
        return ("000" + num).slice(-2)
    }

    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const testpositivityrate = parseFloat(element.TPR).toFixed(2)
        const updatedonDate = new Date(element.Date)
        const updatedon = `${padDate(updatedonDate.getDate())}/${padDate(updatedonDate.getMonth() + 1)}/${updatedonDate.getFullYear()}`
        var testingData = new CovidTestingData(updatedon, "India", testpositivityrate + "%")

        dailyTestData.push(testingData)
        
        if (latestUpdatedOnDate === null || (latestUpdatedOnDate.getTime() < updatedonDate.getTime())) {
            latestUpdatedOnDate = updatedonDate
            latestUpdatedOn = updatedon
            latestTPR = testpositivityrate
            latestTestingData = testingData
        }

        if (updatedonDate.getTime() >= oldestPlottedDate.getTime()) {
            plotableTestingData.push(testingData)
        }
    }

    latestIndiaTestingData = latestTestingData

    d3.select("#ind-tpr").text(latestTPR + "%")
    d3.select("#ind-updatedon").text(latestUpdatedOn)

    const inlineHt = 50
    const inlineWd = 100

    let inlineSVG = d3.select("#ind-trend").append("svg")
    inlineSVG.attr("preserveAspectRatio", "xMinYMin meet")
             .attr("viewBox", `0 0 ${inlineWd} ${inlineHt}`)
    let inlineG = inlineSVG.append("g")

    const indiacol = color(latestTPR)
    const indiacol2 = color(latestTPR)
    
    plotTimeSeries(inlineG, "", indiacol2, plotableTestingData, inlineX, inlineY, "indiainlinetimeplot")

    for (let index = 0; index < statenames.length; index++) {
        const statename = statenames[index]
        const stateTestPositivityData = statewiseTestingData.all[statename]
        plotTimeSeries(timeG, "", "#1F1F1F", stateTestPositivityData, x, y, "graytimeplot")
    }

    plotTimeSeries(timeG, "", indiacol, plotableTestingData, x, y, "indiabluetimeplot")
}

function highlight(svg, statePathSelection, d, labelG, timeG, statewiseTestingData, x, y) {
    clearHighlight(statePathSelection, d, labelG, timeG, statewiseTestingData)

    const recentTestingData = statewiseTestingData.recent
    statePathSelection.style("fill", d => stateFill(svg, recentTestingData, d, altcolor))
    var idx = idxmap(d)
    var statename = statenames[idx]
    const stateTestPositivityData = statewiseTestingData.all[statename]
    const latestPosData = recentTestingData[statename]
    const testposRate = latestPosData.testPositivityNum()
    const col = altcolor(testposRate)
    plotTimeSeries(timeG, statename, col, stateTestPositivityData, x, y)

    attachTopRightMapLabels(labelG, statename, latestPosData)
}

function attachTopRightMapLabels(labelG, statename, latestPosData) {
    const firstLabelY = 70
    const labelDy = 25
    labelG.append("text")
        .attr("class", "statelabel")
        .attr("x", 350).attr("y", firstLabelY)
        .style("fill", "silver").style("font-size", "18px")
        .text("Test Positivity")

    labelG.append("text")
        .attr("class", "statelabel")
        .attr("x", 350).attr("y", firstLabelY + labelDy)
        .style("font-size", "20px").style("fill", "silver")
        .text(statename + ": " + latestPosData.testPositivity)

    labelG.append("text")
        .attr("class", "statelabel")
        .attr("x", 350).attr("y", firstLabelY + (2 * labelDy))
        .style("font-size", "15px").style("fill", "silver")
        .text("Updated on: " + latestPosData.updatedon)

    if (latestIndiaTestingData != null) {
        labelG.append("text")
            .attr("class", "statelabel")
            .attr("x", 350).attr("y", firstLabelY + (3.5 * labelDy))
            .style("font-size", "20px").style("fill", "silver")
            .text("India: " + latestIndiaTestingData.testPositivity)

        labelG.append("text")
            .attr("class", "statelabel")
            .attr("x", 350).attr("y", firstLabelY + (4.5 * labelDy))
            .style("font-size", "15px").style("fill", "silver")
            .text("Updated on: " + latestIndiaTestingData.updatedon)
    }
}

function clearHighlight(statePathSelection, d, labelG, timeG, statewiseTestingData) {
    labelG.selectAll(".statelabel").remove()
}

function deHighlight(svg, statePathSelection, d, labelG, timeG, statewiseTestingData) {
    statePathSelection.style("fill", d => stateFill(svg, statewiseTestingData.recent, d, color))
    var idx = idxmap(d)
    var statename = statenames[idx]
    clearTimeSeries(timeG, statename)
}

function plotTimeSeries(timeG, statename, dataColor, stateTestPositivityData, x, y, pathclass = "statetimeplot") {
    timeG.append("path")
        .datum(stateTestPositivityData)
        .attr("class", pathclass)
        .attr("fill", "none")
        .attr("stroke", dataColor)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
                    .x(function(d) { return x(d.date) })
                    .y(function(d) {
                        let tp = d.testPositivityNum()
                        let rate = (tp === NaN) ? 0.0 : tp
                        return y(rate) 
                    })
            )
        .append("title").text(d => d.statename)
}

function clearTimeSeries(timeG, statename) {
    timeG.selectAll(".statetimeplot").remove()
}

function fetchRecentTestingData(states_tested_data) {

    var recentStatewiseTestingData = []
    var statewiseTestingData = []
    var statewiseTestingDataFlat = null

    for (let index = 0; index < states_tested_data.length; index += 1) {
        const state_testing_data = states_tested_data[index];
        var statename = state_testing_data.state
        var date = state_testing_data.updatedon
        var testPositivity = state_testing_data.testpositivityrate
        var positive = state_testing_data.positive
        var totalTested = state_testing_data.totaltested

        if (testPositivity === "" && (positive === "" || totalTested === "")) {
            continue
        }

        if (testPositivity === "" && (positive != "" && totalTested != "")) {
            const posInt = parseInt(positive)
            const totalInt = parseInt(totalTested)

            if (posInt != NaN && totalInt != NaN) {
                const testPositivityNum = (posInt * 1.0)/(totalInt * 1.0)
                if (testPositivityNum != NaN) {
                    testPositivity = `${(testPositivityNum*100).toFixed(2)}%`
                }
            }
        }

        var testingData = new CovidTestingData(date, statename, testPositivity)

        if (statewiseTestingDataFlat === null) {
            statewiseTestingDataFlat = [testingData]
        } else {
            statewiseTestingDataFlat.push(testingData)
        }

        var existingTestingData = recentStatewiseTestingData[statename]
        var stateTestingData = statewiseTestingData[statename]

        if (stateTestingData === null || stateTestingData === undefined || !Array.isArray(stateTestingData)) {
            stateTestingData = [testingData]
            statewiseTestingData[statename] = stateTestingData
        } else if (Array.isArray(stateTestingData)) {
            stateTestingData.push(testingData)
        }

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
            recentStatewiseTestingData[statename] = testingData
        }
    }

    let statewiseData = new StatewiseTestingData(statewiseTestingData, recentStatewiseTestingData, statewiseTestingDataFlat)
    return statewiseData
}