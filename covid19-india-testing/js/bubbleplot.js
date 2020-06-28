class BubblePlotCanvasModel {
    constructor(testingDataArray, width, height, xValyeFn, yValyeFn, rValueFn) {
        this.statewiseTestingData = testingDataArray

        this.xValyeFn = xValyeFn
        this.yValyeFn = yValyeFn
        this.rValueFn = rValueFn

        this.margin = {top: 60, right: 30, bottom: 30, left: 30}
        this.width = width
        this.height = height
        this.bubbleplotWidth = width - this.margin.left - this.margin.right
        this.bubbleplotHeight = height - this.margin.top - this.margin.bottom

        const data = testingDataArray

        let maxX = d3.max(data, function(d) { 
            return xValyeFn(d)
        })

        let minX = 0 - (0.034 * maxX)

        let maxY = d3.max(data, function(d) { 
            return yValyeFn(d)
        })

        let minY = 0 - (0.034 * maxY)

        this.xFn = d3.scaleLinear()
                    .domain([minX, maxX])
                    .range([ 0, this.bubbleplotWidth ]);

        this.yFn = d3.scaleLinear()
                    .domain([minY, maxY])
                    .range([ this.bubbleplotHeight, 0 ])
        
        this.bubbles = null
    }
}

class BubblePlotCanvas {
    constructor(model, containerSelection, plotLabel, xAxisLabel, yAxisLabel) {
        this.model = model
        this.containerSelection = containerSelection

        this.plotLabel = plotLabel
        this.xAxisLabel = xAxisLabel
        this.yAxisLabel = yAxisLabel

        this.wd = model.width
        this.ht = model.height

        this.svg = this.containerSelection.append("svg")
                                        .attr("preserveAspectRatio", "xMinYMin meet")
                                        .attr("viewBox", `0 0 ${this.wd} ${this.ht}`)
    }

    xFn() {
        return this.model.xFn
    }

    yFn() {
        return this.model.yFn
    }

    appendG() {
        let g = this.svg.append("g").attr("id", "main")

        g.attr("transform", "translate(" + this.model.margin.left + "," + this.model.margin.top + ")")
        // Add X axis
        g.append("g")
            .attr("transform", "translate(0," + (this.model.bubbleplotHeight) + ")")
            .call(d3.axisBottom(this.model.xFn))
        
        // Add Y axis
        let axis = d3.axisLeft(this.model.yFn)
                    .ticks(8, d3.format("~s"))
        g.append("g").call(axis)

        // Label
        g.append("text")
        .attr("x", 20).attr("y", 45)
        .style("fill", "silver").style("font-size", "18px")
        .text(this.plotLabel)

        const t1 = g.append("text")
                    .attr("x", 0).attr("y", 0)
                    .style("fill", "white")
                    .style("font-size", "10px")
                    .text(this.xAxisLabel)

        var bbox = t1.node().getBBox()
        t1.attr("x", this.wd - (bbox.width * 2))
            .attr("y", this.model.bubbleplotHeight - (bbox.height - 5))

        const t2 = g.append("text")
                    .attr("x", 0).attr("y", 0)
                    .style("fill", "white")
                    .style("font-size", "10px")
                    .text(this.yAxisLabel)

        var bbox2 = t2.node().getBBox()
        t2.attr("x", -(bbox2.width/2.5))
            .attr("y", -(bbox2.height - 5))

        return g
    }

    g() {
        return this.svg.select("g")
    }

    plot(colorFn) {
        const g = this.g()
        const x = this.xFn()
        const y = this.yFn()

        const self = this

        this.bubbles = g.selectAll("circle")
                        .data(this.model.statewiseTestingData)
                        .enter()
                        .append("circle")
                        .attr("stroke", function(d) {
                            return colorFn(d.testPositivityNum())
                        })
                        .attr("stroke-width", 2)
                        .attr("cx", function(d) {
                            let val = self.model.xValyeFn(d)
                            return x(val) 
                        })
                        .attr("cy", function(d) {
                            let val = self.model.yValyeFn(d)
                            return y(val) 
                        })
                        .attr("r", function(d) {
                            let val = self.model.rValueFn(d)
                            return val*2
                        })
        
        this.bubbles.on("click", d => {
                    console.log(d)
                })

        this.bubbles.append("title")
                .text(d => {
                        return `${d.statename} // Pos Rate: ${d.testPositivityNum()}%`
                    })
        
        this.showBubbleLabels()

        var array = this.model.statewiseTestingData

        g.selectAll("text")
        .data(array.slice(0, 4))
        .enter()
        .append("text")
        .attr("fill", "white")
        .style("font-size", "10px")
        .attr("x", function(d) {
            let val = self.model.xValyeFn(d)
            let o = x(val) 
            console.log(`${d.statename} ${o}`)
            return o
        })
        .attr("y", function(d) {
            let val = self.model.yValyeFn(d)
            let o = y(val)
            console.log(`${d.statename} ${o}`)
            return o
        })
        .text(d => d.statename)
    }

    showBubbleLabels() {
        const self = this
        const g = this.g()
        const x = this.xFn()
        const y = this.yFn()

        var p = d3.precisionRound(0.1, 1.1)
        const shortNumFormatter = d3.format(".2~s")

        this.bubbles.each(d => {
            if (d.positiveTests < 20000 && d.testPositivityNum() <= 10.0) {
                return
            }

            let val = self.model.xValyeFn(d)
            let oX = x(val) 

            let valY = self.model.yValyeFn(d)
            let oY = y(valY)

            let t = g.append("text")
            .attr("fill", "white")
            .attr("class", "bubbleLabel")
            .style("font-size", "10px")
            .attr("x", oX)
            .attr("y", oY)
            .text(d.statename)

            var bbox = t.node().getBBox()
            t.attr("x", oX - bbox.width)

            let t2 = g.append("text")
            .attr("fill", "silver")
            .attr("class", "bubbleLabel")
            .style("font-size", "10px")
            .attr("x", oX)
            .attr("y", oY)
            .text(`Positivity: ${d.testPositivityNum()}%`)

            var bbox2 = t2.node().getBBox()
            t2.attr("x", oX - bbox.width)
                .attr("y", oY - bbox2.height)

            let t3 = g.append("text")
            .attr("fill", "silver")
            .attr("class", "bubbleLabel")
            .style("font-size", "10px")
            .attr("x", oX)
            .attr("y", oY)
            .text(`Test #: ${shortNumFormatter(d.totalTests)}`)
    
            var bbox3 = t3.node().getBBox()
            t3.attr("x", oX - bbox.width)
            .attr("y", oY - bbox2.height - bbox3.height)

            let t4 = g.append("text")
            .attr("fill", "silver")
            .attr("class", "bubbleLabel")
            .style("font-size", "10px")
            .attr("x", oX)
            .attr("y", oY)
            .text(`Pos. #: ${shortNumFormatter(d.positiveTests)}`)
    
            var bbox4 = t4.node().getBBox()
            t4.attr("x", oX - bbox.width)
            .attr("y", oY - bbox2.height - bbox3.height - bbox4.height)

            let t5 = g.append("text")
            .attr("fill", "silver")
            .attr("class", "bubbleLabel")
            .style("font-size", "10px")
            .attr("x", oX)
            .attr("y", oY)
            .text(`Population: ${shortNumFormatter(d.population)}`)
    
            var bbox5 = t5.node().getBBox()
            t5.attr("x", oX - bbox.width)
            .attr("y", oY - bbox2.height - bbox3.height - bbox4.height - bbox5.height)
        })
    }
}

// const numberFormatter = d3.format(",")