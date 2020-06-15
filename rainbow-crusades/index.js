
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
                            .attr("id", (d, i) => "rbc-spy" + i)
                            .on("click", function() {
                                focusIntoView(this, true)
                            })

contentDivs.append("img")
        .attr("class", "w-50 d-flex mx-auto rounded-lg")
        .attr("src", d => `https://www.instagram.com/p/${d.ref}/media/?size=l`)
        .attr("crossorigin", "anonymous")
        .on("load", function(d) {
            let parent = d3.select(this.parentNode)
            parent.style("background-color", d.bgCol)
        })

contentDivs.append("p")
            .attr("class", "w-50 d-flex mx-auto mt-2 mb-0 rounded-lg px-2")
            .style("color", d => d.fgCol)
            .html((d, i) => "Caption: " + d.caption)

function focusIntoView(target, placeInCenter = false) {
        //ref: https://hiddedevries.nl/en/blog/2018-12-10-scroll-an-element-into-the-center-of-the-viewport
        // {
        //     behavior: "smooth" | "auto";
        //     block: "start" | "center" | "end" | "nearest";
        //     inline: "start" | "center" | "end" | "nearest";
        // }
        
        target.scrollIntoView({
            behavior: "smooth",
            block: placeInCenter ? "center" : "nearest"
        })
        let targetSel = d3.select(target)
        let bgCol = targetSel.style("background-color")
        const col = d3.color(bgCol)
        d3.select("body")
            .transition()
            .style("background-color", col.brighter(0.5))
}

var observer = new IntersectionObserver(function(entries) {
    // isIntersecting is true when element and viewport are overlapping
    // isIntersecting is false when element and viewport don't overlap

    let firstEntry = entries[0]

    if(firstEntry.isIntersecting === true) {
        let target = firstEntry.target
        focusIntoView(target)
    }

}, { threshold: [0.75] });

for (let index = 0; index < instaData.length; index++) {
    observer.observe(document.querySelector("#rbc-spy" + index));
}

