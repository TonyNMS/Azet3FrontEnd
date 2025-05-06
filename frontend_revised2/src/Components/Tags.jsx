import React, { useState, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import "./Styling/Tags.css";
import Simulation from "./Simulation";
import {RenderedTagsContext} from "../App"

import RouteOptimisation from "./RouteOptimisation";
import FuelOptimisation from "./FuelOptimisation";
import CO2Optimisation from "./CO2Optimisation";
import PowerTrainOptimisation from "./PowerTrainOptimisation";
import SlowSteam from "./SlowSteam";
import TechOptiTabs from "./TechOptimisation/TechOptiTabs";
import OperationalOptTags from "./OperationalOptimisation/OperationalOptTags";

const ALL_TABS = {
  "Welcome":"Welcome Page",
  "Simulation":"Simulation",
  "Fuel":"Fuel Usage Optimisation",
  "Carbon":"CO₂ Emission Estimission",
  "PowerTrain":"Power Train Optimisation",
  "Route":"Route Optimisation",
  "SlowSteaming":"Slow Steaming",
  "Summary":"Summary Report",
  "TechOpt":"Technical Optimisation",
  "OprOpt" :"Operation Optimisation"
}
const ALL_PANELS ={
  "Welcome":"Welcome Page",
  "Simulation":<Simulation></Simulation>,
  "Fuel":<FuelOptimisation></FuelOptimisation>,
  "Carbon":<CO2Optimisation></CO2Optimisation>,
  "PowerTrain":<PowerTrainOptimisation></PowerTrainOptimisation>,
  "SlowSteaming":<SlowSteam></SlowSteam>,
  "Route":<RouteOptimisation></RouteOptimisation>,
  "OprOpt":<OperationalOptTags></OperationalOptTags>,
  "TechOpt": <TechOptiTabs></TechOptiTabs>,
  
}
const Tags = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const renderedList = useContext(RenderedTagsContext);
  const renderTabs =()=>{
    return(
      <>
        {renderedList.map((item)=><Tab>
          {ALL_TABS[item]}
        </Tab>)}
      </>
    )
  }
  const renderTabPanels=()=>{
    return(
      <>
        {renderedList.map((item, index)=>
          <TabPanel>
            {tabIndex === index ? ALL_PANELS[item]: null}
          </TabPanel>
        )}
      </>
    )
  }
  return (
    <div className="tags-section">
      <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
        <TabList>
          {renderTabs()}
        </TabList>
        {renderTabPanels()}
      </Tabs>
    </div>
  );
};

export default Tags;
