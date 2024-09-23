

export default class Map 
{
  constructor() {
      this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  }

  

ChicagoMap() {


    const width = 960;
    const height = 1000;
    const d3 = require("https://d3js.org/d3.v5.min.js")
    const data = d3.json("https://raw.githubusercontent.com/michaeltranxd/UIC-Undergraduate-Research-2019-2020/master/HTML/MyWebsite/topojson/chicago_zipcodes.json")
    const colorScale = d3.scaleThreshold()
    .domain([0, 5, 10, 20])
    .range(d3.schemeBlues[4]);
    const topojson = require('https://d3js.org/topojson.v1.min.js')


    const projection = d3.geoMercator()
    .scale(width * 90)
    .center([-87.6298, 41.8781])
    .translate([width / 2, height / 2])

    const svg = d3.select("#map").selectAll("svg").data(['foo']).enter().append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "topo")
    
    // Add group for color legend
    var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(" + width * .65 + "," + height / 2 + ")");
    g.append("text")
      .attr("class", "caption")
      .attr("x", 0)
      .attr("y", -6)
      .text("Population");
  
    // Add labels for legend
    var labels = ['0', '1-5', '6-10', '11-20'];
  
    // Create the legend based on colorScale and our labels
    var legend = d3.legendColor()
    .labels(d3.legendHelpers.thresholdLabels)
    .shapePadding(4)
    .scale(colorScale);
    svg.select(".legendThreshold")
        .call(legend); 
  
    // Add the data to the choropleth map
    svg.selectAll("path")
      .data(topojson.feature(data, data.objects["Boundaries - ZIP Codes"]).features)
      .enter()
      .append("path")/*
      .attr("fill", (d, i) => {
      return colorScale(parks); // insert our b_end data here
    })
      .attr("d", d3.geoPath(projection))  */

  }
}