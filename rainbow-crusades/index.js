let mainContainer = d3.select("div#main")
console.log(mainContainer)

class InstaContent {
    constructor(ref, bgCol, fgCol, caption) {
        this.ref = ref
        this.bgCol = bgCol
        this.fgCol = fgCol
        this.caption = caption
    }
}

let instaData = [
    new InstaContent("CBQ-jwMJ7F4", "white", "black", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."),
    new InstaContent("CA2OB7sp9sa", "#3a5942", "white", "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."),
    new InstaContent("CAn4qGVpbUr", "#fff2c9", "black", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."),
    new InstaContent("CABjtvSj4EO", "#d47d3b", "white", "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."),
    new InstaContent("B-3UkKqj20p", "#8f7896", "white", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."),
    new InstaContent("B-FdcZiDlol", "#1d4722", "white", "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."),
    new InstaContent("B8mu6aMHqvv", "#858c3a", "white", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."),
    new InstaContent("B6rj19rHy7V", "#ffedd1", "black", "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."),
    new InstaContent("BrDUlLonjcP", "#d4d4d4", "black", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."),
    new InstaContent("BUMZ6CgAOJs", "orange", "black", "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."),
    new InstaContent("BOiC17WgXRi", "black", "white", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."),
]

let contentDivs = mainContainer.selectAll("div")
                            .data(instaData)
                            .enter()
                            .append("div")
                            .attr("class", "w-auto p-2 mx-auto my-5 shadow rounded-lg")
                            .style("background-color", "white")
                            .attr("id", (d, i) => "rbc-spy" + i)
                            .on("click", function() {
                                focusIntoView(this, true)
                            })

contentDivs.append("img")
        .attr("class", "w-50 d-inline-block rounded-lg")
        .attr("src", d => `https://www.instagram.com/p/${d.ref}/media/?size=l`)
        .attr("crossorigin", "anonymous")
        .on("load", function(d) {
            let parent = d3.select(this.parentNode)
            parent.style("background-color", d.bgCol)
        })

contentDivs.append("p")
            .attr("class", "w-50 d-inline-block rounded-lg px-2")
            .style("color", d => d.fgCol)
            .html((d, i) => "Caption: " + d.caption)

function modulatedBgColor(bgCol) {
    const col = d3.color(bgCol)

    const hexCol = col.hex()

    // make exceptions for select colors
    const exceptionHexs = ["#000000", "#ffffff"]
    const exceptionLookup = exceptionHexs.indexOf(hexCol)
    if (exceptionLookup >= 0 && exceptionLookup < exceptionHexs.length) {
        return hexCol
    }

    // refs
    // 1. working with d3.color: https://observablehq.com/@d3/working-with-color
    // 2. d3.color api: https://github.com/d3/d3-color
    const lch = d3.lch(col)

    // How I arrived at these L and C values:
    // 1. Played around with an HCL color picker: https://bl.ocks.org/mbostock/3e115519a1b495e0bd95
    // 2. I wanted a subtle/subdued color, which was not too light, and did not give off too much color.
    //    Reducing the Chroma to near zero seemed to do the trick here, while mainting luminance somewhere in the middle
    const subtleCol = d3.lch(90, 5, lch.h)
    return subtleCol.hex()
}

d3.select("body").style("background-color", "#ffffff")

function focusIntoView(target, positionInViewportCenter = false) {
    //ref: https://hiddedevries.nl/en/blog/2018-12-10-scroll-an-element-into-the-center-of-the-viewport
    // {
    //     behavior: "smooth" | "auto";
    //     block: "start" | "center" | "end" | "nearest";
    //     inline: "start" | "center" | "end" | "nearest";
    // }
    
    if (positionInViewportCenter) {
        target.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })
    }

    let targetSel = d3.select(target)
    let bgCol = targetSel.style("background-color")

    const modBgCol = modulatedBgColor(bgCol)

    d3.select("body")
        .transition()
        .style("background-color", modBgCol)
}

// 

var observer = new IntersectionObserver(function(entries) {
    // isIntersecting is true when element and viewport are overlapping
    // isIntersecting is false when element and viewport don't overlap

    console.log(entries.length)

    let firstEntry = entries[0]

    if(firstEntry.isIntersecting === true) {
        let target = firstEntry.target
        focusIntoView(target, false)
    }

}, { threshold: [0.99] });

for (let index = 0; index < instaData.length; index++) {
    observer.observe(document.querySelector("#rbc-spy" + index));
}

