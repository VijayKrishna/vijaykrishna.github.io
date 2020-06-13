var statenames = ["Ladakh", "Arunachal Pradesh", "Assam", "Chandigarh", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Punjab", "Rajasthan", "Sikkim", "Tripura", "Uttarakhand", "Telangana", "Bihar", "Kerala", "Madhya Pradesh", "Andaman and Nicobar Islands", "Gujarat", "Odisha", "Dadra and Nagar Haveli and Daman and Diu", "Jammu and Kashmir", "Chhattisgarh", "Goa", "Haryana", "Himachal Pradesh", "Jharkhand", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Andhra Pradesh", "Puducherry", "Maharashtra", "Delhi"]

var color = d3.scaleQuantize([0, 10], d3.schemeBlues[5])
var altcolor = d3.scaleQuantize([0, 10], d3.schemeOranges[5])
var alt2color = d3.scaleQuantize([0, 10], d3.schemeReds[5])

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