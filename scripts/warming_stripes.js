import { colorPalette } from "./colors.js";

export function drawWarmingStripes(data) {
    const stripeHeight = 100;
    const stripeWidth = 100 / data.length;
    d3.select(".fright .bottom > text").text("Warming stripes and Line chart")
    const divStripes = d3.select("#warming_stripes");

    var tooltip = divStripes
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    let hoveredYear;
    var svgStripes = divStripes.append("svg")
        .attr("height", stripeHeight)
        .attr("width", "115%")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("height", stripeHeight)
        .attr("width", stripeWidth + "%")
        .attr("y", 0)
        .attr("x", (data, index) => index * stripeWidth + "%")
        .style("fill", data => colorPalette(data.anomaly))
        .on("mousemove", (d) => {
           if(hoveredYear != d.year ){
            hoveredYear = d.year
            tooltip.append("p")
                .text("Year: " + d.year + " Anomaly : " + d.anomaly)
            let boundingTooltip = d3
                .select(".tooltip")
                .node()
                .getBoundingClientRect();
            tooltip
                .style("opacity", 1)
                .style("top", `${d3.event.pageY - boundingTooltip.height}px`)
                .style("left", `${d3.event.pageX - boundingTooltip.width / 2}px`)
                .style("border","solid black 1px");
           }
        })
        .on("mouseout", () => {
            tooltip
                .style("opacity", 0)
                .selectAll("p").style("opacity", 0)
                .remove();
        })
}