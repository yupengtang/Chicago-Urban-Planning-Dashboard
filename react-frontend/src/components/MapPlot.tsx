import { useEffect, createRef } from 'react'
import * as d3 from 'd3'
import { FeatureD } from "../types/data";
import { ChartStyle, getChildOrAppend, getMargin } from './utils';
import React from "react";
import './MapPlot.css'


interface MapPlotProp extends ChartStyle {
    data?: FeatureD
}

const MapPlot = (props: MapPlotProp) => {
    const ref = createRef<SVGSVGElement>()
    const { data, ...style} = props
    useEffect(() => {
        const root = ref.current;
        if (data && root) {
            renderMapPlot(root, data, style)
        }
    }, [props])

    return <div className="MapPlot">
        <svg width={props.width} height={props.height} ref={ref} />
    </div>
}

/** 
 * Render the MapPlot
 * @param root the root SVG element
 * @param data the data for visualization
 * @param props the parameters of the MapPlot
*/
function renderMapPlot(
    root: SVGElement | SVGGElement,
    data: FeatureD,
    props: ChartStyle
) {
    const margin = getMargin(props.margin)
    const height = props.height - margin.top - margin.bottom
    const width = props.width - margin.left - margin.right

    const visRoot = d3.select(root)
    const base = getChildOrAppend<SVGGElement, SVGElement>(visRoot, "g", "base")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
    
    // var svg = d3.select("body")
    // .append("svg")
    // .style("cursor", "move");


    // svg.attr("viewBox", "50 10 " + width + " " + height)
    // .attr("preserveAspectRatio", "xMinYMin");

    // var zoom = d3.zoom()
    //     .on("zoom", function () {
    //         var transform = d3.zoomTransform(this);
    //         map.attr("transform", transform);
    //     });
    
    // svg.call(zoom);
    
    // var map = svg.append("g")
    //     .attr("class", "map");
    
    // d3.queue()
    //     .defer(d3.json, "src/data/50m.json")
    //     .defer(d3.json, "src/data/population.json")
    //     .await(function (error, world, data) {
    //         if (error) {
    //             console.error('Oh dear, something went wrong: ' + error);
    //         }
    //         else {
    //             drawMap(world, data);
    //         }
    //     });
        
    // const xValues = data.map(d => d.X1)
    // const x = d3.scaleLinear().domain([d3.min(xValues) || 0, d3.max(xValues) || 1]).range([0, width])
    // const yValues = data.map(d => d.X2)
    // const y = d3.scaleLinear().domain([d3.min(yValues) || 0, d3.max(yValues) || 1]).range([height, 0])
    // const colors = d3.scaleOrdinal(["1", "2"], ["blue", "red"])

    // base.selectAll("circle.dot")
    //     .data(data)
    //     .join<SVGCircleElement>(
    //         enter => enter.append("circle")
    //             .attr("class", "dot"),
    //         update => update,
    //         exit => exit.remove()
    //     )
    //     .attr("cx", d => x(d.X1))
    //     .attr("cy", d => y(d.X2))
    //     .attr("r", 5)
    //     .style("fill", d => colors(d.cluster) || "#fff")

    // getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "y-axis-base")
    //     .call(d3.axisLeft(y).ticks(4));

    // getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "x-axis-base")
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(d3.axisBottom(x).ticks(5));
}


export default MapPlot;
