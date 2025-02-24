import React, {useContext} from "react";
import { ChangedParameterContext, ParameterContext, UpdateChangedParameterContext } from "../App";
const ParameterList =(props)=>{
    const parameters = useContext(ParameterContext);
    const updateChangedParametersArray = useContext(UpdateChangedParameterContext);
    const parameterListObject = parameters.map((parameter, index)=>(
        {"id": index, "param": parameter}
    ));
    const filteredParameterList = parameterListObject.filter((el)=>{
        if(props.input ===''){
            return el;
        }else{
            return el.param.includes(props.input);
        }
    });
    const changeParameter = (parameterName, e)=>{
        console.log({param:parameterName.replace(/^"|"$/g,''), value:e.target.value});
        updateChangedParametersArray({param:parameterName.replace(/^"|"$/g,''), value:e.target.value})
    };
    
    return(
        <table>
            <caption>Parameters Avalible for Changing</caption>
            <thead>
                <tr>
                    <th>Parameters</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {filteredParameterList.map((parameterObject, index)=>
                    <tr key={index}>
                        <td><label>{parameterObject.param}</label></td>
                        <td><input 
                        className = "param-value-input" 
                        type = "number" 
                        key ={parameterObject.id}
                        id = {parameterObject.param}
                        name = {parameterObject.param}
                        onChange={(e)=>changeParameter(parameterObject.param, e)}/>                
                        </td>
                    </tr>)
                }
            </tbody>
        </table>
)
}
export default ParameterList;