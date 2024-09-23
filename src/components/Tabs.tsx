import React, { FC } from "react";
import "../App.css";

type TabsProps = {
  tabs: {
    label: string;
    index: number;
    Component: FC<{ index: number }>;
  }[];
  selectedTab: number;
  onClick: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/**
 * Avalible Props
 * @param className string
 * @param tab Array of object
 * @param selectedTab number
 * @param onClick Function to set the active tab
 * @param orientation Tab orientation Vertical | Horizontal
 */
const Tabs: FC<TabsProps> = ({
  className = "tabs-component w3-row",
  tabs = [],
  selectedTab = 0,
  onClick,
  orientation = "horizontal"
}) => {
  const Panel = tabs && tabs.find((tab) => tab.index === selectedTab);

  return (
    <div
      className={
        orientation === "vertical" ? className + " vertical" : className
      }
    >
      <div id="current_to_future" className="nav-b w3-col w3-bar-block w3-light-grey" >
        {/* <div role="tablist" aria-orientation={orientation}> */}
          {tabs.map((tab) => (
            <button 
              className= "w3-bar-item w3-button" 
              // {selectedTab === tab.index ? "active" : ""}
              onClick={() => onClick(tab.index)}
              key={tab.index}
              type="button"
              role="tab"
              aria-selected={selectedTab === tab.index}
              aria-controls={`tabpanel-${tab.index}`}

              tabIndex={selectedTab === tab.index ? 0 : -1}
              id={`btn-${tab.index}`}
            >
              {tab.label}
            </button>
          ))}
        {/* </div> */}
      </div>
      <div className="w3-container w3-rest"
        
          role="tabpanel"
          aria-labelledby={`btn-${selectedTab}`}
          id={`tabpanel-${selectedTab}`}
        >
          {Panel && <Panel.Component index={selectedTab} />}
        </div>
      </div>
  );
};
export default Tabs;
