import React, { Fragment } from "react";
import List from './List';

import { useEffect, useState } from 'react';
import CheckboxMenu from './Menu';
import { getPointsFromBackend } from "../router/resources/data";
import { FeatureD, QualityArray } from "../types/data";
import Tooltip from '@mui/joy/Tooltip';
import ScatterPlot from "./ScatterPlot";
import MapChart from "./getSimpleplot";
import { Steps } from "intro.js-react";
import Qmark from "./question_mark.png"
import 'intro.js/introjs.css';


var i = 0;

function TabTwo(): JSX.Element {
  const [features, setFeatures] = useState<FeatureD>();

  useEffect(() => {
    getPointsFromBackend('features').then(f => {
      setFeatures(f);
    });
  }, []);
  

  const [lifeQuality, setLifeQuality] = useState<QualityArray>();
  const [selectedDropdown, setSelectedDropdown] = useState<string>('OHARE');
  const [selectedFeatures, setSelectedFeatures] = useState<[string, string][]>([]);

  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [selectedRegionFromMap, setSelectedRegionFromMap] = useState<string>("");

  function setSelectedFeaturesFunc(checkboxes: Array<[string, string]>) {
    setSelectedFeatures(checkboxes);


    // call over an show plot
    // const plotElement =  document && document.getElementById("plots");
    
    const mapElement =  document && document.getElementById("map");
    if(mapElement){

      if(checkboxes.length > 0){
        mapElement.style.display = 'none';
      }
      else {
  
        mapElement.style.display = 'block';
      }
    }
    // if(plotElement){
    //   plotElement.style.display= 'block';
    // }
  }

  // const [selectedDropdown, setSelectedDropdown] = useState<string>('Select a region');


  function setSelectedDropdownFunc(dropdownStr: string) {
    setSelectedDropdown(dropdownStr);
  }

  const mapElement = document && document.getElementById("map");
  const plotElement = document && document.getElementById("plots");

  // if (plotElement && i == 0) {
  //   plotElement.style.display = 'none';
  //   i += 1
  // }
  var x = 800;
  var y = 250;
  if(mapElement){
    mapElement.style.position = "absolute";
      mapElement.style.left = x + 'px';
      mapElement.style.top = y + 'px';
      mapElement.style.height = '55%';
      mapElement.style.width = '55%';
  }

  var setMapEnabled = () => {
    if (mapElement) {
      mapElement.style.display = 'block';
    }
    if (plotElement) {
      plotElement.style.display = 'none';
    }
  };

  var getWidth = (nEl: number) => {
    const el = document.getElementById('plots')
    if (el)
      return el.offsetWidth / nEl
    else return 400
  }

  const handleMapClick = (community: string) => {
    console.log("Clicked on community:", community);
    setSelectedCommunity(community);
    setSelectedDropdown(community);
    setSelectedRegionFromMap(community);
  };

  useEffect(() => {
    getPointsFromBackend('life_quality').then(lifeQuality => {
      setLifeQuality(lifeQuality);
    });
  }, []);

  const [enabled, setEnabled] = useState(true)
  const [initialStep, setInitialStep] = useState(0)

  const onExit = () => {
    setEnabled(false)
  }

  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };


  const steps = [
    {
      element: '#welcome',
      intro: 'Welcome to our Urban planning app! Here you can find more information about the green areas in Chicago, but also you can plan the building of new parks based on different features.Follow along the tutorial so you can use the app in the best possible way!',
      position: 'center',
    },
    {
      element: '#current_title',
      intro: 'This is the current tab where you can explore the green areas in Chicago based on community areas.',
    },
    {
      element: '#current_comareas',
      intro: 'From the drop down menu or the map you can choose the community area, in which you are interested. Click on map community area for more details about it.',
    },
    {
      element: "#current_checkbox",
      intro: 'Then you can choose features by clicking the checkboxes to explore the community area that you are interested in.',
    },
    {
      element: "#current_to_future",
      intro: 'If you want to go to the future tab you can just click the button "Future".',

    },
  ];

  return (
    <Fragment>
      {<Steps
        enabled={enabled}
        steps={steps}
        initialStep={initialStep}
        onExit={onExit}
        options={{
          dontShowAgain: true,
          dontShowAgainCookie: "cookie11",

        }}

      />
      }

      <h3 id="current_title" className="h3_tabs">Current situation in Chicago</h3>
      <p className="p_tabs">
        Explore living situations and green zones in Chicago's community areas. 
        Select which metrics you want to visialize. 
        You can also use map to get basic information on Chicago ⛳ and its community areas. 

        <div>
          <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{"This map displays Chicago community areas by their total green area." + '\n' + 
                "The darker green area is, the more total green area has this community."}</span>} placement="top" arrow onClose={handleTooltipClose} open={open}>
              <img className="question-mark" width="27" height="27" src={Qmark} onClick={handleTooltipOpen}/>
          </Tooltip>     
        </div>
      </p>
      <hr />
      <div className="w3-row">
        <div className="w3-third">
          <div className = "w3-col s7">
            <List 
            callbackFunc={setSelectedDropdownFunc}
            selectedCommunity={selectedCommunity}
            onMapClick={handleMapClick}
            selectedDropdown={selectedDropdown}
            selectedRegionFromMap={selectedRegionFromMap} 
            />
          </div>
          <div className = "w3-col s12">

            <CheckboxMenu callbackFunc={setSelectedFeaturesFunc} />
          </div>
        </div>


        <div className="w3-twothird">
          <div id="map">
            <MapChart  callbackFunc={handleMapClick}/>       
          </div>

        <div id="plots">
          <div className="w3-cell-row">
            
            {
              selectedFeatures.map((val, idx) => (
                <>
                  <div id={"plot" + idx} className="w3-cell">
                    <div>{val[1]}</div>
                    <ScatterPlot id={"plot" + idx} width={getWidth(selectedFeatures.length)} height={300} feature={val[0]} park={selectedDropdown} />
                    {/* <ScatterPlot id={"plot" + idx} width={getWidth(selectedFeatures.length)} height={250} feature={val[0]} park={selectedDropdown} /> */}
                    {/* <GroupedPlot id={"plot" + idx} width={getWidth(selectedFeatures.length)} height={250} feature={val[0]} park={selectedDropdown} /> */}
                    {/* <BarPlot id={"plot" + idx} width={getWidth(selectedFeatures.length)} height={250} feature={val[0]} park={selectedDropdown} /> */}
                  </div>
                </>
              ))
            }
          </div>
          {/* <button
              className="close-button w3-button w3-red"
              onClick={setMapEnabled}> Close
            </button> */}
        </div>
        </div>
      </div>
      {/* <hr /> */}
    </Fragment>
  );

};
export default TabTwo;
