import React, { useState, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import "./Styling/Tags.css";
import Simulation from "./Simulation";
import {RenderedTagsContext} from "../App"
import Optimisation from "./Optimsation";
import RouteOptimisation from "./RouteOptimisation";
import FuelOptimisation from "./FuelOptimisation";
import CO2Optimisation from "./CO2Optimisation";
import PowerTrainOptimisation from "./PowerTrainOptimisation";
const ALL_TABS = {
  "Welcome":"Welcome Page",
  "Simulation":"Simulation",
  "Fuel":"Fuel Usage Optimisation",
  "Carbon":"CO₂ Emission Estimission",
  "PowerTrain":"Power Train Optimisation",
  "Route":"Route Optimisation",
  "Summary":"Summary Report"
}
const ALL_PANELS ={
  "Welcome":"Welcome Page",
  "Simulation":<Simulation></Simulation>,
  "Fuel":<FuelOptimisation></FuelOptimisation>,
  "Carbon":<CO2Optimisation></CO2Optimisation>,
  "PowerTrain":<PowerTrainOptimisation></PowerTrainOptimisation>,
  "Route":<RouteOptimisation></RouteOptimisation>
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
