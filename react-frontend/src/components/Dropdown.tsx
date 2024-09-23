import React, { useEffect, useState } from 'react';
import './Dropdown.css';


type DropDownProps = {
  regions: string[];
  showDropDown: boolean;
  toggleDropDown: Function;
  regionSelection: Function;
};


const DropDown: React.FC<DropDownProps> = ({
  regions,
  regionSelection,
}: DropDownProps): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false)
/** 
    @param regions
*/

  
  function onClickHandler(region: string): void {
    regionSelection(region);
  }

  useEffect(() => {
    setShowDropDown(showDropDown)
  }, [showDropDown]);

  return (
    <>
      {/* <div className={showDropDown ? 'dropdown' : 'dropdown active'}> */}
        {regions.map(
          (region: string, index: number): 
          JSX.Element => {
           return (
              <a
                className="w3-bar-item w3-button"
                key={index}
                onClick={(): void => {
                  onClickHandler(region);
                }}
              >
                {region}
              </a>
            );
         }
        )}
      {/* </div> */}
    </>
  );
};

export default DropDown;
