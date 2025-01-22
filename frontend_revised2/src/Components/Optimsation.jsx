import React, {useContext, useSyncExternalStore} from "react";
import { useState } from "react";
import axios from "axios";
import { ModelInfoContext, ParameterContext } from "../App";
import OptimisationPlotter from "./OptimisationPlotter";
import "./Styling/Optimisation.css"
import OptimisationFinancialSummary from "./OptimisationFinancialSummary";
const Optimisation = ()=>{
    const [curPara, setrCurParam] = useState("");
    const [curStartVal,setCurStartVal] = useState(0);
    const [curEndVal, setCurEndVal] =useState(0);
    const [curStep, setCurStep] = useState(0);
    const [cosntParam, setConstParam] = useState("");
    const [constParamVal, setConstparamVal]= useState(0);
    const [selectPwrTrainOpt, setSelectPwrTrainOpt] = useState(false);
    const [selectFuelOpt, setSelectFuelOpt] = useState(false);
    const [selectRouteOpt, setSelectRouteOpt] = useState(false);
    const [selectDutyCycOpt, setSelectDutyCycOpt] = useState(false);
    const [selectCustomFuel, setSelecteCustomFuel] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [optParamArray, setOptParamArray] = useState([]);
    const [optimisationRes, setOptimisationRes] = useState([]);
    const parameters = useContext(ParameterContext);
    const modelName = useContext(ModelInfoContext);
    const [optResParamRecord, setOptResParamRecord] = useState([]);
    const fuelTypeArray = ["Liquified Hydrogen", "Marine Diesel", "Bio Diesel", "Methan", "Ammonia"];
    const parameterOptions = ()=>{
        return parameters.length > 0 ? (
            [<option key = {'opt-param-placeholde'} value={null}>Select a Parameter</option>, ...parameters.map(
                (item, index)=> (<option key={`opt-param-${index}`} value={item.replaceAll("\"", "")} >
                    {item.replaceAll("\"", "")}
                </option>)
            )]
        ):(
            <option key={'opt-param-no_sim'}>No Parameters Loaded</option>
        )
    }
    const handleParameterSelection = (e)=>{
        setrCurParam(e.target.value);
    }
    const handleConstParamSelection = (e)=>{
        setConstParam(e.target.value);
    }
    const searchInputHandeler = (e) =>{
        setSearchInput(e.target.value);
    }
    const handleOptParamSubmisstion= ()=>{
        console.log(curPara)
        if (curPara !== ""){
            setOptParamArray([...optParamArray, {
                "name" : curPara,
                "start": curStartVal,
                "stop" : curEndVal,
                "step" : curStep
            }])
        }else{
            alert("Need to select a Parameter to proceed");
            return;
        }
    }
    const handleConstParamSubmisstion= ()=>{
        console.log(curPara)
        if (curPara !== ""){
            setOptParamArray([...optParamArray, {
                "name" : cosntParam,
                "start": constParamVal,
                "stop" : constParamVal,
                "step" : constParamVal
            }])
        }else{
            alert("Need to select a Parameter to proceed");
            return;
        }
    }
    const previousOptRecord = () =>{
        return (
            <div>
                <table>
                    <caption>List of Previous Optimisation</caption>
                    <thead><tr><th>Optisation Name</th><th>Changed Parameter</th><th>Start Value</th><th>End Value</th><th>Steps</th></tr></thead>
                    <tbody>
                        {optResParamRecord.map((item, index)=>
                            item.changedPara.map((param, paramIndex)=>
                                <tr key={`opt-${index}-param-${paramIndex}`}>
                                    {paramIndex === 0 && (
                                        <td rowSpan={item.changedPara.length}>
                                            <label>{item.optName}</label>
                                        </td>
                                    )}
                                    <td>{param.name}</td>
                                    <td>{param.start}</td>
                                    <td>{param.stop}</td>
                                    <td>{param.step}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
    const formatResArray = (csvString) => {
        const [keys, ...rest] = csvString.trim().split("\n").map((item) => item.split(","));
        const normalizedKeys = keys.map((key) => key.replace(/\"/g, ""));
        return rest.map((row) => {
          const obj = {};
          normalizedKeys.forEach((key, index) => {
            obj[key] = isNaN(row[index]) ? row[index] : parseFloat(row[index]);
          });
          return obj;
        });
    };
    const handleOptimisation = () =>{
        console.log(modelName);
        if (optParamArray.length >0){
            axios.post('http://127.0.0.1:5000/model/simulate_batch',{
                model_name : modelName,
                params : optParamArray
            }).then(response=>{
                const temnParamArray = optParamArray;
                setOptResParamRecord([...optResParamRecord, {"optName":`Batch Optimisation ${optResParamRecord.length+1}`, "changedPara": optParamArray}])
                setOptimisationRes(response.data.results);
                setOptParamArray([]);
                
            }).catch(error=>{
                console.log('Error During Batch Simulation:', error);
                alert(`Batch Simualtion Failed, Check the following error, ${error}`)
            })
        }else{
            alert("A Parameter Must be Chosen to Optimise");
            return;
        }
    }
    const debug = (result) =>{
        let temp = result.map((item,index)=>({
            opt_name: `Iteration ${index}`,
            data: formatResArray(item),
        }));
        console.log(temp)
    }
    const togglePwrTrainOpt =()=>{
        setSelectPwrTrainOpt(!selectPwrTrainOpt);
        setSelectDutyCycOpt(false);
        setSelectFuelOpt(false);
        setSelectRouteOpt(false);
    };
    const toggleDutyCycOpt=()=>{
        setSelectDutyCycOpt(!selectDutyCycOpt);
        setSelectFuelOpt(false);
        setSelectPwrTrainOpt(false);
        setSelectRouteOpt(false);
    };
    const toggleFuelOpt =()=>{
        setSelectFuelOpt(!selectFuelOpt);
        setSelectPwrTrainOpt(false);
        setSelectDutyCycOpt(false);
        setSelectRouteOpt(false);

    };
    const toggleRouteOpt =()=>{
        setSelectRouteOpt(!selectRouteOpt);
        setSelectPwrTrainOpt(false);
        setSelectDutyCycOpt(false);
        setSelectFuelOpt(false);

    };
    const toggleCustomFuel =()=>{setSelecteCustomFuel(!selectCustomFuel)};
    return (
        <div className="optimisation-section">
        <h3>Optimisation</h3>
        <div className="optimisation-selector">
            <h4>Select one or more of the following to Optimise</h4>
            <button style={{backgroundColor: selectFuelOpt ? "#e0e3e2" : "initial",color: "black",}} onClick={toggleFuelOpt}>Fuel Consumption</button>
            <button style={{backgroundColor: selectPwrTrainOpt ? "#e0e3e2" : "initial",color: "black",}} onClick={togglePwrTrainOpt}>Power Train Component</button>
            <button style={{backgroundColor: selectDutyCycOpt ? "#e0e3e2" : "initial",color: "black",}} onClick = {toggleDutyCycOpt}>Duty Cyle</button>
            <button style={{backgroundColor: selectRouteOpt ? "#e0e3e2" : "initial",color: "black",}} onClick={toggleRouteOpt}>Route</button>         
        </div>
        <div className="powertrain-coponent-optimsation">
            {
                selectPwrTrainOpt? (
                    <div className="optimisation-description">
                        <p>Power Train Simulation will run multiply simulations in batch to determine
                        which combination of power train component yield the best performance</p>
                    </div>
                ):null
            }
            {
                selectPwrTrainOpt? (
                    <div className="powertrain-optimisation-display">
                        <table className="changed-parameters">
                            <caption> List of Changed Parameters</caption>
                                <thead>
                                    <tr>
                                        <th>Parameters</th>
                                        <th>Start Value</th>
                                        <th>End Value</th>
                                        <th>Steps</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {optParamArray.map((item, index)=> 
                                        <tr key = {index}>
                                            <td><label>{item.name}</label></td>
                                            <td><p>{item.start}</p></td>
                                            <td><p>{item.stop}</p></td>
                                            <td><p>{item.step}</p></td>
                                        </tr>
                                    )}
                                </tbody>
                        </table>
                        {previousOptRecord()}
                    </div>
                ):null
            }
            {
                selectPwrTrainOpt ? (
                    <div className = "constant-parameter-select">
                        <h5>Power Tain Configureation Optimisation</h5>
                        <input type="search" placeholder="Search a Parameter" onChange={searchInputHandeler}></input>
                        <select onChange={handleConstParamSelection} value = {cosntParam}>
                            {parameterOptions()}
                        </select>
                        <input type= "number" placeholder = "Input Values Constant" onChange={e=>setConstparamVal(Number(e.target.value))}/>
                        <button onClick={handleConstParamSubmisstion} className="submition">Submit</button>
                    </div>
                ):null      
            }
            {
                selectPwrTrainOpt ? (
                    <div className="optimisation-selection">
                        <input type="search" placeholder="Search a Parameter" onChange={searchInputHandeler}></input>
                        <select onChange={handleParameterSelection} value = {curPara}>
                            {parameterOptions()}
                        </select>
                        <input type="number" placeholder="Input Start Value" onChange={e=>setCurStartVal(Number(e.target.value))}></input>
                        <input type="number" placeholder="Input End Value" onChange={e=>setCurEndVal(Number(e.target.value))}></input>
                        <input type="number" placeholder="Steps" onChange={e=>setCurStep(Number(e.target.value))}></input>
                        <button onClick={handleOptParamSubmisstion} className="submition">Submit</button>
                    </div>
                ):null}
            {
                selectPwrTrainOpt ? (
                    <div className="batch-simulate-now">
                        <button onClick={handleOptimisation}>Batch Simulation</button>
                    </div>
                ):null}
            {
                selectPwrTrainOpt ?(
                    <div className="batch-simulation-plot-plot">
                        <OptimisationPlotter optRes={optimisationRes}></OptimisationPlotter>
                    </div>
                ):null}
            {
                selectPwrTrainOpt?(
                    <table className="pwr-train-optisation-summarytable">
                            <caption>Power train Optimisation Summary Table</caption>
                                <thead>
                                    <tr>
                                        <th>Current Expense per Voyage</th>
                                        <th>Sum Expense Projection 5 Years</th>
                                        <th>Optimised Expense per Voyage</th>
                                        <th>Optimised Sum Expense Projecion 5 Years</th>
                                        <th>Optimised Sum Expense Projection 10 Years</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                    </table>
                ):null}
        </div>
        <div className="fuel-consumption-optimisation">
            {selectFuelOpt? (
                <>  
                    <div className="optimisation-description">
                        <p>Fuel Consumption Optimisation will explore the options of different fuel mixure to save expenses</p>
                    </div>
                    <div className="fuel-optimisation-selection">
                        <button>Marine Diesel</button>
                        <button>Mathanol</button>
                        <button>Methan</button>
                        <button>Ammonia</button>
                        <button onClick={toggleCustomFuel} className="submition">Custom</button>
                    </div>
                    {
                        selectCustomFuel ? (
                            <div>
                                <div className="custome=fuel-prop">
                                    <label>Fuel LHV</label><input type="number" placeholder="Fuel LHV"/>
                                    <label>Fuel Density</label><input type="number" placeholder="Density"/>
                                    <label>Fuel Liquid Density</label><input type="number" placeholder="Liquid Density"/>
                                    <label>Fuel Carbon Content</label><input type="number" placeholder="Liquid Carbon Content"/>
                                    <label>Fuel Molar Mass</label><input type="number" placeholder="Molar Mass"/>
                                    <label>Fuel Molar Energy</label><input type="number" placeholder="Molar Energy"/>
                                    
                                </div>
                                <button className="submition">Submit</button>
                            </div>
                        ):null}
                    <select className="fuel-price-projection">
                        {fuelTypeArray.map((item, index)=><option value = {item} key={`fuel-opt-${index}`}                                                                  >{item}</option>)
                        }
                    </select>
                    <button className="submition">Optimise Fuel Cosumption</button>
                </>
                
            ):null}
            {selectFuelOpt?
                (
                    <>  
                        <table className="fuel-opt-fin-expense">
                            <caption>Duty Cycle Optimisation Expense Table</caption>
                            <thead>
                                <tr><th>Hydrogen(£/yr)</th><th>Marine Diesel(£/yr)</th><th>Bio Diesel(£/yr)</th><th>Ammonioa(£/yr)</th><th>Methan(£/yr)</th></tr>
                            </thead>
                            <tbody>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                            </tbody>
                        </table>
                    </>
                ):null
            }
            {selectFuelOpt? (
                <table className="fuel-optisation-summarytable">
                    <caption>Fuel Optimisation Summary Table</caption>
                        <thead>
                            <tr>
                                <th>Current Expense per Voyage</th>
                                <th>Sum Expense Projection 5 Years</th>
                                <th>Optimised Expense per Voyage</th>
                                <th>Optimised Sum Expense Projecion 5 Years</th>
                                <th>Optimised Sum Expense Projection 10 Years</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                </table>
            ):null}
        </div>
        <div className="duty-cycle-optimisation">
            {selectDutyCycOpt? (
                <>
                    <div className="optimisation-description">
                        <p>Duty Cycle Optimisation will explore the options of slow steaming to save fuel</p>
                    </div>
                    <button className="submition">Optimise Duty Cycle</button>
                </>
            ):null}
            {selectDutyCycOpt?(
                <>  
                    <table className="dutycycle-opt-fin-expense">
                        <caption>Duty Cycle Optimisation Expense Table</caption>
                        <thead>
                            <tr><th>Maintainace (£/yr)</th><th>Crew(£/yr)</th><th>Additional Voyage Time(days/yr)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td></td><td></td><td></td></tr>
                        </tbody>
                    </table>
                </>
            ):null}
            {selectDutyCycOpt? (
                <table className="dutycycle-optisation-summarytable">
                    <caption>Duty Cycle Optimisation Summary Table</caption>
                        <thead>
                            <tr>
                                <th>Current Expense per Voyage</th>
                                <th>Sum Expense Projection 5 Years</th>
                                <th>Optimised Expense per Voyage</th>
                                <th>Optimised Sum Expense Projecion 5 Years</th>
                                <th>Optimised Sum Expense Projection 10 Years</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                </table>
            ):null}
        </div>
        <div className="route-optimistation">
            {selectRouteOpt? (
                <>  
                    <div className="optimisation-description">
                        <p>Route Optimisation aims to reduce the operation cost by using a different route</p>
                    </div>
                    <label>Departure Port</label>
                    <input type="text" placeholder="Departure Port"></input>
                    <label>Arrival Port</label>
                    <input type="text" placeholder="Arrival Port"></input>
                    <button className="submition">Optimise Route</button>
                </>
            ):null}
            {selectRouteOpt? (
                <>  
                    <table className="route-opt-fin-expense">
                        <caption>Route Optimisation Expense Table</caption>
                        <thead>
                            <tr><th>Maintainace (£/yr)</th><th>Crew(£/yr)</th><th>Additional Voyage Time(days/yr)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td></td><td></td><td></td></tr>
                        </tbody>
                    </table>
                </>
            ):null}
            {selectRouteOpt? (
                <table className="route-optisation-summarytable">
                    <caption>Route Optimisation Summary Table</caption>
                        <thead>
                            <tr>
                                <th>Current Expense per Voyage</th>
                                <th>Sum Expense Projection 5 Years</th>
                                <th>Optimised Expense per Voyage</th>
                                <th>Optimised Sum Expense Projecion 5 Years</th>
                                <th>Optimised Sum Expense Projection 10 Years</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                </table>
            ):null}
        </div>
        <OptimisationFinancialSummary></OptimisationFinancialSummary>           
    </div>
    )
}
export default Optimisation;