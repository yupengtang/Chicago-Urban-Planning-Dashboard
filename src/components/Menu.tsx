import React, { Fragment, useState } from "react";

type tplotOptions = {
  [key: string]: string
}
const labels : tplotOptions = {
  "UNS_2015-2019": "Uninsured rate",
  // "CZH_2017": "Homicide (crimes)",
  "CZM_2017": "Major crime",
  "CZR_2017": "Robbery",
  "CZS_2017": "Criminal sexual assault",
  "CZV_2017": "Violent crime",
  "TRF_2017": "Traffic intensity",
  "CCG_2015-2019": "Lung cancer diagnosis rate per 100k",
  "CCR_2015-2019": "Cancer diagnosis rate per 100k",
  // "HCSATHP_2015-2017": "Adult asthma rate",
  // "HCSDIAP_2015-2017": "Adult diabetes rate",
  // "HCSHYTP_2015-2017": "Hypertension rate",
  "HCSOBP_2015-2017": "Adult obesity rate",
  "HCSOHSP_2015-2017": "Overall health status",
  "HCSNSP_2015-2017": "Neighborhood adult safety rate",
  "EDB_2015-2019": "High school graduation rate",
  "UMP_2015-2019": "Unemployment rate",
  "POV_2015-2019": "Poverty rate",
  // "HCSBD_2015-2017": "Count of adult binge drinking",
  "HCSFVP_2015-2017": "Adult fruit and vegetable servings rate",
  "HCSPAP_2015-2017": "Adult physical inactivity rate",
  "HCSSP_2015-2017": "Adult soda consumption rate",
  "VRDIDR_2015-2019": "Drug-induced mortality rate per 100k",
  "VRDO_2015-2019": "Drug overdose mortality rate per 100k",
  "VRSUR_2015-2019": "Suicide mortality rate per 100k",
  "VRCAR_2015-2019": "Cancer mortality rate per 100k",
  // "VRSTR_2015-2019 ": "Stroke mortality rate per 100k",
  "VRLE_2017": "Life expectancy",
  "POP_2015-2019": "Population",
  "CZD_2017": "Drug abuse",
  
}

export interface MenuStyle {
  callbackFunc: (vars: Array<[string, string]>) => void
}

const CheckboxMenu = (props: MenuStyle) => {
    const [checkboxes, setCheckboxes] = useState<Set<string>>(new Set());
    const [checkedCount, setCheckedCount] = useState(0);


    function handleSubmit(){
      props.callbackFunc(Array.from(checkboxes).map(d => [d, labels[d]]));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const checkboxId = event.target.id;
      const isChecked = event.target.checked;
      const items = checkboxes;
      if(isChecked) {
        if (checkedCount > 2){
          alert("You can't choose more than 3 features!");
          event.target.checked = false
          return 
        }
        setCheckedCount(checkedCount + 1);
        items?.add(checkboxId);
      } else {
        items.delete(checkboxId);
        setCheckedCount(checkedCount -1);
      }
      setCheckboxes(items);
      handleSubmit();
    };

   
    return (
      <Fragment>
          {
            Object.entries(labels).map(([key, value]) =>
              {

                return (
                  <label htmlFor={key} className="labels">
                    <div className="check-box-wrapper">
                      <input className="checker"
                        type="checkbox"
                        id={key}
                        onChange={handleChange}
                      />
                      <div className="check-label">
                        {value}
                      </div>
                    </div>
                  </label>  
                )
              })
            }
          
          {/* <div>
            <button
              className="w3-button w3-light-gray submit-button" 
              onClick={handleSubmit}>
                Submit
            </button>
          </div> */}

      </Fragment>
      
    );        
}


export default CheckboxMenu
