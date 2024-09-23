import { useEffect, createRef, useState } from 'react'
import React from "react";
import * as d3 from 'd3'
import { ScatterArray } from "../types/data";
import { ChartStyle, getChildOrAppend, getMargin } from './utils';
import './BarPlot.css'
import { getPointsFromBackend } from '../router/resources/data';


interface BarPlotProp extends ChartStyle {
    id: string
    feature: string
    park: string
}

const BarPlot = (props: BarPlotProp) => {
    const ref = createRef<SVGSVGElement>()
    const {id, ...style} = props
    const [barplotData, setBarPlotData] = useState<ScatterArray[]>();

    useEffect(() => {
        getPointsFromBackend('scatter_lq_year/'+props.feature+'/'+props.park).then(f => {
            setBarPlotData(f);
        })
      }, [props]);
    
    useEffect(() => {
        const docId = document && document.getElementById(props.id)
        console.log(docId)
        console.log(props.id)
        if (docId) {
            const root = ref.current;
            if (barplotData && root) {
                renderBarPlot(root, barplotData, props.height, props.width, style)
            }

        }
    }, [barplotData])

    return <div className="BarPlot">
        <svg width={props.width} height={props.height} ref={ref} />
    </div>
}

function renderBarPlot(
    root: SVGElement | SVGGElement,
    data_plot: ScatterArray[],
    boxHeight: number, 
    boxWidth: number,
    props: ChartStyle
) {
    const margin = getMargin(props.margin)
    const height = boxHeight - margin.top - margin.bottom //y-axis
    const width = boxWidth - margin.left - margin.right - 20//x-axis
   // console.log(boxHeight)
    const visRoot = d3.select(root)
    const base = getChildOrAppend<SVGGElement, SVGElement>(visRoot, "g", "base")
        /* .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")"); */

    var i = 0
    
    const xValues = data_plot[i].map(d => d['years'])
    const x = d3.scaleLinear().domain([2015.9, d3.max(xValues) || 1]).range([0, width]).nice()
    const yValues = data_plot[i].map(d => d['value'])
    const y = d3.scaleLinear().domain([0,d3.max(yValues)!]).range([height, 0]).nice()
   
 /*    const dataMatrix = transpose(data_plot[i].map(type => type.park));
    const stackData = stack().keys(Object.keys(data_plot))(dataMatrix); */
    // console.log(xValues)
    // console.log(yValues)

    // base.selectAll("circle.dot")
    //     .data(data_plot[i])
    //     .join<SVGCircleElement>(
    //         enter => enter.append("circle")
    //             .attr("class", "dot"),
    //         update => update,
    //         exit => exit.remove()
    //     )
    //     .attr("cx", d => x(d['years']))
    //     .attr("cy", d => y(d['value']))
    //     .attr("r", 2)
    //     .style("fill", "#f12")
    
    // console.log("Hello")
    // console.log(data_plot[i].map(d => (d["years"])))
    // console.log(data_plot[i].map(d => x(d["years"])))
    
    base.selectAll("rect")
        .data(data_plot[i])
        .enter()
        .append("rect")
        .attr("x", (d, i) => (props.width / data_plot[i].length) * i)
        .attr("y", d => y(d['value']))
        .attr("width", (props.width / data_plot[i].length - 15))//dist between barplots
        .attr("height", d => height - y((d['value'])))
        .attr("fill", "green")
        
    
     
    

    // console.log("Width")
    // console.log(data_plot[i].length)
    // console.log((props.width / data_plot[i].length) - 5)

    base.selectAll(".x.axis line")
        .style("stroke","gray") 
    base.selectAll(".y.axis line")
        .style("stroke","gray") 
        


    
        
       
   // const yAxisG = base.append<SVGGElement>("g")
     //   .attr("class", "y-axis")
       // .call(d3.axisLeft(y));
    
    //yAxisG.append("text")
      //  .attr("class", "axis-label")
       // .attr("x", -height / 2)
       // .attr("y", -margin.left + 10)
       // .attr("transform", "rotate(-90)")
       // .text("Y-Axis Label");
    
    //const xAxisG = base.append<SVGGElement>("g")
     //   .attr("transform", `translate(0, ${height})`) //this defines if the x-axis starts from 0 of the y-axis
    //    .call(d3.axisBottom(x).ticks(xValues.length))
      
    /* const xAxis: d3.Axis<d3.AxisDomain> = d3.axisBottom(x).ticks(xValues.length);
    const yAxis: d3.Axis<d3.NumberValue> = d3.axisLeft(y);
    const yAxisG: Selection<SVGGElement, unknown, HTMLElement, any> = base.append<SVGGElement>("g")
        .attr("class", "y-axis")
        .call(yAxis);
    yAxisG.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .attr("transform", "rotate(-90)")
        .text("Y-Axis Label");
    const xAxisG: Selection<SVGGElement, unknown, HTMLElement, any> = base.append<SVGGElement>("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    xAxisG.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("text-anchor0","middle")
        .attr("y", margin.bottom - 10)
        .text("X-Axis Label");
       */
  getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "y-axis")
   /*  .attr("transform", `translate(${margin.left} - 40, 0)`) */
    
  
   .call(d3.axisLeft(y).ticks(yValues));


  getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "x-axis")
    .attr("transform", `translate(0, ${height})`)
     //this defines if the x-axis starts from 0 of the y-axis
    .call(d3.axisBottom(x).ticks(xValues.length))
/*   base.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(y).ticks(yValues));
  base.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(10," + height + ")")
    .call(d3.axisLeft(y).ticks(yValues));

  */
  
  

 //  getChildOrAppend<SVGGElement, SVGTextElement>(base, "text", "y-axis-base-label")
 //   .attr("x", width / 2)
 //   .attr("y", height + 30)
 //   .attr("text-anchor", "middle")
  //  .text("Y-Axis Label");
}   


export default BarPlot;
