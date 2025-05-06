import React , {useContext, useState}from "react";
import Loading from "./Loading";
import "./Styling/SideMenuBar.css"
import {SetRenderedTagsContext} from "../App"
/**
  <button className={togSimBtn? "selected-btn " : "normal-btn"} onClick={toggleSimulation}>Single Simulation</button>
  <button className={togFuelBtn? "selected-btn " : "normal-btn"} onClick={toogleFuelUsageOptimisation}>Fuel Usage Optimisation</button>
  <button className={togCarbonBtn? "selected-btn " : "normal-btn"} onClick={toggleCarbonDioxideOptimisation}>Carbon Dioxide Emission Optimisation</button>
  <button className={togRouteBtn? "selected-btn " : "normal-btn"} onClick={toggleRouteOptimisation}>Route Optimisation</button>
  <button className={togPwrBtn? "selected-btn " : "normal-btn"} onClick={togglePowertrainOptimisation}>Power Train Optimisation</button>
  <button className={toggResBtn? "selected-btn " : "normal-btn"} onClick={toggleSlowSteaming}>Slow Steaming</button>
*/
const SideMenuBar =()=>{
  const setRenderList = useContext(SetRenderedTagsContext);
  const [toggleSimulationCollection, setSimulationToggleCollection] = useState(false);
  const [toggleOptimisationCollecton, setOptimisationToggleCollection] = useState(false);
  const [togSimBtn, setTogSimBtn] = useState(false);
  const [togFuelBtn, setTogFuelBtn] = useState(false);
  const [togCarbonBtn, setTogCarBtn] = useState(false);
  const [togPwrBtn, setTogPwrBtn] = useState(false);
  const [togRouteBtn, setTogRouteBtn] = useState(false);
  const [togSlowSteamBtn, setTogSlowSteamBtn] =useState(false);
  const [toggResBtn, setTogResBtn] = useState(false);

  const [toggleTechOptimisation, setTogTechOptimisation] = useState(false);
  const [toggleOperationalOptimisation, setTogOperationalOptimisation] = useState(false);
  const toggleSimulationSelection =()=>{
    setSimulationToggleCollection(!toggleSimulationCollection);
    setOptimisationToggleCollection(false);
    setTogTechOptimisation(false);
    setTogOperationalOptimisation(false);
  }
  const toggleOptimisationSelection=()=>{
    setOptimisationToggleCollection(!toggleOptimisationCollecton);
    setSimulationToggleCollection(false);
    setTogSimBtn(false);
    setTogFuelBtn(fasle);
    setTogCarBtn(false);
    setTogPwrBtn(false);
    setTogRouteBtn(false);
    setTogSlowSteamBtn(false);
  }
  const renderSimulationButtonSet=()=>{
      return(
        <>
          <button className={togSimBtn? "selected-btn " : "normal-btn"} onClick={toggleSimulation}>Single Simulation</button>
          <button className={togFuelBtn? "selected-btn " : "normal-btn"} onClick={toogleFuelUsageOptimisation}>Fuel Usage Optimisation</button>
          <button className={togCarbonBtn? "selected-btn " : "normal-btn"} onClick={toggleCarbonDioxideOptimisation}>Carbon Dioxide Emission Optimisation</button>
          <button className={togPwrBtn? "selected-btn " : "normal-btn"} onClick={togglePowertrainOptimisation}>Power Train Optimisation</button>
        </>
      )
  }
  const renderOptimisationButtonSet =()=>{
      return(
        <>
          <button className={toggleTechOptimisation? "selected-btn " : "normal-btn"} onClick={toggleSimulation}>Technical Optimisation</button>
          <button className={toggleOperationalOptimisation? "selected-btn " : "normal-btn"} onClick={toggleSimulation}>Operational Optimisation</button>
        </>
      )

  }
  const selectTechOptimisation =()=>{
    setRenderList("TechOpt");
    setTogTechOptimisation(!toggleTechOptimisation);
  }
  const selectOperationOptimisation =()=>{
    setRenderList("OprOpt");
    setTogOperationalOptimisation(!toggleOperationalOptimisation);
  }
  const toggleSimulation = ()=>{
    setRenderList("Simulation");
    setTogSimBtn(!togSimBtn);
  }
  const toogleFuelUsageOptimisation =()=>{
    setRenderList("Fuel");
    setTogFuelBtn(!togFuelBtn);
  }
  const toggleCarbonDioxideOptimisation =()=>{
    setRenderList("Carbon");
    setTogCarBtn(!togCarbonBtn);
  }
  const togglePowertrainOptimisation =()=>{
    setRenderList("PowerTrain");
    setTogPwrBtn(!togPwrBtn);
  }
  const toggleRouteOptimisation =()=>{
    setRenderList("Route");
    setTogRouteBtn(!togRouteBtn);
  }
  const toggleSlowSteaming =() =>{
    setRenderList("SlowSteaming");
    setTogSlowSteamBtn(!togSlowSteamBtn);
  }
  const toggleResultSummary=()=>{
    setRenderList("Summary");
    setTogResBtn(!toggResBtn);
  }
  const vessel_info_form =()=>{
    return(
      <>
        <div className="input-group">
          <label htmlFor="vessel-name">Vessel Name</label>
          <input type="text" id="vessel-name" placeholder="Enter Vessel Name" />
        </div>
        <div className="input-group">
          <label htmlFor="vessel-owner">Vessel Owner</label>
          <input type="text" id="vessel-owner" placeholder="Enter Vessel Owner" />
        </div>
        <div className="input-group">
          <label htmlFor="vessel-built-year">Vessel Built Year</label>
          <input type="number" id="vessel-built-year" placeholder="Enter Built Year" />
        </div>
        <div className="input-group">
          <label htmlFor="displacement">Displacement</label>
          <input type="text" id="displacement" placeholder="Enter Displacement" />
        </div>
        <div className="input-group">
          <label htmlFor="width">Width</label>
          <input type="text" id="width" placeholder="Enter Width" />
        </div>
        <div className="input-group">
          <label htmlFor="length">Length</label>
          <input type="text" id="length" placeholder="Enter Length" />
        </div>
        <div className="input-group">
          <label htmlFor="num-propeller">Number of Propeller</label>
          <input type="number" id="num-propeller" placeholder="Enter Number" />
        </div>
      </>
    )
  }
  return(
    <div className="SideMenuBar">
      <Loading></Loading>
      <div className="buttopn-group">
        <button className={togSimBtn? "selected-btn " : "normal-btn"} onClick={toggleSimulation}>Run Simulation</button>
      </div>
      <div className="SideMenuBar-vesInfoInput">
        <p>Input Basic Vessel Information</p>
      </div>
      <div className="vessel-info-input">
        {vessel_info_form()}
      </div>
      <div className="SidMenuBar-title">
        <p>Choose one of the following optimisations</p>
      </div>
      <div className="buttopn-group">
        {/**
          <button className={toggleSimulationCollection? "selected-btn " : "normal-btn"} 
          onClick={toggleSimulationSelection}>Other Simulation PLaceholder</button>
          {toggleSimulationCollection && renderSimulationButtonSet()}
         */}
        <button className={toggleOperationalOptimisation? "selected-btn " : "normal-btn"} onClick={selectOperationOptimisation}>Operational Optimisation</button>
        <button className={toggleTechOptimisation? "selected-btn " : "normal-btn"} onClick={selectTechOptimisation}>Technical Optimisation</button>
      </div>
    </div>
  )
}
export default SideMenuBar