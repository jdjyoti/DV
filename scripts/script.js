import { drawLineChart, drawLegend } from './line-chart.js';
import { drawWarmingStripes } from './warming_stripes.js';
import { colorPalette } from "./colors.js";
var projection;

loadData();
var years = new Set();
var counter = 0;
var world_data
var mapData = []
var worldDataForAllYears = []
var rangeAnomaly = []

// loads data from files to variables
function loadData() {
    d3.queue()
        .defer(d3.json, "data/map/world.geojson")
        .defer(d3.json, "data/json/countries_year.json")
        .defer(d3.csv, "data/json/top10.csv")
        .await(function (error, file1, file2, file3) {
            world_data = file1;
            mapData = file2;
            worldDataForAllYears = file3
            const result = [];
            for (const x of mapData) {
                if(x.anomaly != '') {
                    if(x.anomaly == '-0.0'){
                       result[result.length] = 0.0;
                    }else{
                         result[result.length] = parseFloat(x.anomaly);
                    }
                }   
            }
            rangeAnomaly = [ d3.min(result), d3.max(result) ];
            let yearsDuplicates = mapData.map(element => {
                return element.year
            });
            years = [...new Set(yearsDuplicates)];
            drawMap()
            if (error) {
                console.error('Something went wrong: ' + error);
            }
        });
}

export function changeNavigationBar(navlink, divClassToDisplay, divClassToHide) {
    d3.select(".topnav").selectAll('a').attr("class",  null)
    d3.select(navlink).attr("class", "active")
    d3.select(divClassToDisplay).style("display", "flex")
    d3.select(divClassToHide).style("display", "none")
    if(divClassToDisplay == ".col-2"){
        createWorldAnnualAnomalyLineChart(worldDataForAllYears)
        d3.select("#multi_line_chart_mothly").style("display", "flex")
        d3.select("#multi_line_chart_yearly").style("display", "flex")
        d3.select("#linechart_description").style("display","none");
    }else{
        d3.select("#multi_line_chart_mothly").style("display", "none")
        d3.select("#multi_line_chart_yearly").style("display", "none")
        d3.select("#linechart_description").style("display","block");
    }
}

// draws the world map
function drawMap() {
    var width = 900,
    height = 450,
    active = d3.select(null);
    drawSlider();
    projection = d3.geoEquirectangular().scale(145)
 
var zoom = d3.zoom().on("zoom", zoomed);
var path = d3.geoPath().projection(projection);

var svg = d3.select("#svgMap")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

// to reset the zoom
svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)

var tooltip = d3.select('body')
        .append('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        .style('z-index', '999')
        .style('visibility', 'hidden')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.6)')
        .style('border-radius', '5px')
        .style('color', 'white');

var g = svg.append("g").attr("id","map");;
svg.call(zoom);

// draw countries and add projection
g.selectAll("path")
      .data(world_data.features).enter()
      .append("path")
      .attr("d", path)
     .attr("class", "countries")
     .attr("id", function (d) { return d.id; })
     .on('click', function (d, datum) {
         clicked(d)
         createCountriesLineChartPerCountry(d);
         createWarmingStripesPerCountry(d);
         d3.selectAll(".selectedCountry").attr("class", "countries")
         d3.select(this).classed("selectedCountry", true);
         d3.selectAll(".map-name").text(d.properties.name)
     }).on("mouseover", function (d, i) {
         tooltip
             .html(
                 `${d.properties.name}`
             )
             .style('visibility', 'visible');
     })
     .on('mousemove', function () {
         tooltip
             .style('top', d3.event.pageY - 10 + 'px')
             .style('left', d3.event.pageX + 10 + 'px');
     })
     .on('mouseout', function () {
         tooltip.html(``).style('visibility', 'hidden');
     });

function clicked(d) {
  active.classed("active", false);
  active = d3.select(d3.event.target).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  g.attr("transform", d3.event.transform);
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

    var data = d3.range(-1.429, 6);

    var svgColorScale = d3.select("#color_scale");

    svgColorScale
        .style("transform", "scaleY(-1)")
        .selectAll(".rects")
        .data(data)
        .enter()
        .append("tr")
        .append("td")
        .attr("height", 45)
        .attr("x", (d, i) => 10 + i * 15)
        .attr("width", 15)
        .style("background", d => colorPalette(d))
    
    svgColorScale
        .selectAll("tr")
        .data(data)
        .append("td")
        .style("transform","rotateX(180deg)")
        .text((d, i) => d.toFixed(2));
       
}

function drawSlider() {
    var sliderSimple = d3
        .sliderBottom()
        .min(d3.min(years))
        .max(d3.max(years))
        .width(600)
        .tickFormat(d3.format('d'))
        .ticks(10)
        .step(1)
        .on('onchange', val => {
            d3.select('parameter-value').text(val).style("font-weight","bold");
            currentYearPos = 0;
            cu
            animateMap(sliderSimple.value())
        });
    
    var gSimple = d3
        .select('div#slider-year')
        .append('svg')
        .attr('width', 650)
        .attr('height', 150)
        .style("display", "block")
        .style("margin", "auto")
        .append('g')
        .attr('transform', 'translate(30,30)');
    gSimple.call(sliderSimple);
    console.log(sliderSimple.value())
    gSimple.select("g .parameter-value").select("text").style("font-size","14px").style("fill","green").style("font-weight","bold")
}

let isVideoPlaying = false;
let currentYearPos = 0;
function startAnimation(){
    d3.select(".image-container").selectAll("#pause").style("display","block")
    d3.select(".image-container").selectAll("#play").style("display","none")
    isVideoPlaying = true;
    animateMap(null);
    d3.select("#slider-year").attr('disabled','disabled').style("opacity",0.3).style("pointer-events","none");
}

function stopAnimation(){
    d3.select(".image-container").selectAll("#pause").style("display","none")
    d3.select(".image-container").selectAll("#play").style("display","block")
    isVideoPlaying = false
    d3.select("#slider-year").attr('disabled', null).style("opacity",1).style("pointer-events","all");
}

async function animateMap(selectedYearData) {
    if (selectedYearData != null) {
        showMap(null, selectedYearData)
    }
    else {
        for (; currentYearPos < years.length; currentYearPos++) {
            let res = await showMap(currentYearPos, selectedYearData);
            console.log(res)
            if(res == false) {
                stopAnimation();
                break;
            }
        }
    }
    function showMap(i, selectedYearData) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                let filteredYear;
                let anomaly_by_year = mapData.filter(function (row) {
                    filteredYear = selectedYearData == null ? years[i] : selectedYearData
                    return row['year'] == filteredYear;
                })
                
                d3.selectAll(".year-details").text(filteredYear)
                d3.select("#map").selectAll("path")
                    .data(world_data.features).transition()
                    .style("fill", function (d) {
                        return pickColor(d.properties, anomaly_by_year)
                    })
                if (i == years.length - 1) {
                    currentYearPos = 0
                    isVideoPlaying = false;
                }
                resolve(isVideoPlaying);
        }, 100);
      });
    }
}

function pickColor(country, mapDataPerYear) {
    let color;
    mapDataPerYear.forEach(item => {
        if (item.country == country.name.toLowerCase()) {
            if (item.anomaly != "") {
                color = colorPalette(item.anomaly)
            }
        }
    });
    return color;
}

function createWorldAnnualAnomalyLineChart(worldDataForAllYears) {
    d3.select(".col-2").append("text").text("Top Ten Hottest Years").attr("class","top10-text");
    d3.select(".col-2").append("text").text("The ten hottest years have been from the years 2005 to 2021. These charts show the trend of the top 10 years with increasing anomaly").style("position","absolute")
        .style("bottom", "0").style("left","20%").style("top","100%");
    let yearsToPlot = [...new Set(worldDataForAllYears.map(item => item.Year))]
    d3.selectAll("#multi_line_chart_mothly  > *").remove();
    d3.selectAll("#multi_line_chart_five_year  > *").remove();
     drawLineChart(worldDataForAllYears, "#multi_line_chart_mothly", "Month", "AnnualAnomaly", 
     "Month", "Annual Anomaly",[1, 12],[0, 2.0], true, yearsToPlot, "Year")
     drawLineChart(worldDataForAllYears, "#multi_line_chart_five_year", "Month", "FiveYearAnomaly", 
     "Month", "Five Year Anomaly",[1, 12],[0, 2.0], true, yearsToPlot, "Year")
     drawLegend(yearsToPlot)
}

// countryData refers to geojson data 
// To draw a line chart per country to show anomaly trend
function createCountriesLineChartPerCountry(countryData) {
    d3.selectAll("#line_chart  > *").remove();
    d3.select("#linechart_description").text("Assumption : For each country, its respective absolute temperature is at 0°C");
    let countryDataForAllYears = []
    mapData.forEach(item => {
        if (item.country == countryData.properties.name.toLowerCase()) {
            countryDataForAllYears.push({ anomaly: item.anomaly, year: item.year })
        }
    });
    drawLineChart(countryDataForAllYears, "#line_chart", "year", "anomaly", "Year", 
    "Temperature Anomoly °C",[years[0], years[years.length-1]], rangeAnomaly, false, null, null)
}

function createWarmingStripesPerCountry(countryData) {
    d3.selectAll("#warming_stripes  > *").remove();
    let countryDataForAllYears = []
    mapData.forEach(item => {
        if (item.country == countryData.properties.name.toLowerCase()) {
            countryDataForAllYears.push({ anomaly: item.anomaly, year: item.year })
        }
    });
    drawWarmingStripes(countryDataForAllYears)
}

window.changeNavigationBar = changeNavigationBar
window.startAnimation = startAnimation
window.stopAnimation = stopAnimation