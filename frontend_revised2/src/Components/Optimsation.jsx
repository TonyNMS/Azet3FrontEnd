import React, {useContext} from "react";
import { useState } from "react";
import axios from "axios";
import { ModelInfoContext, ParameterContext } from "../App";
import OptimisationPlotter from "./OptimisationPlotter";
const Optimisation = ()=>{
    const [curPara, setrCurParam] = useState("");
    const [curStartVal,setCurStartVal] = useState(0);
    const [curEndVal, setCurEndVal] =useState(0);
    const [curStep, setCurStep] = useState(0);
    const [cosntParam, setConstParam] = useState("");
    const [constParamVal, setConstparamVal]= useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [optParamArray, setOptParamArray] = useState([]);
    const [optimisationRes, setOptimisationRes] = useState([]);
    const parameters = useContext(ParameterContext);
    const modelName = useContext(ModelInfoContext);
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
                setOptimisationRes(response.data.results);
                let debug = response.data.results;
                setOptParamArray([]);
                let temp = debug.map((item,index)=>({
                    opt_name: `Iteration ${index}`,
                    data: formatResArray(item),
                }));
                console.log(temp)
            }).catch(error=>{
                console.log('Error During Batch Simulation:', error);
                alert(`Batch Simualtion Failed, Check the following error, ${error}`)
            })
        }else{
            alert("A Parameter Must be Chosen to Optimise");
            return;
        }
    }
        return (
            <div className="optimisation-section">
            <h3>Optimisation</h3>
            <div className = "constant-parameter-select">
                <input type="search" placeholder="Search a Parameter" onChange={searchInputHandeler}></input>
                <select onChange={handleConstParamSelection} value = {cosntParam}>
                    {parameterOptions()}
                </select>
                <input type= "number" placeholder = "Input Values Constant" onChange={e=>setConstparamVal(Number(e.target.value))}/>
                <button onClick={handleConstParamSubmisstion}>Submit</button>
            </div>
            <div className="optimisation-selection">
                <input type="search" placeholder="Search a Parameter" onChange={searchInputHandeler}></input>
                <select onChange={handleParameterSelection} value = {curPara}>
                    {parameterOptions()}
                </select>
                <input type="number" placeholder="Input Start Value" onChange={e=>setCurStartVal(Number(e.target.value))}></input>
                <input type="number" placeholder="Input End Value" onChange={e=>setCurEndVal(Number(e.target.value))}></input>
                <input type="number" placeholder="Steps" onChange={e=>setCurStep(Number(e.target.value))}></input>
                <button onClick={handleOptParamSubmisstion}>Submit</button>
            </div>
            <div className="optimise-now">
                <button onClick={handleOptimisation}>Optimise</button>
            </div>
            <div className="optimisation-display">
                <table className="">
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
            </div>
            <div className="optimisation-plot">
                <OptimisationPlotter optRes={optimisationRes}></OptimisationPlotter>
            </div>

        </div>
    )
}
export default Optimisation;