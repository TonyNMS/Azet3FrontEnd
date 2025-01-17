import React, {useContext} from "react";
import { ChangedParameterContext, ParameterContext, UpdateChangedParameterContext } from "../App";
const ParameterList =(props)=>{
    const parameters = useContext(ParameterContext);
    const changedParameters = useContext(ChangedParameterContext);
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
    const changeParameter = (parameterName)=>{
        console.log({param:parameterName.replace(/^"|"$/g,''), value:document.getElementById(parameterName).value});
        updateChangedParametersArray({param:parameterName.replace(/^"|"$/g,''), value:document.getElementById(parameterName).value})
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
                        onChange={()=>changeParameter(parameterObject.param)}/>                
                        </td>
                    </tr>)
                }
            </tbody>
        </table>
)
}
export default ParameterList;