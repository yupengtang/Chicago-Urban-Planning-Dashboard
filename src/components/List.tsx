import React, { useState, useEffect } from "react";
import DropDown from "./Dropdown";
import './List.css';

export interface ListStyle {
  callbackFunc: (vars: string) => void;
  selectedCommunity: string;
  onMapClick: (community: string) => void;
  selectedDropdown: string;
  selectedRegionFromMap: string; // New prop
}

const List = (props: ListStyle) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectRegion, setSelectRegion] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>(props.selectedDropdown);
  const [selectedCommunity, setSelectedCommunity] = useState<string>(props.selectedCommunity);

  const regions = () => {
    return ["ALBANY PARK", "ARCHER HEIGHTS", "ARMOUR SQUARE", "ASHBURN", "AUBURN GRESHAM",
     "AUSTIN", "AVALON PARK", "AVONDALE", "BELMONT CRAGIN", "BEVERLY", "BRIDGEPORT", "BRIGHTON PARK",
      "BURNSIDE", "CALUMET HEIGHTS", "CHATHAM", "CHICAGO LAWN", "CLEARING", "DOUGLAS", "DUNNING",
       "EAST GARFIELD PARK", "EAST SIDE", "EDGEWATER", "EDISON PARK", "ENGLEWOOD", "FOREST GLEN",
        "FULLER PARK", "GAGE PARK", "GARFIELD RIDGE", "GRAND BOULEVARD", "GREATER GRAND CROSSING",
         "HEGEWISCH", "HERMOSA", "HUMBOLDT PARK", "HYDE PARK", "IRVING PARK", "JEFFERSON PARK",
          "KENWOOD", "LAKE VIEW", "LINCOLN PARK", "LINCOLN SQUARE", "LOGAN SQUARE", "LOOP",
           "LOWER WEST SIDE", "MCKINLEY PARK", "MONTCLARE", "MORGAN PARK", "MOUNT GREENWOOD",
            "NEAR NORTH SIDE", "NEAR SOUTH SIDE", "NEAR WEST SIDE", "NEW CITY", "NORTH CENTER",
             "NORTH LAWNDALE", "NORTH PARK", "NORWOOD PARK", "OAKLAND", "OHARE", "PORTAGE PARK",
              "PULLMAN", "RIVERDALE", "ROGERS PARK", "ROSELAND", "SOUTH CHICAGO", "SOUTH DEERING",
               "SOUTH LAWNDALE", "SOUTH SHORE", "UPTOWN", "WASHINGTON HEIGHTS", "WASHINGTON PARK",
                "WEST ELSDON", "WEST ENGLEWOOD", "WEST GARFIELD PARK", "WEST LAWN", "WEST PULLMAN",
                 "WEST RIDGE", "WEST TOWN", "WOODLAWN"];
  };

  /**
   * Toggle the drop down menu
   */
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  useEffect(() => {
    if (props.selectedCommunity !== selectedCommunity) {
      setSelectedCommunity(props.selectedCommunity);
    }
    if (props.selectedRegionFromMap !== selectedRegion) { // Update selectedRegion state from prop
      setSelectedRegion(props.selectedRegionFromMap);
    } else if (props.selectedDropdown) {
      setSelectedRegion(props.selectedDropdown);
    }
  }, [props.selectedDropdown, props.selectedCommunity, props.selectedRegionFromMap]); // Include selectedRegionFromMap prop in the dependency array

  const regionSelection = (region: string): void => {
    setSelectRegion(region);
    setSelectedRegion(region);
    props.callbackFunc(region);
    props.onMapClick(region);
  };

  return (
    <>
      <div className="w3-dropdown-hover select_region">
        <button
          className={showDropDown ? "select_region_size active w3-button w3-light-gray" : "select_region_size w3-button w3-light-gray"}
          onClick={toggleDropDown}
        >
          {selectedRegion ? selectedRegion : props.selectedDropdown || "Select a region"}
        </button>

        <div className="select_region_size w3-dropdown-content w3-bar-block w3-border">
          {showDropDown && (
            <DropDown
              regions={regions()}
              showDropDown={false}
              toggleDropDown={toggleDropDown}
              regionSelection={regionSelection}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default List;
