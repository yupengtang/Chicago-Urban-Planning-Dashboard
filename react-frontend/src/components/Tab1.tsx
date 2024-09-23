import React, { FC, Fragment } from "react";

import List from './List';
import MapChart from './getSimpleplot';
import { useState } from "react";
import InputChoiceComponent from "./InputChoice";
import "./InputChoice.css"
import ReturnPrediction from "./ReturnPrediction";
import Tooltip from '@mui/joy/Tooltip';
import ShapPlot from "./PredictionPlot";
import {Steps} from "intro.js-react";
import Qmark from "./question_mark.png"
import 'intro.js/introjs.css';

var i = 0 
const TabOne: FC = () => {
  const [inputs, setInputs] = useState<{}>(
    {
      "HCSOBP_2015-2017": "Adult obesity rate, 2015-2017",
      "DIS_2015-2019": "Disability, 2015-2019",
      "HCSOHSP_2016-2018": "Overall health status, 2015-2017",
      "HCSNSP_2016-2018": "Neighborhood adult safety rate, 2015-2017",
      "EDE_2015-2019": "College graduation rate, 2015-2019",
      "UMP_2015-2019": "Unemployment rate, 2015-2019",
      "HCSPAP_2015-2017": "Adult physical inactivity rate, 2015-2017",
      "LEQ_2015-2019": "Limited English proficiency, 2015-2019",
      "VRALR_2015-2019": "Alcohol-induced mortality rate per 100k, 2015-2019",
      "VRDIDR_2015-2019": "Drug-induced mortality rate per 100k, 2015-2019",
      "VRDO_2015-2019": "Drug overdose mortality rate per 100k, 2015-2019",
      "VRSUR_2015-2019": "Suicide mortality rate per 100k, 2015-2019",
      "VRCAR_2015-2019": "Cancer mortality rate per 100k, 2015-2019",
      "VRLE_2019": "Life expectancy, 2019",
      "POP_2015-2019": "Population, 2015-2019",
      "VRDI_2015-2019": "Diet-related mortality, 2015-2019"  
    }
  );

  const [selectedFeatures, setSelectedFeatures] = useState<string>("123");
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");

 
  function setSelectedFeaturesFunc(checkboxes: string) {
    setSelectedFeatures(checkboxes);
  }
  
  var setPredEnabled = () => {
    const listElement =  document && document.getElementById("list");
    const predElement =  document && document.getElementById("pred");
    if(listElement){
      listElement.style.display = 'block';
    }
    if(predElement){
      predElement.style.display = 'none'; 
    }
    if(mapElement){
      mapElement.style.display = 'block';
    }
    if(plotElement){
      plotElement.style.display = 'none';
    }
  };

  const handleChoicesMade = (values: Record<string, number>) => {
    console.log(values);
  };
  const [selectedRegionFromMap, setSelectedRegionFromMap] = useState<string>("");


  const handleMapClick = (community: string) => {
    console.log("Clicked on community:", community);
    setSelectedCommunity(community);
    setSelectedDropdown(community);
    setSelectedRegionFromMap(community);
  };

  const [selectedDropdown, setSelectedDropdown] = useState<string>('OHARE');
  


  function setSelectedDropdownFunc(dropdownStr: string) {
    setSelectedDropdown(dropdownStr);
  }

  

  const [enabled,setEnabled] = useState(true)
  const [initialStep,setInitialStep] = useState(0)
  
  const onExit = () => {
    setEnabled(false)  
  }


  const mapElement =  document && document.getElementById("map");
  const plotElement =  document && document.getElementById("plot");

  if(plotElement && i==0) {
    plotElement.style.display= 'none';
    i += 1
  }
  
  var x = 800;
  var y = 200;
  if(mapElement){
    mapElement.style.position = "absolute";
      mapElement.style.left = x + 'px';
      mapElement.style.top = y + 'px';
      mapElement.style.height = '55%';
      mapElement.style.width = '55%';
  }
  var setMapEnabled = () => {
    if(mapElement){
      mapElement.style.display = 'none';
    }
    if(plotElement){
      plotElement.style.display= 'block';    
    }
  };

  const [openModel, setOpenModel] = React.useState(false);

  const handleTooltipClose = () => {
    setOpenModel(false);
  };

  const handleTooltipOpen = () => {
    setOpenModel(true);
  };

  const [openShap, setOpenShap] = React.useState(false);

  const handleShapTooltipClose = () => {
    setOpenShap(false);
  };

  const handleShapTooltipOpen = () => {
    setOpenShap(true);
  };



  const steps = [
    {
      element: '#future_title',
      intro: 'This is the future tab where you can make predictions for the number of future parks to be built based on different features!',
      position: 'right',
      
    },
    {
      element: "#map",
      intro: 'You can explore current greening situation in the map.',
    },
    {
      element: '#future_features',
      intro: 'For the features you want to use in your prediction you can add value in blank box.',
    },
    {
      element: "#future_closebutton",
      intro: 'After that you can click the submit button to get the results. Then Shapley values plot will be shown, hover your mouse over the bar for details.',
    },
    {
      element: "#current_to_future",
      intro: 'If you want to go back to the current tab you can just click the button.',
      
    },
    {
    element: "#hint",
    intro: 'If you ever get tired of exploring the community areas just click on the banner :)',
    
    },
  ];


    return (
      <Fragment>
        <div className= "popups">
          {
          <Steps enabled = {enabled} 
            steps = {steps}
            initialStep = {initialStep}
            onExit = {onExit}
            options = {
              {
              doneLabel: "Done",
              dontShowAgain: true,
              dontShowAgainCookie:"cookie10",
              }
            }
          /> 
          }

        </div >
        <h1 id="future_title" className="h3_tabs"> Future situation in Chicago</h1>
        <p className="p_tabs">
          Plan how many parks to add and how big they should be.              
          <div>
          <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{"The prediction is done by XGBoost model."+ '\n' + 
                      "To read more about the model, follow the link!"} <p><a href="https://xgboost.readthedocs.io/en/stable/">XGBoost documentation</a></p></span>} placement="top" arrow onClose={handleTooltipClose} open={openModel === true}>
              <img className="question-mark" width="27" height="27" src={Qmark} onClick={handleTooltipOpen}/>
          </Tooltip>
          </div>
        </p>
        <hr/>
        <div id="hint" className="w3-row">
          
          <div id="future_features" className="w3-third">
            <div>
              <List 
              callbackFunc={setSelectedDropdownFunc}
              selectedCommunity={selectedCommunity}
              onMapClick={handleMapClick}
              selectedDropdown={selectedDropdown}
              selectedRegionFromMap={selectedRegionFromMap} 
              />
            </div>
            <div id="list">
              < InputChoiceComponent  inputs={inputs} 
                onInputsMade={handleChoicesMade} callbackFunc={setSelectedFeaturesFunc} dropdown={selectedDropdown}/>
            </div>
            <div id="pred" style={{display: "none"}}>
              <ReturnPrediction inputs={[selectedFeatures]}/>
              <button 
                className="close-button-future w3-button w3-red" 
                onClick={setPredEnabled}> Close
              </button>          
            </div>
          </div>

          <div className="w3-twothird"> 
            <div id = "map" >
              <MapChart callbackFunc={handleMapClick}/>
            </div>

            <div id = "plot">
             <ShapPlot id={"plot"} width={600} height={350}/>
             <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{"In the plot Shapley values for used features are displayed."+ '\n' + 
             "They define how much has each feature contributed to the prediction output value."}
                  <p><a href="https://shap.readthedocs.io/en/latest/example_notebooks/overviews/An%20introduction%20to%20explainable%20AI%20with%20Shapley%20values.html">To read more about Shapley values and how they are used for AI, follow this link!</a></p></span>} placement="top" arrow onClose={handleShapTooltipClose} open={openShap === true}>
              <img className="question-mark" width="27" height="27" src={Qmark} onClick={handleShapTooltipOpen}/>
              </Tooltip>
            </div>
  

          </div>
        </div>
        {/* <hr/>  */}
      </Fragment>
    );
  };
  export default TabOne;
