class IndiaMap {
    constructor(containerSelector, width, height, data) {
        this.width = width
        this.height = height
        this.data = data
        this.features = topojson.feature(data, data.objects.Admin2)

        var projection = d3.geoMercator().fitSize([this.width, this.height], this.features)
        this.path = d3.geoPath(projection)

        this.svg = d3.select(containerSelector)
                    .append("svg")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        this.g = this.svg.append("g") // keep this first
        // mapG = g
        this.labelG = this.svg.append("g")
    }

    drawMap(handleMouseOver, handleMouseOut, clicked) {
        // Bind TopoJSON data
        const statePaths = this.g.selectAll("path")
                                .data(this.features.features) // Bind TopoJSON data elements
                                .enter().append("path")
                                .attr("d", this.path)
                                .attr("id", d => { return d.id; })
                                .style("stroke", "steelblue")
                                .on("mouseenter", handleMouseOver)
                                .on("mouseout", handleMouseOut)
                                .on("click", clicked)
        return statePaths
    }

    zoomMap(d) {
        if (d && centered !== d) {
            var x, y, k
            var centroid = this.path.centroid(d)
            x = centroid[0]
            y = centroid[1]
            k = 3
            centered = d
            mapG.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1.5 / k + "px")
        }
    }
}



function attachTopRightMapLabels(labelG, statename, latestPosData) {

    function setupTextBg(text, host) {
        var bbox = text.node().getBBox();
        var padding = 4;
        host.append("rect")
            .attr("x", bbox.x - padding)
            .attr("y", bbox.y - padding)
            .attr("width", bbox.width + (padding*2))
            .attr("height", bbox.height + (padding*2))
            .style("fill", "black");
        text.raise()
    }

    labelG.selectAll("rect").remove()

    const firstLabelY = 70
    const labelDy = 25

    labelG.append("rect")
            .attr("x", 350)
            .attr("y", 25)
            .attr("width", )

    const t1 = labelG.append("text")
        .attr("class", "statelabel")
        .attr("x", 350).attr("y", firstLabelY)
        .style("fill", "silver")
        .style("font-size", "18px")
        .style("background-color", "black")
        .text("Test Positivity")
    setupTextBg(t1, labelG)


    const t2 = labelG.append("text")
        .attr("class", "statelabel")
        .attr("x", 350).attr("y", firstLabelY + labelDy)
        .style("font-size", "20px").style("fill", "silver")
        .text(statename + ": " + latestPosData.testPositivity)
    setupTextBg(t2, labelG)

    const t3 = labelG.append("text")
        .attr("class", "statelabel")
        .attr("x", 350).attr("y", firstLabelY + (2 * labelDy))
        .style("font-size", "15px").style("fill", "silver")
        .text("Updated on: " + latestPosData.updatedon)
    setupTextBg(t3, labelG)

    if (latestIndiaTestingData != null) {
        const t4 = labelG.append("text")
            .attr("class", "statelabel")
            .attr("x", 350).attr("y", firstLabelY + (3.5 * labelDy))
            .style("font-size", "20px").style("fill", "silver")
            .text("India: " + latestIndiaTestingData.testPositivity)
        setupTextBg(t4, labelG)

        const t5 = labelG.append("text")
            .attr("class", "statelabel")
            .attr("x", 350).attr("y", firstLabelY + (4.5 * labelDy))
            .style("font-size", "15px").style("fill", "silver")
            .text("Updated on: " + latestIndiaTestingData.updatedon)
        setupTextBg(t5, labelG)
    }
}