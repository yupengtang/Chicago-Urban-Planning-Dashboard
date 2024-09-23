import React, { FC, useState } from "react";
import "./InputChoice.css"

type Props = {
  inputs: string[];
};

const InputChoiceComponent: FC<Props> = ({ inputs }) => {

  return (
    <p className="pred-text">
      Expected ratio of green area to total area: {inputs[0].slice(0, 2)[0]}% <br/>
      Number or parks required to build: {inputs[0].slice(0, 2)[1]}
    </p>

  );
};

export default InputChoiceComponent;

