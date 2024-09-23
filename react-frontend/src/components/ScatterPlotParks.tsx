import React from 'react';
import Plot from 'react-plotly.js';
import { ChartStyle } from './utils';
import { QualityD } from '../types/data';
import { title } from 'process';


interface ScatterPlotParksProp extends ChartStyle {
  data?: QualityD,
  title: string,
  xlabel: string,
  ylabel: string,

  feature1: string,
  feature2: string
}

const ScatterPlotParks = (props: ScatterPlotParksProp) => {


  // if (props.data) {
  //   console.log(props.data)
    
  //   const x_ent = Object.entries( props.data["VRCAR_2015-2019"])
  //   const x = x_ent.sort((k,v) => Number(k)).map((k,v) => k[1]);

  //   const y_ent = Object.entries(props.data["UNS_2015-2019"])
  //   const y = y_ent.sort((k,v) => Number(k)).map((k,v) => k[1])

  //   console.log(x)
  //   console.log(y)
  //   return (
  //     <Plot
  //       data={[
  //         {
  //           x: x,
  //           y:y,
  //           type: 'scatter',
  //           mode: 'markers',
  //           marker: {color: 'red'},
  //         }
  //       ]}
  //       layout={ {
  //         width: props.width, 
  //         height: props.height, 
  //         title: title} }
  //     />
  //   );
  //   return <div>loaded</div>
  // }
  return <div>Loading...</div>
}

export default ScatterPlotParks;
