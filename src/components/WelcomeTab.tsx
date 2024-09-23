
import React, { Component } from "react";
import "./WelcomeTab.css"
import Tree from "./tree.png"



export default class WelcomeTab extends Component {

  render() {
    return (
      <div className="home">
          {/* <div className="w3-row home-block">
            <div className="w3-col   info-box">
              <h1 className="welcome-message">Welcome to Chicago Urban Planning!</h1>
            </div>
          </div> */}

          <div className="w3-row home-block">

            <div className="w3-col m3">
              {/* <!-- https://codepen.io/t_afif/pen/JjyPXoB --> */}
              <div className="info-img ">

                <div className="growing"></div>
              </div>
            </div>

            <p className="first-header w3-col m9  info-box"> ⛳ Here you can find and useful information related to parks in Chicago by
              community area! </p>
          </div>

          <div className="w3-row home-block">

            <p className="second-header w3-col m9 info-box"> If you want to find out how to explore each community area and how to
              predict
              number
              of parks click the
              button below 😀</p>
            <div className="w3-col m3">
              <img className="info-img" src={Tree}/>
            </div>

          </div>

          <div className="w3-row home-block">
          <div className="w3-col m4"> <hr />  </div>
            <div className="w3-col m4">
              <a href="/Tabs">
                <button className="welcome-button w3-button w3-light-gray " > Lets start </button>
              </a>
            </div>
            <div className="w3-col m4">
              <div className="container">
                {/* <!-- https://codepen.io/Akasj/pen/QWKpyMm --> */}
                <div className="body"></div>
                <div className="mouth"></div>
                <div className="beak"></div>
                <div className="feather"></div>
                <div className="tail"></div>
                <div className="leg"></div>
              </div>
            </div>

          </div>
          


{/* 
          <div className="text welcome-text w3-container"> 
            <p> &#9971;	Here you can find and useful information related to parks in Chicago by community area. </p> 
            <p>	&#9971; If you want to find out how to explore each community area and how to predict number of parks click the button bellow &#128512;</p>
          </div> 
          <div className="w3-container">
            <img className="WelcomeTree" src={Tree} alt="Image" />
          </div>
          <div className="w3-container">
              <a href="/Tabs">
                  <button className="w3-button w3-light-gray welcome-button">  Click here to start</button>
              </a>
          </div> */}
      </div>
    );
  }
};