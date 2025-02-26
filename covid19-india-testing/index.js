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
var indiaMap = null

let latestIndiaTestingData = null
let timeSeriesCanvases = null

d3.json("./data/data.json").then(function(data) {
    var states_tested_data = data.states_tested_data
    var statewiseTestingData = fetchRecentTestingData(states_tested_data)
    var testingData = statewiseTestingData.recent

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

    const bubbleplotModel = new BubblePlotCanvasModel(testingDataArray, statewiseTestingData, width, 0.75*height, yValueTotalTestsfn, yValuePosTestsfn, yValueTPRfn)
    const bubbleplotCanvas = new BubblePlotCanvas(bubbleplotModel, 
                                                    d3.select("#bubbleplot"), 
                                                    "COVID19 Testing: Positive vs. Total Tests",
                                                    "Total Test#", "Positive Test#")
    bubbleplotCanvas.appendG()
    bubbleplotCanvas.plot(alt2color)

    const timeSeriesCanvasModel = new TimeSeriesCanvasModel(statewiseTestingData, width, height/4, yValueTPRfn)
    const totalTestsTimeSeriesCanvasModel = new TimeSeriesCanvasModel(statewiseTestingData, width, height/4, yValueTotalTestsfn)
    const totalPosTestsTimeSeriesCanvasModel = new TimeSeriesCanvasModel(statewiseTestingData, width, height/4, yValuePosTestsfn)

    const tpTimeSeriesCanvas = new TimeSeriesCanvas(timeSeriesCanvasModel, d3.select("#timelines"), false, "Test Positivity Rates, over time")
    tpTimeSeriesCanvas.appendG()

    const ttTimeSeriesCanvas = new TimeSeriesCanvas(totalTestsTimeSeriesCanvasModel, d3.select("#total-tests-timelines"), false, "Total Tests, over time")
    ttTimeSeriesCanvas.appendG()

    const tptTimeSeriesCanvas = new TimeSeriesCanvas(totalPosTestsTimeSeriesCanvasModel, d3.select("#total-pos-tests-timelines"), false, "Total Positive Tests, over time")
    tptTimeSeriesCanvas.appendG()

    timeSeriesCanvases = [ tpTimeSeriesCanvas, ttTimeSeriesCanvas, tptTimeSeriesCanvas ]
    

    d3.csv("./data/covid-19-positive-rate-india.csv").then(function(data) {
        plotIndiaAvg(data, tpTimeSeriesCanvas, ttTimeSeriesCanvas, tptTimeSeriesCanvas, timeSeriesCanvasModel, statewiseTestingData)
    })

    d3.json("./india-states.json").then(function(data) {
        indiaMap = new IndiaMap("#map", 700, 700, data)

        let svg = indiaMap.svg
        let labelG = indiaMap.labelG

        indiaMap.drawMap(handleMouseOver)
                .style("fill", d => stateFill(svg, testingData, d, color))
    
        // Create Event Handlers for mouse enter/out events
        function handleMouseOver(d, i) {
            highlight(svg, d3.select(this), d, labelG, [tpTimeSeriesCanvas, ttTimeSeriesCanvas, tptTimeSeriesCanvas], statewiseTestingData)
        }

        for (let index = 0; index < testingDataArray.length; index++) {
            const element = testingDataArray[index];
            const statename = element.statename
            const stateTestPositivityData = statewiseTestingData.all[statename]
            const latestPosData = testingData[statename]

            const testPos = latestPosData.testPositivityNum()

            let container = "#miniplots"
            
            if (testPos <= 5.0 && testPos >= 2.0) {
                container = "#miniplots2"
            } else if (testPos < 2.0) {
                container = "#miniplots3"
            }

            appendMiniPlotContainer("miniplot" + index, timeSeriesCanvasModel, stateTestPositivityData, latestPosData, alt2color, false, container)
        }
    })
})

function plotIndiaAvg(data, tpTimeSeriesCanvas, ttTimeSeriesCanvas, tptTimeSeriesCanvas, timeSeriesCanvasModel, statewiseTestingData) {
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
        var testingData = new CovidTestingData(updatedon, "India", 0, 0, testpositivityrate + "%", ["https://ourworldindata.org/grapher/covid-19-positive-rate-bar?tab=chart&time=2020-03-13..&country=~IND"])

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

    const timeseriesCanvas = new TimeSeriesCanvas(timeSeriesCanvasModel, d3.select("#ind-trend"), true)
    timeseriesCanvas.appendG()
    const indiacol = color(latestTPR)

    appendMiniPlotContainer("indiaMiniPlot", timeSeriesCanvasModel, plotableTestingData, latestTestingData, color, true, "#india-miniplot")

    for (let index = 0; index < statenames.length; index++) {
        const statename = statenames[index]
        const stateTestPositivityData = statewiseTestingData.all[statename]
        plotTimeSeries(tpTimeSeriesCanvas, "#1F1F1F", stateTestPositivityData, "graytimeplot")
        plotTimeSeries(ttTimeSeriesCanvas, "#1F1F1F", stateTestPositivityData, "tt-graytimeplot")
        plotTimeSeries(tptTimeSeriesCanvas, "#1F1F1F", stateTestPositivityData, "tpt-graytimeplot")
    }

    plotTimeSeries(tpTimeSeriesCanvas, indiacol, plotableTestingData, "indiabluetimeplot")
}

function highlight(svg, statePathSelection, d, labelG, timeSeriesCanvases, statewiseTestingData) {
    labelG.selectAll(".statelabel").remove()
    deHighlight(svg, statePathSelection, d, timeSeriesCanvases, statewiseTestingData)

    const recentTestingData = statewiseTestingData.recent
    statePathSelection.style("fill", d => stateFill(svg, recentTestingData, d, altcolor))
    statePathSelection.classed("highlightedStatePath", true)

    var idx = idxmap(d)
    var statename = statenames[idx]
    const stateTestPositivityData = statewiseTestingData.all[statename]
    const latestPosData = recentTestingData[statename]

    for (let index = 0; index < timeSeriesCanvases.length; index++) {
        const canvas = timeSeriesCanvases[index]
        plotTimeSeries(canvas, altcolor, stateTestPositivityData, "statetimeplot")
    }

    attachTopRightMapLabels(labelG, statename, latestPosData)
}

function deHighlight(svg, statePathSelection, d, timeSeriesCanvases, statewiseTestingData) {
    hightedStatePaths = d3.selectAll(".highlightedStatePath")
    hightedStatePaths.style("fill", d => stateFill(svg, statewiseTestingData.recent, d, color))
    hightedStatePaths.classed("highlightedStatePath", false)

    // statePathSelection.style("fill", d => stateFill(svg, statewiseTestingData.recent, d, color))
    dehighlightTimeSeries(timeSeriesCanvases)
}

function dehighlightTimeSeries(timeSeriesCanvases) {
    for (let index = 0; index < timeSeriesCanvases.length; index++) {
        const canvas = timeSeriesCanvases[index]
        canvas.clearHighlightedTimeSeries()
    }
}

//#region DATA

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

        let sources = []
        if (state_testing_data.source1 != "" && state_testing_data.source1 != null && state_testing_data.source1 != undefined) {
            sources.push(state_testing_data.source1)
        }

        if (state_testing_data.source2 != "" && state_testing_data.source2 != null && state_testing_data.source2 != undefined) {
            sources.push(state_testing_data.source2)
        }

        var testingData = new CovidTestingData(date, statename, totalTested, positive, testPositivity, sources)

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

//#endregion DATA

function appendMiniPlotContainer(containerId, timeSeriesCanvasModel, plotableTestingData, latestTestingData, plotColFn, showLabels = false, miniplotsContainerId = "#miniplots") {
    const latestTPRNum = latestTestingData.testPositivityNum()
    const latestTPRStr = latestTestingData.testPositivity
    const latestUpdatedOn = latestTestingData.updatedon.replace("/2020", "")
    const title = latestTestingData.statename
    const sources = latestTestingData.sources
    const latestPositiveTests = latestTestingData.positiveTests
    const latestTotalTests = latestTestingData.totalTests
    const population = populations[title]

    const plotCol = plotColFn(latestTPRNum)
    let miniplotsContainer = d3.selectAll(miniplotsContainerId)

    let container = miniplotsContainer.append("div")
                        .attr("id", containerId)
                        .style("width", "145px")
                        .style("padding", "2px")
                        .style("border", "0.5px solid #333")
                        .style("border-radius", "5px")
                        .style("display", "inline-block")
                        .style("margin", "5px 5px")


    const titleDiv = container.append("div")
                            .style("overflow-x", "scroll")

    titleDiv.append("span")
        .text(title)
        .style("font-weight", "bold")
        .style("margin-right", "2px")

    const srcsDiv = container.append("div")
    srcsDiv.append("span")
            .text("Source(s): ")
            .style("font-size", "x-small")
            .style("margin-right", "2px")

    for (let index = 0; index < sources.length; index++) {
        const srcUrl = sources[index]
        srcsDiv.append("a")
                .attr("href", srcUrl)
                .attr("target", "_blank")
                .style("font-size", "x-small")
                .style("margin-right", "2px")
                .style("font-weight", "normal")
                .text("[" + (index + 1) + "]")
    }

    const updatedOnDiv = container.append("div")
                                .style("color", "dimgrey")
                                .style("font-size", "xx-small")
                                .style("text-align", "right")

    updatedOnDiv.append("span")
        .text("Updated on:")
        .style("margin-right", "2px")

    updatedOnDiv.append("span")
        .text(latestUpdatedOn)

    const tprDiv = container.append("div")
                    .style("text-align", "right")

    tprDiv.append("span")
        .text(showLabels ? "Test Positivity:" : "Test Pos.:")
        .style("font-weight", "bold")
        .style("font-size", "xx-small")
        .style("margin-right", "2px")

    tprDiv.append("span")
            .text(latestTPRStr)
            .style("font-weight", "bold")
            .style("font-size", "small")

    const timeseriesCanvas = new TimeSeriesCanvas(timeSeriesCanvasModel, container, true)
    timeseriesCanvas.appendG()
    plotTimeSeries(timeseriesCanvas, plotCol, plotableTestingData, "indiainlinetimeplot")

    const posCountDiv = container.append("div")
        .style("color", "dimgrey")
        .style("font-size", "x-small")
        .style("text-align", "right")

    posCountDiv.append("span")
        .text("Positive Tests:")
        .style("margin-right", "2px")

    posCountDiv.append("span")
        .text(latestPositiveTests == 0 ? "n/a" : numberFormatter(latestPositiveTests))

    const testedCountDiv = container.append("div")
                            .style("color", "dimgrey")
                            .style("font-size", "x-small")
                            .style("text-align", "right")

    testedCountDiv.append("span")
        .text("Total Tests:")
        .style("margin-right", "2px")

    testedCountDiv.append("span")
        .text(latestTotalTests === 0 ? "n/a" : numberFormatter(latestTotalTests))

    const populationDiv = container.append("div")
                            .style("color", "dimgrey")
                            .style("font-size", "x-small")
                            .style("text-align", "right")

    populationDiv.append("span")
        .text("Population:")
        .style("margin-right", "2px")

    populationDiv.append("span")
        .text(numberFormatter(population))
}