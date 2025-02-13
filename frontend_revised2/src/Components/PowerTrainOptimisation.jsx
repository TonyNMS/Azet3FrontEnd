import React, {useContext, useState}from "react";
import OptimisationPlotter from "./OptimisationPlotter";
import axios from "axios";
import { ModelInfoContext, ParameterContext } from "../App";
import "./Styling/PowerTrainOptimisation.css"
const PowerTrainOptimisation =()=>{
  const [curPara, setrCurParam] = useState("");
  const [curStartVal,setCurStartVal] = useState(0);
  const [curEndVal, setCurEndVal] =useState(0);
  const [curStep, setCurStep] = useState(0);
  const [toggleChangedParamTable, setToggleChangedParamTable] = useState(false);
  const [togglePrevOptTable, setTogglePrevOptTable] = useState(false);
  const [optParamArray, setOptParamArray] = useState([]);
  const [cosntParam, setConstParam] = useState("");
  const [constParamVal, setConstparamVal]= useState(0);
  const [searchInputConst, setSearchInputConst] = useState("");
  const [searchInputOpt, setSearchInputOpt] = useState("");
  const [optResParamRecord, setOptResParamRecord] = useState([]);
  const [optimisationRes, setOptimisationRes] = useState([]);
  const toggleChangedParamTab = () =>{setToggleChangedParamTable(!toggleChangedParamTable)}
  const togglePrevOptTab = () =>{setTogglePrevOptTable(!togglePrevOptTable)}

  const parameters = useContext(ParameterContext);
  const modelName = useContext(ModelInfoContext);

  const handleConstParamSelection = (e)=>{
    setConstParam(e.target.value);
  }
  const handleParameterSelection = (e)=>{
    setrCurParam(e.target.value);
  } 

  const filteredListConstParam = parameters.filter(
    (el)=>{
        if(searchInputConst === ""){
            return el;
        }else{
            return el.includes(searchInputConst);
        }
    }
  )
  const filtereListOptParam = parameters.filter(
    (el)=>{
        if(searchInputOpt ===""){
            return el
        }else{
            return el.includes(searchInputOpt);
        }
    }
  )
  const parameterOptOptions = ()=>{
    return filtereListOptParam.length > 0 ? (
        [<option key = {'opt-param-placeholde'} value={null}>Select a Parameter</option>, ...filtereListOptParam.map(
            (item, index)=> (<option key={`opt-param-${index}`} value={item.replaceAll("\"", "")} >
                {item.replaceAll("\"", "")}
            </option>)
        )]
    ):(
        <option key={'opt-param-no_sim'}>No Parameters Loaded</option>
    )
}
  const parameterConstOptions = ()=>{
    return filteredListConstParam.length > 0 ? (
        [<option key = {'opt-param-placeholde'} value={null}>Select a Parameter</option>, ...filteredListConstParam.map(
            (item, index)=> (<option key={`opt-param-${index}`} value={item.replaceAll("\"", "")} >
                {item.replaceAll("\"", "")}
            </option>)
        )]
    ):(
        <option key={'opt-param-no_sim'}>No Parameters Loaded</option>
    )
  }
  let searchConstInputHandeler = (e) =>{
    setSearchInputConst(e.target.value);
  }
  let searchOptInputHandeler =(e) =>{
    setSearchInputOpt(e.target.value);
  }
  const handleOptimisation = () =>{
    console.log(modelName);
    if (optParamArray.length >0){
        axios.post('http://127.0.0.1:5000/model/simulate_batch',{
            model_name : modelName,
            params : optParamArray
        }).then(response=>{
            const temnParamArray = optParamArray;
            setOptResParamRecord([...optResParamRecord, {"optName":`Batch Simulation ${optResParamRecord.length+1}`, "changedPara": optParamArray}])
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
  const handleConstParamSubmisstion= ()=>{
    console.log(cosntParam)
    if (cosntParam !== ""){
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
  return(
    <div className="powertrain-coponent-optimsation">
      <div className="optimisation-description">
        <p>Power Train Simulation will run multiply simulations in batch to determine
        which combination of power train component yield the best performance</p>
      </div>
      <div className="optimisation-record-toggle">
        <button onClick={toggleChangedParamTab} className="pwr-toggle-btn">Toggle Changed Parameter Table</button>
        <button onClick={togglePrevOptTab} className="pwr-toggle-btn">Toggle Previous Run Record</button>
      </div>
      {toggleChangedParamTable?(
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
          {togglePrevOptTable? previousOptRecord(): null}
        </div>
      ):null}
      <div className = "opt-parameter-select-table">
        <table>
          <tbody>
            <tr>
                <td><input type="text" placeholder="Search a Parameter" onChange={searchConstInputHandeler}></input></td>
                <td><select onChange={handleConstParamSelection} value = {cosntParam}>{parameterConstOptions()}</select></td>
                <td><input type= "number" placeholder = "Input Values Constant" onChange={e=>setConstparamVal(Number(e.target.value))}/></td>
                <td></td>
                <td></td>
                <td><button onClick={handleConstParamSubmisstion} className="submition">Submit</button></td>
            </tr>
            <tr>
                <td><input type="text" placeholder="Search a Parameter" onChange={searchOptInputHandeler}></input></td>
                <td><select onChange={handleParameterSelection} value = {curPara}>{parameterOptOptions()}</select></td>
                <td><input type="number" placeholder="Input Start Value" onChange={e=>setCurStartVal(Number(e.target.value))}></input></td>
                <td><input type="number" placeholder="Input End Value" onChange={e=>setCurEndVal(Number(e.target.value))}></input></td>
                <td><input type="number" placeholder="Steps" onChange={e=>setCurStep(Number(e.target.value))}></input></td>
                <td><button onClick={handleOptParamSubmisstion} className="submition">Submit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="batch-simulate-now">
        <button onClick={handleOptimisation}>Batch Simulation</button>
      </div>
      <div className="batch-simulation-plot-plot">
        <OptimisationPlotter optRes={optimisationRes}></OptimisationPlotter>
      </div>
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
        <tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody>
      </table>
    </div>
  )
}
export default PowerTrainOptimisation