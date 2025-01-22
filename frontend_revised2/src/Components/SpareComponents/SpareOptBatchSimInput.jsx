import React from "react";

const SpareoptBatchSimInput = ({onRender})=>{
    return(
        <>
            {
                selectPwrTrainOpt ? (
                    <div className = "constant-parameter-select">
                        <h4>Power Tain Configureation Optimisation</h4>
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
                ):null
            }
        </>
    )
}