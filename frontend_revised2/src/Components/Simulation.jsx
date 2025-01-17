import React, { useContext, useState } from "react";
import ParameterList from "./ParameterList";
import axios from "axios";
import {ChangedParameterContext, ModelInfoContext, ResetChangedParameterContext, ResultsContext, UpdateChangedParameterContext, UpdateResultContext} from "../App";
import Plotter from "./Plotter";
import ResultTableDisplay from "./ResultTableDisplay";
const Simulation =()=>{
    const modelName = useContext(ModelInfoContext);
    const updateResultCollection = useContext(UpdateResultContext);
    const changedParameters = useContext(ChangedParameterContext);
    const resetChangedParameterArray = useContext(ResetChangedParameterContext);
    const updateChangedParametersArray = useContext(UpdateChangedParameterContext);  
    const result =useContext(ResultsContext); 
    const [inputText, setInputText] = useState("");
    const [checkedInterval, setCheckInterval] = useState(false);
    const [avalibleSimDetails, setAvalibleSimDetail] = useState([]);
    const [simulatioName, setSimulationName] = useState('');
    const [openAdvOption, setopenAdvOption] = useState(false);
    const [openHybOption, setOpenHyboption] = useState(false);
    let inputHandeler =(e)=>{
        setInputText(e.target.value);
    };
    const handleToggleInterval = ()=>{
        setCheckInterval(!checkedInterval);
    };
    const handelSimulationName = (e)=>{
        result.some(item=>item.param === e)? alert("Input Name Exist, Use Another One") : setSimulationName(e);
    }
    const renderAdvanceOption =()=>{
        return (
        openAdvOption ? (
             (
                <>
                    <button value = {0} onClick={(e)=>changePriorityParam(e)}>Fuel Cell Priority</button>
                    <button value = {1} onClick={(e)=>changePriorityParam(e)}>Diesel Generator Prioroity</button>
                    <button value = {2} onClick={toggleConstHybBtn}>Constant Hybrid Options</button>
                </>
            )
        ): null)
    }
    const renderHybridoptions =()=>{
        return (
            openHybOption ? (
                <>  
                    <div><input type="number" placeholder="% share of Load Power for Generator"></input></div>
                    <div><input type="number" placeholder="% share of Load Power for Fuel Cell"></input></div>
                </>
            ): null)
    }
    const handleRecordingSimParam  = () =>{
        setAvalibleSimDetail([...avalibleSimDetails, {"name":simulatioName, "changedParam":changedParameters}]);
    }
    const handelSimulation =()=>{
        if(modelName ==='' || simulatioName ===''){
            alert("Can not proceed simulation: Model Name or Simulation Name not exist, or Simulation Name exist already");
            return;
        }else{
            handleRecordingSimParam();
            axios.post('http://127.0.0.1:5000/model/simulate', {
                model_name : modelName,
                overrides : changedParameters
            }).then(response =>{
                updateResultCollection({"sim_name" :simulatioName, "data":response.data.result});
                console.log("simulation successful");
            }).catch(error=>{
                console.log('Error During Simulation:', error);
                alert(`Simualtion Failed, Check the following error, ${error}`)
            });
        }
        resetChangedParameterArray();
        setSimulationName('');
    };
    const changeParameter = (parameterName)=>{
        console.log("New Change in SimParameter Registered");
        updateChangedParametersArray({param:parameterName, value: document.getElementById(parameterName).value,})
    };
    const changePriorityParam = (priorityValue)=>{
        console.log("New Change in PoriorityParameter Registered");
        updateChangedParametersArray({param:"mCtlr_PirorityAssignement", value:priorityValue.target.value});
    };
    const togglePiroBtn = ()=>{setopenAdvOption(!openAdvOption)};
    const toggleConstHybBtn = ()=>{setOpenHyboption(!openHybOption)};

    const testSimParamRecord = [
        {"name":"Sim1", "changedParam":[{param:"param1", value:1},{param:"param2", value:2}]},
        {"name":"Sim2", "changedParam":[{param:"param3", value:3},{param:"param4", value:4}]}
    ]
    return(
        <div>
            <div className="component-param">
                <h4>All Componenet Parameters</h4>
                <div className = "quick_access_panel">
                    <button value={"generator"} onClick={e=>inputHandeler(e)}>Generator</button>
                    <button value={"fuel_"} onClick={e=>inputHandeler(e)}>Fuel</button>
                    <button value={"fuelCell"} onClick={e=>inputHandeler(e)}>FuelCell</button>
                    <button value={"fuel_tank"} onClick={e=>inputHandeler(e)}>Fuel Tank</button>
                    <button value={"hydrogen_tank"} onClick={e=>inputHandeler(e)}>Hydrogen Tank</button>
                    <button value={"battery"} onClick={e=>inputHandeler(e)}>Battery</button>
                    <button value={""} onClick={e=>inputHandeler(e)}> Show All</button>
                </div>
                <div className = "advance-option">
                    <button onClick={togglePiroBtn}>Priority Assignment</button>
                    {renderAdvanceOption()}
                    {renderHybridoptions()}
                </div>
                <div className ="search">
                    <input type ='search' onChange = {inputHandeler} placeholder="Search a Parameter"></input>
                </div>
                <ParameterList input = {inputText}></ParameterList>
            </div>

            <div className="sim-param">
                <h4>Simulation Parameters Section</h4>
                <div className = "toggle-slider">
                    <p>Set Interval</p>
                    <input type = "checkbox" id = "toggle" checked = {checkedInterval} onChange={handleToggleInterval}/>
                    <label htmlFor = "toggle" className = "slider"></label>
                </div>
                <div className = "toggle-container" onClick = {handleToggleInterval}>
                    <div className = {'toggle-btn ${!toggle ? "disable":""}'}>{checkedInterval? "ON" : "OFF"}</div>
                </div>
                <div className="responsive-form">
                    <div className="input-container">
                        <label htmlFor="startTime">Start Time(s)</label>
                        <input type = "number" id = "startTime" name ="startTime"
                           onChange={()=>changeParameter("startTime")} 
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="endTime">End Time(s)</label>
                        <input type = "number" id = "endTime" name ="endTime" 
                            onChange={()=>changeParameter("endTime")}
                        />
                    </div>
                    {checkedInterval? (
                        <div className="input-container">
                            <label htmlFor="numberOfIntervals">Number of Intervals: </label>
                            <input type = "number" id = "numberOfIntervals" name ="numberOfIntervals"
                                onChange = {()=>changeParameter("numberOfIntervals")}
                            />
                        </div>
                    ):null}
                    {!checkedInterval? (
                        <div className="input-container">
                            <label htmlFor="intervalDuration">Intervals Duration(s): </label>
                            <input type = "number" id = "interval" name ="intervalDuration"
                                onChange = {()=>changeParameter("interval")}
                            />
                        </div>
                    ):null}
                </div>
            </div>
            <div className = "selected-param-container">
                <h4>List of Modified Parameter</h4>
                <table className = "list-container">
                    <caption> List of Changed Parameters</caption>
                    <thead>
                        <tr>
                            <th>Parameters</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {changedParameters.map((item, index)=> 
                            <tr key = {index}>
                                <td><label>{item.param}</label></td>
                                <td><p>{item.value}</p></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className = "sim-param-record">
                <h4>Record of Previous Simulation</h4>
                
                <table className = "list-container">
                    <caption>List of Previous Simulation</caption>
                    <thead><tr><th>Simulation Name</th><th>Changed Parameter</th><th>Assigned Vaule</th></tr></thead>
                    <tbody>
                        {testSimParamRecord.map((item, index) =>
                            item.changedParam.map((param, paramIndex) => (
                                <tr key={`sim-${index}-param-${paramIndex}`}>
                                    {/* Render Simulation Name only for the first parameter */}
                                    {paramIndex === 0 && (
                                        <td rowSpan={item.changedParam.length}>
                                            <label>{item.name}</label>
                                        </td>
                                    )}
                                    <td>{param.param}</td>
                                    <td>{param.value}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="sim-button-container">
                <label>Name Your Simulation</label>
                <input type = "text" placeholder="Simulation Name" autoCapitalize = "sentences" onChange={(e)=>{handelSimulationName(e.target.value)}}></input>
                <button className = "sim-button" onClick = {handelSimulation}>Simulate!</button>
            </div>
            <div className = "result-section">
                <ResultTableDisplay></ResultTableDisplay>
                <Plotter></Plotter>
            </div>
        </div>
        
    )
}

export default Simulation;