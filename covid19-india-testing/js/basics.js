var statenames = ["Ladakh", "Arunachal Pradesh", "Assam", "Chandigarh", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Punjab", "Rajasthan", "Sikkim", "Tripura", "Uttarakhand", "Telangana", "Bihar", "Kerala", "Madhya Pradesh", "Andaman and Nicobar Islands", "Gujarat", "Odisha", "Dadra and Nagar Haveli and Daman and Diu", "Jammu and Kashmir", "Chhattisgarh", "Goa", "Haryana", "Himachal Pradesh", "Jharkhand", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Andhra Pradesh", "Puducherry", "Maharashtra", "Delhi"]

var color = d3.scaleQuantize([0, 10], d3.schemeBlues[5])
var altcolor = d3.scaleQuantize([0, 10], d3.schemeOranges[5])
var alt2color = d3.scaleQuantize([0, 10], d3.schemeOranges[5])

class CovidTestingData {
    constructor(updatedon, statename, totalTests, positiveTests, testPositivity, sources = []) {
        this.updatedon = updatedon
        this.statename = statename
        this.testPositivity = testPositivity
        this.totalTests = totalTests
        this.positiveTests = positiveTests
        this.id = 0
        this.sources = sources

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

class TimeSeriesCanvasModel {
    constructor(statewiseTestingData, width, height, yValyeFn) {
        this.statewiseTestingData = statewiseTestingData
        this.inlineHt = 50
        this.inlineWd = 100

        this.yValyeFn = yValyeFn

        this.margin = {top: 1, right: 10, bottom: 30, left: 40}
        this.width = width
        this.height = height
        this.timeWidth = width - this.margin.left - this.margin.right
        this.timeHeight = height - this.margin.top - this.margin.bottom



        const data = this.statewiseTestingData.all_flat

        let maxY = d3.max(data, function(d) { 
            return yValyeFn(d)
        })

        let minY = 0 - (0.034 * maxY)

        this.xFn = d3.scaleTime()
                    .domain(d3.extent(data, function(d) { return d.date; }))
                    .range([ 0, this.timeWidth ]);

        this.yFn = d3.scaleLinear()
                    .domain([minY, maxY])
                    .range([ this.timeHeight, 0 ])

        this.inlineXfn = d3.scaleTime()
                            .domain(d3.extent(data, function(d) { return d.date; }))
                            .range([ 0, this.inlineWd ])

        this.inlineYfn = d3.scaleLinear()
                            .domain([minY, maxY])
                            .range([ this.inlineHt, 0 ])
    }
}

class TimeSeriesCanvas {
    constructor(model, containerSelection, isInline, yLabel) {
        this.model = model
        this.containerSelection = containerSelection

        this.isInline = isInline

        this.yLabel = yLabel

        this.wd = isInline ? model.inlineWd : model.width
        this.ht = isInline ? model.inlineHt : model.height

        this.svg = this.containerSelection.append("svg")
                                        .attr("preserveAspectRatio", "xMinYMin meet")
                                        .attr("viewBox", `0 0 ${this.wd} ${this.ht}`)
    }

    xFn() {
        return this.isInline ? this.model.inlineXfn : this.model.xFn
    }

    yFn() {
        return this.isInline ? this.model.inlineYfn : this.model.yFn
    }

    appendG() {
        let g = this.svg.append("g").attr("id", "main")

        if (!this.isInline) {
            g.attr("transform", "translate(" + this.model.margin.left + "," + this.model.margin.top + ")")
            // Add X axis
            g.append("g")
                .attr("transform", "translate(0," + (this.model.timeHeight) + ")")
                .call(d3.axisBottom(this.model.xFn))
            
            // Add Y axis
            let axis = d3.axisLeft(this.model.yFn)
                        .ticks(8, d3.format("~s"))
            g.append("g").call(axis)

            // Label
            g.append("text")
            .attr("x", 20).attr("y", 15)
            .style("fill", "silver").style("font-size", "18px")
            .text(this.yLabel)
        }

        return g
    }

    g() {
        return this.svg.select("g")
    }

    clearHighlightedTimeSeries() {
        this.g().selectAll(".statetimeplot").remove()
    }

    onMouseOver(fn) {
        this.svg.on("mouseover", fn)
        return this
    }

    onMouseOut(fn) {
        this.svg.on("mouseout", fn)
        return this
    }
}

let yValueTPRfn = function(d) {
    let tp = d.testPositivityNum()
    let rate = (tp === NaN) ? 0.0 : tp
    return rate
}

let yValueTotalTestsfn = function(d) {
    let tp = parseFloat(d.totalTests)
    let rate = (tp === NaN) ? 0.0 : tp
    return rate
}

let yValuePosTestsfn = function(d) {
    if (d.positiveTests == "") {
        return 0.0
    }

    let val = parseFloat(d.positiveTests)
    let posTests = (val === NaN) ? 0.0 : val
    return posTests
}

function plotTimeSeries(timeSeriesCanvas, dataColor, stateTestPositivityData, pathclass) {

    var col = ""

    if (isFunction(dataColor)) {
        const lastIndex = stateTestPositivityData.length - 1
        let latestPosData = stateTestPositivityData[lastIndex]
        const testposRate = latestPosData.testPositivityNum()
        col = dataColor(testposRate)
    } else {
        col = dataColor
    }

    const yValyeFn = timeSeriesCanvas.model.yValyeFn

    const shouldFill = (pathclass === "inlinetimeplot" || pathclass === "indiainlinetimeplot")

    const timeG = timeSeriesCanvas.g()
    const x = timeSeriesCanvas.xFn()
    const y = timeSeriesCanvas.yFn()
    timeG.append("path")
        .datum(stateTestPositivityData)
        .attr("class", pathclass)
        .attr("fill", "none")
        .attr("stroke", col)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
                    .x(function(d) { return x(d.date) })
                    .y(function(d) {
                        let rate = yValyeFn(d)
                        return y(rate) 
                    })
            )
        .append("title").text(d => d.statename)


    if (shouldFill) {
        var area = d3.area()
                    .x(function(d) { return x(d.date) })
                    .y1(function(d) { 
                        let rate = yValyeFn(d)
                        return y(rate)
                    })
                    .y0(y(0))
        
        let lightCol = d3.color(col).darker(4)

        timeG.append("path")
            .datum(stateTestPositivityData)
            .attr("fill", lightCol)
            .attr("d", area)
    }
}

//#region UTILS

// ref: https://stackoverflow.com/questions/5999998/check-if-a-variable-is-of-function-type
var isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

const numberFormatter = d3.format(",")

// Borrowed from: https://gist.github.com/tobyjsullivan/96d37ca0216adee20fa95fe1c3eb56ac
// Original code: https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
function abbreviatedNumber(value) {
    let newValue = value * 1.0
    const suffixes = ["", "K", "M", "B","T"]
    let suffixNum = 0
    while (newValue >= 1000.0) {
        newValue /= 1000.0
        suffixNum++
    }

    newValue = newValue.toPrecision(3)

    abbreviateNumberRep = newValue + suffixes[suffixNum]

    console.log(abbreviateNumberRep)

    return abbreviateNumberRep
}

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

//#endregion UTILS