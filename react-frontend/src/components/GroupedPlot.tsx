import { useEffect, createRef } from 'react'
import React from "react";
import * as d3 from 'd3'
import { ScatterArray } from "../types/data";
import { ChartStyle, getChildOrAppend, getMargin } from './utils';
import './BarPlot.css'


interface GroupedPlotProp extends ChartStyle {
    id: string
    feature: string
    park: string
    barplotData: ScatterArray[] | undefined
}

const GroupedPlot = (props: GroupedPlotProp) => {
    const ref = createRef<SVGSVGElement>()
    const {id, ...style} = props
    
    useEffect(() => {
        const root = ref.current;
        if (root) {
            removePrev(root)
        }
        const docId = document && document.getElementById(props.id)
        if (docId && props.barplotData && root) {
                renderGroupPlot(root, props.barplotData, props.height, props.width, style)
        }
    }, [props.barplotData])

    return <div className="GroupedPlot">
        <svg width={props.width} height={props.height+50} ref={ref}>
            <g className="tooltip-area">
                <text className="box-tt tooltip-area__text">aas</text>
            </g>
        </svg>
    </div>
}

function removeFourthElem(y1: ((string | number)[][])){
    var yAllValues = []
    var i = 0
    for(var el in y1) {
        if (i % 4 == 0){
            yAllValues.push(y1[el])
        }
        i++
    }
    return yAllValues
}

function modifyData(data_plot: ScatterArray[]) {
    const y1 = data_plot.flatMap(d => d.map(dd => [[dd['lifeExpectancy'], "lifeExpectancy"]])).flat().filter(x => x != null)
    const y2 = data_plot.flatMap(d => d.map(dd => [[dd['trafficIntensity'], "trafficIntensity"]])).flat().filter(x => x != null)
    const y3 = data_plot.flatMap(d => d.map(dd => [[dd['numberOfParks'], "numberOfParks"]])).flat().filter(x => x != null)
    
    var y = (removeFourthElem(y1)).concat(removeFourthElem(y2)).concat(removeFourthElem(y3))
    return y
}

function removePrev(
    root: SVGElement | SVGGElement) {
    d3.select(root).selectAll("path").remove()
    d3.select(root).selectAll("g").remove()
}

function renderGroupPlot(
    root: SVGElement | SVGGElement,
    data_plot: ScatterArray[],
    boxHeight: number, 
    boxWidth: number,
    props: ChartStyle
) {
    // #obj
    var nValues = 0
    for(var i = 0; i < data_plot.length; i++) {
        for(var j = 0; j < data_plot[i].length; j++) {
            nValues += 1
        }
    }

    const margin = getMargin(props.margin)
    // const height = boxHeight - margin.top - margin.bottom //y-axis
    // const width = boxWidth - margin.left - margin.right - 20 //x-axis


    const allY = data_plot.flatMap(d => d.map(dd => dd['value'])).flat().filter(x => x != null)
    const maxY = d3.max(allY)!
    
    const correctionWidth = Math.floor(Math.log10(maxY)) * 5 + 15 
    const legendSpace = 30
    const height = props.height - margin.top - margin.bottom - legendSpace
    const width = props.width - margin.left - margin.right  - correctionWidth
    
    const axisTicks = {qty: 5, outerSize: 0}

   // console.log(boxHeight)
    const visRoot = d3.select(root)
    const base = getChildOrAppend<SVGGElement, SVGElement>(visRoot, "g", "base")
        .attr("transform", "translate(" + (margin.left + correctionWidth) +"," + (margin.top + legendSpace) + ")");

    const xAllValues = data_plot.flatMap(d => d.map(dd => dd['park'])).flat().filter(x => x != null)
    const yAllValues = data_plot.flatMap(d => d.map(dd => [dd['numberOfParks'], dd['lifeExpectancy'], dd['trafficIntensity']])).filter(x => x != null)
    var values: { key: string; value: number[]; }[] = []

    // var k = 0
    for(var i = 0; i < nValues; i++) {
        if (i % 4 == 0 && data_plot[0][0]['years']){
            values.push({key: xAllValues[i], value: yAllValues[i]})
        } 
        if (!data_plot[0][0]['years']) {
            values.push({key: xAllValues[i], value: yAllValues[i]})
        }
    }

    console.log(values)


    var xScale0 = d3.scaleBand().range([0, width]).padding(0.5)

    // var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.2)
    var xScale1 = d3.scaleBand()
    // var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
    var yScale = d3.scaleLinear().domain([0, 1.0]).range([height, 0]).nice()


    var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize).ticks(5).tickFormat(x => "" + x);
    var yAxis = d3.axisLeft(yScale).ticks(4).tickSizeOuter(axisTicks.outerSize);

    xScale0.domain(values.map(d => d.key))
    xScale1.domain(['field1', 'field2', 'field3']).range([0, xScale0.bandwidth()])
    yScale.domain([0, 1])

    var tooltip = d3.select('.tooltip-area')
        .style('opacity', 1);

    const mouseover = (event: any, name: string, val: number) => {
        console.log("mouseover")
        tooltip.style("opacity", 1);
        const text = d3.select('.tooltip-area__text');
        text.text(`${name} is ${val.toFixed(2)}`);
        const [x, y] = d3.pointer(event);

        tooltip.attr('transform', `translate(${x}, ${y})`);
    };

    const mouseleave = () => {
        console.log("mouseleave")
        tooltip.style('opacity', 0.0);
    }

    var model_name = base.selectAll(".model_name")
        .data(values)
        .enter().append("g")
        .attr("class", "model_name")
        .attr("transform", d => `translate(${xScale0(d.key)},0)`);

    /* Add field1 bars */
    model_name.selectAll(".bar.field1")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field1")
        .style("fill", d3.schemeTableau10[4])
        .attr("x", d => xScale1('field1')!)
        .attr("y", d => yScale(d.value[0]))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => yScale(1-d.value[0]))
        // .on("mousemove", (e, d) => mousemove(e, "Number Of Parks", d.value[0]))
        .on("mouseleave", function() {
            d3.select(this)
                .style("stroke-width", 0.5);
            mouseleave()})
        .on("mouseover",  function(e, d) { 
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 0.5)
                .style("cursor", "pointer");
            mouseover(e, "Number Of Parks", d.value[0])});

    /* Add field2 bars */
    model_name.selectAll(".bar.field2")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field2")
        .style("fill", d3.schemeTableau10[2])
        // .attr("x", 20)
        .attr("x", d => xScale1('field2')!)
        .attr("y", d => yScale(d.value[1]))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => yScale(1-d.value[1]))
        .on("mouseleave", function() {
            d3.select(this)
                .style("stroke-width", 0.25);

            mouseleave()})
        .on("mouseover",  function(e, d) { 
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 0.25)
                .style("cursor", "pointer");
            mouseover(e, "Life Expectancy", d.value[1])});

    /* Add field3 bars */
    model_name.selectAll(".bar.field3")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field3")
        .style("fill", d3.schemeTableau10[8])
        // .attr("x", d => xScale1('field2'))
        .attr("x", d => xScale1('field3')!)
        .attr("y", d => yScale(d.value[2]))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => yScale(1-d.value[2]))
        .on("mouseleave", function() {
            d3.select(this)
                .style("stroke-width", 0.25);

            mouseleave()})
        .on("mouseover",  function(e, d) { 
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 0.25)
                .style("cursor", "pointer");
            mouseover(e, "Number Of Parks", d.value[2])});

    // add axis
    base.append("g").call(yAxis);
    base.append("g")
        // Put axis bottom. 
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-0.0em")
            .attr("transform", "rotate(-20)");;;

    base.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height-6)
        .text("Area");

    base.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Value");
    
    // legends
    base.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .text("Health Status")
        .style("fill", d3.schemeTableau10[4])
        .style("font-size", "15px",)
        .attr("alignment-baseline","middle")

    base.append("text")
        .attr("x",( width / 3) + 5)
        .attr("y", -20)
        .text("Life Expectancy")
        .style("fill", d3.schemeTableau10[2])
        .style("font-size", "15px")
        .attr("alignment-baseline","middle")

    base.append("text")
        .attr("x", 2 * (width / 3) + 20)
        .attr("y",-20)
        .text("Traffic")
        .style("fill", d3.schemeTableau10[8])
        .style("font-size", "15px")
        // .style("font-weight", "100000")
        .attr("alignment-baseline","middle")
}   

export default GroupedPlot;
