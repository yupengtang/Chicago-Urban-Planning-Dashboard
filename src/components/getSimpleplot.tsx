import React, { useEffect, useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import "./getSimpleplot.css"
import { scaleQuantile } from "d3-scale";
import { getPointsFromBackend } from "../router/resources/data";
import LinearGradient from './LinearGradient';
import Tooltip from '@mui/joy/Tooltip';

const COLOR_RANGE = [
  "#9ECB61",
  "#94C755",
  "#88C449",
  "#7DC03E",
  "#70BD32",
  "#63B927",
  "#56B61B",
  "#32A11B",
  "#1A8D1F",
  "#197932",
  "#17663C"
];

export interface MapStyle {
  callbackFunc: (community: string) => void
}

interface DataItem {
  id: string;
  total_sqft: number;
  [key: string]: any; 
}

const MapChart = (props: MapStyle) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [openTooltip, setOpenTooltipValue] = useState<boolean>();
  const [open, setOpen] = React.useState(false);

  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: '0.16 mil ft\u00B2',
    max: '55 mil ft\u00B2'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getPointsFromBackend("train_data");
        if (Array.isArray(fetchedData)) {
          setData(fetchedData);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const colorScale = scaleQuantile<string>()
    .domain(data.map((d) => d.TOTAL_VEGETATED_SQFT))
    .range(COLOR_RANGE);

  const handleMouseClick = (current?: DataItem) => {
    if (current) {
      const { community } = current;
      setTooltipContent("Community area name: " + current.community + '\n' +
      "Total green area (in sq.ft): " + parseInt(current.TOTAL_VEGETATED_SQFT) + '\n' + 
      "No. of parks: " + current['Park Count']);
      setOpenTooltipValue(openTooltip === true);
      props.callbackFunc(community);
    }
  };

  const handleMouseEnter = (current?: DataItem) => {
    if (current) {
      setTooltipContent("Community area name: " + current.community);
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };


  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  

  return (
    <div>
      <Tooltip open={openTooltip === false} arrow placement="top-start" onClose={handleClose} 
        disableFocusListener disableHoverListener disableTouchListener
          title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipContent}</span>} followCursor={true} variant="soft" color="success" size="md">
            <Tooltip open={false} arrow placement="top-start" onOpen={handleOpen}
          title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipContent}</span>} followCursor={true} variant="soft" color="success" size="md">
        <ComposableMap className="MapChart" projection="geoMercator" projectionConfig={{ center: [-87.6298, 41.8781], scale: 60000 }}>
          <Geographies geography="/Features.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const current = data.find((s) => s.community === geo.properties.community);
                const fill = current ? colorScale(current.TOTAL_VEGETATED_SQFT) : "#56B61B";
                return (
                  <Geography
                    key={geo.rsmKey}
                    stroke="#D4FFB9"
                    geography={geo}
                    style={{
                      default: {
                        fill: fill,
                        outline: "none"
                      },
                      hover: {
                        fill: "#87CF5A",
                        transition: "all 250ms",
                        outline: "none"
                      },
                      pressed: {
                        fill: "#9BEB69",
                        outline: "none"
                      }
                    }}
                    onMouseEnter={() => handleMouseEnter(current)}
                    onClick={() => handleMouseClick(current)}
                    onMouseLeave={handleMouseLeave}
                    data-tip={tooltipContent}
                    data-iscapture="true"
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        </Tooltip>
        </Tooltip>
        <LinearGradient data={gradientData} />
    </div>
  );
};



export default MapChart; 
