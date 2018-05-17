var width = 960, height = 500, colors = d3.scaleOrdinal(d3.schemeSet3);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function main(jsonFile){
    // "use strict"

    var width,height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select("#brain").append("svg")
    var chartLayer = svg.append("g").classed("chartLayer", true)

    d3.json(jsonFile, function (error, jsonData) {
        if (error)
            throw error;

        var data = {
            nodes:jsonData.nodes,
            links:jsonData.links        
        }
        setSize()
        drawChart(data)    
    });
    
    function setSize() {
        width = document.querySelector("#brain").clientWidth
        height = document.querySelector("#brain").clientHeight
    
        margin = {top:0, left:0, bottom:0, right:0 }
        
        
        chartWidth = width - (margin.left+margin.right)
        chartHeight = height - (margin.top+margin.bottom)
        
        svg.attr("width", width).attr("height", height)
        
        
        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate("+[margin.left, margin.top]+")")
    }
    
    function drawChart(data) {
        var shiftX = 200;
    
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke", "lightgrey")
            .attr("x1", function(d) { return d.x1 + shiftX; })
            .attr("y1", function(d) { return d.y1 + 500; })
            .attr("x2", function(d) { return d.x2 + shiftX; })
            .attr("y2", function(d) { return d.y2 + 500; })
            .style("opacity", function(d) { return 0.25 })
            .style("stroke-width", function(d) { return 1.5 })
        
        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", function(d){  return d.colorGroup % 7 })
            .attr("cx", function(d) { return d.x + shiftX; })
            .attr("cy", function(d) { return d.y + 500; })
            .style("fill", function (d) { return colors((d.colorGroup)) });
                
    }
}