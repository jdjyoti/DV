import { colorPicker } from "./colors.js";

export function drawLineChart(data, id, xAxisField, yAxisField, xAxisLabel, yAxisLabel,
  xAxisRange, yAxisRange, isMultiLineChart, trendData, trendField) {
  var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 480 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scaleLinear().range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);
  var xAxis = d3.axisBottom(x)
    .tickFormat(d3.format("d"));

  var yAxis = d3.axisLeft(y)
  const yZero = y(0.430);

  var svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("overflow", "visible")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(xAxisRange);
  y.domain(yAxisRange);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);


  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "0.8em")
    .style("text-anchor", "middle")
    .text(yAxisLabel);

  svg.append("text").
    attr("dx", "0.8em")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 10) + ")")
    .style("text-anchor", "middle")
    .text(xAxisLabel);

  if (isMultiLineChart) {
    let colorIndex = 0
    trendData.forEach(item => {
      let dataTobeDrawn = data.filter(element => element[trendField] == item)
      if (dataTobeDrawn.length > 0) {
        svg.append("path")
          .datum(dataTobeDrawn)
          .attr("class", "multi_line")
          .attr("d", d3.line()
            .x(function (d) {
              return x(d[xAxisField]);
            })
            .y(function (d) { return y(d[yAxisField]); }))
          .style("stroke", colorPicker(colorIndex))
        colorIndex++;
      }
    });
    colorIndex = 0

  }
  else {
    var line = d3.line()
      .x(function (d) {
        return x(d[xAxisField]);
      })
      .y(function (d) { return y(d[yAxisField]); });
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yZero)
      .attr('y2', yZero)
      .style('stroke', "red");
  }

  var focus = d3.select(id).append("div")
    .attr("class", "focus")
    .style("postition", "relative")
    .style("display", "none");

  focus.append("text")
    .attr("class", "tooltip-details");

  svg.selectAll("path")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mousemove", mousemove)
    .on("mouseover", function () { focus.style("display", null); })
    .on("mouseout", function () { focus.style("display", "none"); })


  // gridlines in x axis function
  function make_x_gridlines() {
    return d3.axisBottom(x)
      .ticks(13)
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(y)
      .ticks(5)
  }
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
    )
  // add the Y gridlines
  svg.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat(""))
  var tooltip = svg
    .append("div")
    .attr("class", "tooltip-details")
    .style("opacity", 0);

  function mousemove() {
    var x0 = Math.round(x.invert(d3.mouse(this)[0]))
    var y0 = x.invert(d3.mouse(this)[1])
    let i = ""
    data.forEach(element => {
      if (element[xAxisField] == parseInt(x0)) {
        i = i + getToolTipText(element)
      }
    });
    focus.style("display", null);
    focus.select(".tooltip-details").attr("height", "100%").text(i)
    focus.select(".tooltip-details")
      .style("top", `${d3.event.pageY}px`)
      .style("left", `${d3.event.pageX}px`)
  }

  function getToolTipText(d) {
    if ( d[yAxisField] == ''){
      d[yAxisField] = 'No data'
    }
    if (isMultiLineChart) {
      return trendField + " : " + d[trendField] + " " + yAxisField + " : " + d[yAxisField] + "\n"
    } else {
      return yAxisField + " : " + d[yAxisField] + " " + xAxisField + " : " + d[xAxisField]
    }
  }
}

export function drawLegend(data) {
  var svg = d3.select("#linechart_legends")

  // Add one dot in the legend for each name.
  var size = 20
  let colorIndex = 0
  svg.selectAll("mydots")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 100)
    .attr("y", function (d, i) { return 100 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d) {
      let currentColor = colorPicker(colorIndex)
      colorIndex++;
      return currentColor
    })

  // Add one dot in the legend for each name.
  svg.selectAll("mylabels")
    .data(data)
    .enter()
    .append("text")
    .attr("x", 100 + size * 1.2)
    .attr("y", function (d, i) { return 100 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function (d) { return "Year : " + d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
}
