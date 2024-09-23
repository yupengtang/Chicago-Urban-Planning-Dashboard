import { useEffect, createRef, useState } from 'react'
import React from "react";
import * as d3 from 'd3'
import { ScatterArray } from "../types/data";
import { ChartStyle, getChildOrAppend, getMargin } from './utils';

import { getPointsFromBackend } from '../router/resources/data';
import GroupedPlot from './GroupedPlot';


interface ScatterPlotProp extends ChartStyle {
    id: string
    feature: string
    park: string
}

const ScatterPlot = (props: ScatterPlotProp) => {
    const ref = createRef<SVGSVGElement>()
    const { id, ...style } = props
    const [scatterData, setScatterData] = useState<ScatterArray[]>();
    useEffect(() => {
        getPointsFromBackend('scatter_lq_year/' + props.feature + '/' + props.park).then(f => {
            setScatterData(f);
           
        })
    }, [props]);

    useEffect(() => {
        const root = ref.current;
        if (root) {
            removePrev(root)
        }
        const docId = document && document.getElementById(props.id)
        if (docId && root && scatterData) {
            renderScatterPlot(root, scatterData, style, props.feature)
        }

    }, [scatterData])
    
    if (scatterData && props)
        return <div>
            <div className="scatterPlot">
                <svg width={props.width} height={props.height+50} ref={ref} />
            </div>
            <GroupedPlot id={props.id} width={props.width} height={250} feature={props.feature} park={props.park} barplotData={scatterData} />

            {/* <BarPlot id={props.id} width={props.width} height={250} feature={props.feature} park={props.park} /> */}
        </div>
    else return <div>
            <div className="scatterPlot">
                <svg width={props.width} height={props.height} ref={ref} />
            </div>
         </div>
    
}

const labels = {
    "UNS_2015-2019": "Uninsured",
    "CZH_2017": "Homicide",
    "CZM_2017": "Major crime",
    "CZR_2017": "Robbery",
    "CZS_2017": "Criminal sexual assault",
    "CZV_2017": "Violent crime",
    "TRF_2017": "Traffic intensity",
    "CCG_2015-2019": "Lung cancer diagnosis",
    "CCR_2015-2019": "Cancer diagnosis",
    "HCSOBP_2015-2017": "Adult obesity",
    "HCSOHSP_2015-2017": "Overall health status",
    "HCSNSP_2015-2017": "Neighborhood adult safety",
    "EDB_2015-2019": "High school graduation",
    "UMP_2015-2019": "Unemployment",
    "POV_2015-2019": "Poverty",
    "HCSFVP_2015-2017": "Adult fruit and vegetable servings",
    "HCSPAP_2015-2017": "Adult physical inactivity",
    "HCSSP_2015-2017": "Adult soda consumption",
    "VRDIDR_2015-2019": "Drug-induced mortality",
    "VRDO_2015-2019": "Drug overdose mortality",
    "VRSUR_2015-2019": "Suicide mortality",
    "VRCAR_2015-2019": "Cancer mortality",
    "VRSTR_2015-2019 ": "Stroke mortality",
    "VRLE_2017": "Life expectancy",
    "POP_2015-2019": "Population",
    "CZD_2017": "Drug abuse",
}

function removePrev(
    root: SVGElement | SVGGElement) {
    d3.select(root).selectAll("path").remove()
    d3.select(root).selectAll("g").remove()
}

function renderScatterPlot(
    root: SVGElement | SVGGElement,
    data_plot: ScatterArray[],
    props: ChartStyle,
    feature: string
) {
    
    const allY = data_plot.flatMap(d => d.map(dd => dd['value'])).flat().filter(x => x != null)
    const maxY = d3.max(allY)!
    const minY = d3.min(allY)!
    
    const allX = data_plot.flatMap(d => d.map(dd => dd['years'])).flat().filter(x => x != null)
    const maxX = d3.max(allX)!
    const minX = d3.min(allX)!
    
    const margin = getMargin(props.margin)
    // correct width depending on number of digits on y axis
    const correctionWidth = Math.floor(Math.log10(maxY)) * 5
    const legendSpace = 40
    const height = props.height - margin.top - margin.bottom - legendSpace
    const width = props.width - margin.left - margin.right  - correctionWidth
    const correctionxAxis = data_plot[0].length * 0.12

    const y = d3.scaleLinear().domain([minY, maxY]).range([height, 0]).nice()
    const x = d3.scaleLinear().domain([minX - correctionxAxis/1.4, maxX + correctionxAxis]).range([0, width])
   
    const visRoot = d3.select(root)
    const base = getChildOrAppend<SVGGElement, SVGElement>(visRoot, "g", "base")
        .attr("transform", "translate(" + (margin.left + correctionWidth) + "," + (margin.top + legendSpace) + ")");

    const xValues = data_plot.map(d => d.map(dd => dd['years']))
    const yValues = data_plot.map(d => d.map(dd => dd['value']))

    if (data_plot[0][0]['years']) { // if years are set.
        // add axis
        base.append("g").call(d3.axisLeft(y).ticks(4));
        base.append("g")
            // Put axis bottom. 
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(data_plot[0].length-1).tickFormat(x => "" + x));

        base.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Year");

        base.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Value");

        const vals = data_plot.map(function (d, i) {
            return {
                col: i,
                values: d.map(function (dd): [number, number] {
                    return [dd.years, dd.value]
                }).sort(),
                name: d[0].park,
            };
        })
        // console.log(vals)
        const line = d3.line()
            .x(function (d) { return (x(d[0])) })
            .y(function (d) { return (y(d[1])) })
            .curve(d3.curveCardinal)

        // lines
        base.selectAll("myLines")
            .data(vals)
            .enter()
            .append("path")
            .attr("d", function (d) { return line(d.values) })
            .attr("stroke", function (d) { return d3.schemeSet2[d.col] })
            .style("stroke-width", 4)
            .style("fill", "none")

        // dots
        base
            .selectAll("myDots")
            .data(vals)
            .enter()
            .append("g")
            .style("fill", function (d) { return d3.schemeSet2[d.col] })
            .selectAll("myPoints")
            .data(function (d) { return d.values })
            .enter()
            .append("circle") // coordinate
            .attr("cx", (d) => x(d[0]))
            .attr("cy", (d) => y(d[1])) // radius
            .attr("r", 5)
            .attr("stroke", "white")

        // legends
        base
            .selectAll("myLabels")
            .data(vals)
            .enter()
            .append("g")
            .append("text")
            .datum(function (d) { return { name: d.name, col: d.col, value: d.values[d.values.length - 1] } })
            // Put the text at the position of the last point
            .attr("transform", function (d) {
                const xOff = Math.floor(d.col / 2) * (props.width) / 2
                const yOff = (d.col % 2 - 2 ) * (props.height / 15)
                return "translate(" + xOff + "," + yOff + ")";
            })
            .attr("x", 2) // shift the text a bit more right
            .text(function (d) { return d.name; })
            .style("fill", function (d) { return d3.schemeSet2[d.col] })
            .style("font-size", 15)

    }
    else if (!data_plot[0][0]['years']) {
        createStackedBars(root, data_plot, props)
    }
}

function createStackedBars(
    root: SVGElement | SVGGElement,
    data_plot: ScatterArray[],
    props: ChartStyle
) {
    const margin = getMargin(props.margin)

    const allY = data_plot.flatMap(d => d.map(dd => dd['value'])).flat().filter(x => x != null)
    const maxY = d3.max(allY)!
    
    const correctionWidth = Math.floor(Math.log10(maxY)) * 5 + 15
    const legendSpace = 30

    const visRoot = d3.select(root)
    const base = getChildOrAppend<SVGGElement, SVGElement>(visRoot, "g", "base")
        .attr("transform", "translate(" + (margin.left + correctionWidth) +"," + (margin.top + legendSpace) + ")");

    

    var groups = data_plot.flatMap(d => d[0].park)
    var subgroups = data_plot.flatMap(d => [[d[0].feature, d[1].feature]])[0]
    var dataIntermediate = data_plot.map(function (d) {
        return {x: d[0].park, y: d[0].value, z: d[1].value}
    });

    var stacked = dataIntermediate.flatMap(d =>
        [
            {park: d.x, color:4, start: 0, end: d.y}, 
            {park: d.x, color:1, start: d.y, end: d.y + d.z}
        ]
    )
    console.log(data_plot)
    var maxStackedY = d3.max(stacked.map(d => d.end))
    // console.log(maxStackedY)

    const height = props.height - margin.top - margin.bottom - legendSpace
    const width = props.width - margin.left - margin.right  - correctionWidth

    var xScale = d3.scaleBand().domain(groups).range([0, width]).padding(0.7)
    var yScale = d3.scaleLinear().domain([0, (maxStackedY as number)]).range([height, 0])
    const axisTicks = {qty: 5, outerSize: 0}
    var xAxis = d3.axisBottom(xScale).tickSizeOuter(axisTicks.outerSize).ticks(groups.length).tickFormat(x => "" + x);
    var yAxis = d3.axisLeft(yScale).ticks(4).tickSizeOuter(axisTicks.outerSize);

    // add axis
    base.append("g").call(yAxis);
    base.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-0.0em")
            .attr("transform", "rotate(-20)");;

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
    
    // data
    var groupsPlot = base.selectAll("g.bars")
        .data(stacked)
        .enter().append("g")
        .attr("class", "bars")
        .style("fill", function(d, i) { return d3.schemePaired[d.color]; })
    
    groupsPlot.selectAll("rect")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.park)!)
        .attr("y", d => yScale(d.end))
        .attr("height",  d => yScale((maxStackedY as number) - d.end + d.start))
        .attr("width", xScale.bandwidth())
    
    // legend
    base.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .text(labels[(subgroups[1] as keyof typeof labels)])
        .style("fill", d3.schemePaired[1])
        .style("font-size", "15px")
        .attr("alignment-baseline","middle")
    
    base.append("text")
        .attr("x", (width / 2))
        .attr("y",-20)
        .text(labels[(subgroups[0] as keyof typeof labels)])
        .style("fill", d3.schemePaired[5])
        .style("font-size", "15px")
        .style("font-weight", "bolder")
        .attr("alignment-baseline","middle")
}

export default ScatterPlot;
