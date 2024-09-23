import { useEffect, createRef, useState } from 'react'
import React from "react";
import * as d3 from 'd3'
import { ShapArray } from "../types/data";
import { ChartStyle, getChildOrAppend, getMargin } from './utils';
import './BarPlot.css'
import { getPointsFromBackend } from '../router/resources/data';


interface ShapPlotProp extends ChartStyle {
    id: string
   
}

const ShapPlot = (props: ShapPlotProp) => {
    const ref = createRef<SVGSVGElement>()
    const {id, ...style} = props
    const [shapplotData, setShapPlotData] = useState<ShapArray[]>();

    useEffect(() => {
        //getPointsFromBackend('prediction/'+props.feature+'/'+props.shapval).then(f => {
          getPointsFromBackend('prediction/shap_values').then(f => {
            setShapPlotData(f);
        })
      }, []);
    
    useEffect(() => {
        const docId = document && document.getElementById(props.id)
        if (docId) {
            const root = ref.current;
            if (shapplotData && root) {
                renderShapPlot(root, shapplotData, props.height, props.width, style)
            }

        }
    }, [props])

    return <div className="ShapPlot">
        <svg width={props.width} height={props.height} ref={ref} />
            <g className="tooltip-area">
                <text className="box-tt tooltip-area__text"></text>
            </g>
    </div>
}

function renderShapPlot(
    root: SVGElement | SVGGElement,
    data_plot: ShapArray[],
    boxHeight: number, 
    boxWidth: number,
    props: ChartStyle
) 

{
    const variables = [ "Adult obesity rate",
    "Disability",
    "Overall health status",
    "Neighborhood adult safety rate",
    "College graduation rate", "Unemployment rate",
    "Adult physical inactivity rate",
    "Limited English proficiency",
    "Alcohol-induced mortality rate",
    "Drug-induced mortality",
    "Drug overdose mortality rate",
    "Suicide mortality rate",
    "Cancer mortality rate",
    "Life expectancy",
    "Population",
    "Diet-related mortality" ]

    var features = [
        "HCSOBP_2015-2017",
        "DIS_2015-2019",
        "HCSOHSP_2016-2018",
        "HCSNSP_2016-2018",
        "EDE_2015-2019",
        "UMP_2015-2019",
        "HCSPAP_2015-2017",
        "LEQ_2015-2019",
        "VRALR_2015-2019",
        "VRDIDR_2015-2019",
        "VRDO_2015-2019",
        "VRSUR_2015-2019",
        "VRCAR_2015-2019",
        "VRLE_2019",
        "POP_2015-2019",
        "VRDI_2015-2019"  
      ]

    const margin = getMargin(props.margin)
    const height = boxHeight - margin.top - margin.bottom //y-axis
    const width = boxWidth - margin.left - margin.right - 20//x-axis
   // console.log(boxHeight)
    const visRoot = d3.select(root)
    const base = getChildOrAppend<SVGGElement, SVGElement>(visRoot, "g", "base")
        .attr("viewBox", [0, 0, width, height]);
        /* .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")"); */

   var i = 0 

    const dataArray = Object.entries(data_plot).map(([feature, shapval]) => ({
      feature,
      shapval,
    }));

    const negdataArray = Object.entries(data_plot).map(([feature, shapval]) => {
        if (typeof shapval === 'number') {
          return {
            feature,
            shapval: shapval < 0 ? shapval : 0,
          };
        } else {
          return {
            feature,
            shapval: 0,
          };
        }
      });
      
    const posdataArray = Object.entries(data_plot).map(([feature, shapval]) => {
        if (typeof shapval === 'number') {
          return {
            feature,
            shapval: shapval > 0 ? shapval : 0,
          };
        } else {
          return {
            feature,
            shapval: 0,
          };
        }
      });

      const featureMap: { [key: string]: string } =  {};

      // Create a lookup table by mapping the features to variables
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const variable = variables[i];
        featureMap[feature] = variable;
      }

    console.log("dataArray")
    console.log(dataArray)
    
   
    const xValues = dataArray.map(d => d.feature)
    const x = d3.scaleBand<number>().domain(d3.range(variables.length)).range([0, props.width]).padding(0.1)
  
    const yValues = dataArray.map(d => Number(d.shapval));
   
    const y = d3.scaleLinear().domain([-d3.max(yValues)!,d3.max(yValues)!]).nice().range([height - margin.bottom, margin.top])
   
    const color = ["steelblue","red"]

    const maxAbsoluteValue = d3.max(dataArray, (d) => Math.abs(Number((d.shapval))));
    const positiveColorScale = d3.scaleSequential(d3.interpolateBlues).domain( [maxAbsoluteValue || 0,0]).interpolator((t) => d3.interpolateBlues(1 - (1 - 0.3) * t));
    const negativeColorScale = d3.scaleSequential(d3.interpolateReds).domain([maxAbsoluteValue || 0,0]).interpolator((t) => d3.interpolateReds(1 - (1 - 0.3) * t));
    ;
    
    const tooltipWidth = 160;
    const tooltipHeight = 30;
    
    var tooltip = d3.select('.tooltip-area')
    .append("g")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("z-index", 10);

  
    tooltip.append("rect")
    .attr("width", tooltipWidth) 
    .attr("height", tooltipHeight) 
    .style("fill", "palegreen")
    .attr("rx", 4)
    // .style("stroke", "black")
    .style("stroke-width", 0.1)

    const tooltipText = tooltip.append("text")
    .attr("class", "tooltip-text")
    .attr("x", tooltipWidth / 2)
    .attr("y", tooltipHeight / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("fill", "black");

    const mouseover = (event: any, feature: string, name: string, val: number) => {
        console.log("mouseover")
        tooltip.style("opacity", 1);
        tooltipText.text(`${name} for ${feature}: ${val.toFixed(2)}`);
        // const [x, y] = d3.pointer(event);
        const x = -200
        const y = -50

        tooltip.attr('transform', `translate(${x}, ${y})`);
    };

    const mouseleave = () => {
        console.log("mouseleave")
        tooltip.style('opacity', 0.0);
    }

    base.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height)
        .text("Shapley Values");
        
    // base.append("text")
    //      .attr("class", "x label")
    //      .attr("text-anchor", "end")
    //      .attr("x", width)
    //      .attr("y", height)
    //     //  .attr("transfrom",`translate(10, 40`)
    //      .text("Features");

    //Blue
    base.append("g")
        
        .selectAll("rect")
        //.data(dataArray.map(d =>Number(d.shapval)  > 0 ? d : {shapval: 0}))
        .data(posdataArray)
            
        .join("rect")
           .attr("fill", (d) => {
               const colorValue = positiveColorScale(Math.abs(Number(d.shapval)));
               console.log("Negative Color Value:", colorValue);
               return colorValue;
               })
          .attr("x", (d, i) => (props.width/dataArray.length)*i)
          .attr("y", d => y(Number(d['shapval'])))
          .attr("height", d => y(0) - y(Number(d['shapval'])))
          .attr("width", x.bandwidth()- 5)
          .attr("transform", `translate(15, 0)`)
        
            .on("mouseleave", function()
            {
              // d3.select(this).style("stroke", "black");
                mouseleave()
            }
            )
            .on("mouseover", function(e,d) {
            d3.select(this)
                .style("stroke","white")
                .style("stroke-width",0.5)
                .style("cursor","pointer");
            mouseover(e, featureMap[d.feature], "Shapvalue", Number(d.shapval))});
        
    //Red
    base.append("g")
          .attr("fill", color[1])
       .selectAll("rect")
       //.data(dataArray.map(d =>Number(d.shapval)  < 0 ? d : {shapval: 0}))
       .data(negdataArray)
       .join("rect")
         .attr("x", (d, i) => (props.width/dataArray.length)*i)
         .attr("y", d => y(0))
         .attr("height", d => Math.abs(y(0) - y(-(Number(d['shapval'])))))
         .attr("width", x.bandwidth() -5 )
         .attr("transform", `translate(15, 0)`)
         .attr("fill", (d) => {
            const colorValue = negativeColorScale(Math.abs(Number(d.shapval)));
            console.log("Negative Color Value:", colorValue);
            return colorValue;
            })
         .on("mouseleave", function(){
            d3.select(this)
                .style("stroke-width", 0.25);
                mouseleave()})
            
         .on("mouseover", function(e,d) {
            d3.select(this)
                .style("stroke","white")
                .style("stroke-width",0.1)
                .style("cursor","pointer");
            mouseover(e, featureMap[d.feature], "Shapvalue",Number(d.shapval))});; 
    
    base.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 500)
        .attr("y", height - 330 )
        .text("ShapValues");
        
    /*base.append("text")
         .attr("class", "x label")
         .attr("text-anchor", "end")
         .attr("x", width)
         .attr("y", height)
         .attr("transfrom",`translate(10, 40`)
         .text("Features");*/

  getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "y-axis")
    .attr("transform", `translate(15,0)`) 
    .call(d3.axisLeft(y).ticks(10));


const labels = variables.map((d) => d);

  getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "x-axis-pos")
    .attr("transform", `translate(15, ${height / 2 })`)
    /* .attr("fill", (d) => positiveColorScale(d.shapval)) */
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll('g.tick')
    .attr('display', 'none')
        
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-90) translate(-30, 0)");

  getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "x-axis-neg")
    .attr("transform", `translate(15, ${height / 2})`)
    
    .call(d3.axisTop(x).tickSize(0))
    .selectAll('g.tick')
        .attr('display', 'none')
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-90) translate(-30, 0)");

       

    

  
  

}   

export default ShapPlot;
