import React, { FC, useState } from "react";
import "./InputChoice.css"
import { getPointsFromBackend } from "../router/resources/data";
import { PredD } from "../types/data";

type Props = {
  onInputsMade: (inputs: Record<string, number>) => void;
  inputs: {};
  callbackFunc: (vars: string) => void
  dropdown: string
};

const InputChoiceComponent: FC<Props> = ({onInputsMade, inputs, callbackFunc, dropdown}) => {
  const [values, setValues] = useState<Record<string, number>>({});

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newValue = Number(value);
    if (newValue >= -1000000.0 && newValue <= 1000000.0) {
      setValues((prevValues) => ({
         ...prevValues,
        [name]: Number(value),
      }));
    } 
  };
  const [pred, setPred] = useState<PredD>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onInputsMade(values);
    console.log("Submitted")
    console.log(values)

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
    var a = ""
    for (let i = 0; i < features.length; i++) {
      if (values[features[i]] !== undefined) {
        a = a + '@' + String(values[features[i]])
      } else {
        a = a + '@' + "0"
      }
    }

    getPointsFromBackend('prediction/' + dropdown + a).then((x) => {
      console.log(x)
      callbackFunc((x as unknown as PredD).value)
    })
    
    // call over to show prediction
    const listElement =  document && document.getElementById("list");
    const predElement =  document && document.getElementById("pred");
    const plotElement =  document && document.getElementById("plot");
    const mapElement =  document && document.getElementById("map");

    if(listElement){
        listElement.style.display = 'none';
    }

    if(mapElement){
      mapElement.style.display = 'none';
  }
  
    if(predElement){
        predElement.style.display= 'block';
    }

    if(plotElement){
      plotElement.style.display= 'block';
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      {
      Object.entries(inputs).map(([key, value]) =>
        {
          return <div key={key}>
            <div className="info">
              <input
                type="number"
                name={key}
                id={key}
                value={values[key] || ""}
                onChange={handleValueChange}
                min={0.0}
                max={1.0}
                step={0.1}/>
            </div>
            <label>{value + "      "}</label>
          </div>
        })
      }

      <div>
        <button type="submit" id= "future_closebutton"
          className="w3-button w3-light-gray submit-button">
          Submit
        </button>
      </div>
    </form>
  );
};

export default InputChoiceComponent;

