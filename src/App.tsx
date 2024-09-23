import React, { useEffect } from 'react';
import './App.css';
import { useState } from 'react';
import Tabs from './components/Tabs';
import TabOne from './components/Tab2';
import TabTwo from './components/Tab1';
import { BrowserRouter as Router } from 'react-router-dom';
import { getPointsFromBackend } from './router/resources/data';
import 'intro.js/introjs.css';
import WelcomeTab from './components/WelcomeTab';
import {  Route,Routes } from "react-router-dom";

declare var particles:any;

function App():  JSX.Element {
  
  type TabsType = {
    label: string;
    index: number;
    Component: React.FC<{}>;
  }[];

  const tabs: TabsType = [
   
    {
      label: "Current",
      index: 1,
      Component: TabOne
    },
    {
      label: "Future",
      index: 2,
      Component: TabTwo
    }
  ];

  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);

  const [parks, setParks] = useState<[]>();

  useEffect(() => {
    getPointsFromBackend('parks').then(parks => {
      setParks(parks);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header" onClick={() => particles.init("background")}>  Chicago Urban Planning
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomeTab />} />
          <Route path="/Tabs" element={<Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs}/>} />
          
        </Routes>
      </Router>
      <div id='background'></div>
    </div>
  );
}

export default App;
