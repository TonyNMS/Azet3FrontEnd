import React, { useContext, useState } from "react";
import axios from "axios";
import ModelLoading from "./ModelLoading";
import DutyCycleLoading from "./DutyCycleLoading";
import {ModelInfoContext, ModelDataContext, SetParameterContext} from "../App";
const Loading = ()=>{
    const modelName = useContext(ModelInfoContext);
    const modelB64 = useContext(ModelDataContext);
    const setparameters = useContext(SetParameterContext);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isImcompleteModel, setIsInCompleteModel] = useState(true);
    const [modelStatus, setModelStatus] = useState('No Model Is Loaded');

    const whenClickLoadModelBtn = (modelName, modelB64) =>{
        axios.post('http://127.0.0.1:5000/model/upload',
            {
                model_name: modelName,
                model_data: modelB64,
            }    
        ).then(response =>{
            if (response.data.status === `Model written`){
                setModelStatus(response.data.status);
                setIsModelLoaded(true);
                setIsInCompleteModel(false);
            }else{
                setModelStatus('Model Not Written')
            }
        }).catch(error =>{
            console.error('Error uploading file:', error);
            setModelStatus('Error uploading file');
        })
        
    }
    const whenClickDeleteButton = (modelName) =>{
        axios.post('http://127.0.0.1:5000/model/delete',{
            model_name: modelName,
        }).then(response=>{
            let temp =response.data.status;
            if(temp === `Deleted model ${modelName}`){
                console.log('deletion succesful');
                setModelStatus(temp);
            }else{
                console.log('deletion not successful');
                setModelStatus(temp);
            }
        }).catch(error=>{
            console.error('The following error occured:', error);
            console.log(`${modelName} has trouble deleteting`);
            setModelStatus(error);
        })
    }
    const whenClickModelparameter = (modelName)=>{
        console.log(`Loading model Parameter names ${JSON.stringify(modelName)}`);
        axios.post('http://127.0.0.1:5000/model/get_parameter_names',{
            model_name: modelName,
            class: modelName,
        }).then(response =>{
            setparameters(response.data.map(n=>n.trim()));
        }).catch(error=>{
            console.error('Has problem geting parameters from model', error);
        })
    }
    const modelLoadingStatusRender=(isModelLoaded, isImcompleteModel)=>{
        if(isImcompleteModel && !isModelLoaded){
            return <p>{modelStatus}</p>
        }else if(!isImcompleteModel && isModelLoaded){
            console.log("Model Loading Successful")
            return(
                <div>
                    <p>{modelStatus}</p>
                    <div className = "modelDeleteBtn">
                        <button onClick = {()=>whenClickDeleteButton(modelName)}>
                            Delete Model
                        </button>
                    </div>
                    <div className="modelParameterBtn">
                        <button className= "model-param-btn" onClick={()=>whenClickModelparameter(modelName)}>
                            Show Parameter
                        </button>
                    </div>
                </div>
            )
        }
    }
    return (
        <div>
            <h3>Import Model Here</h3>
            <ModelLoading></ModelLoading>
            <div className = "button-control-panel">
                <div className = "load-delete-button">
                    <button onClick={()=>whenClickLoadModelBtn(modelName, modelB64)}>Load Model</button>
                    {modelLoadingStatusRender(isModelLoaded, isImcompleteModel)}
                </div>
            </div>
        </div>
    )
}
export default Loading;