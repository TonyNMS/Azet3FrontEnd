import React, {useContext} from "react";
import { useCallback } from "react";
import {useDropzone} from "react-dropzone";
import { DutyCycleContext, UpdateChangedParameterContext, SetDutyCycleContext, 
    SetDutyCycleDataContext, SetDutyCycleString, SetDutyCycleStartEndIntervalContext,
    DutyCycleStartEndIntervalContext} from "../App";
    
const DutyCycleLoading = () =>{
    const dutyCycleName=  useContext(DutyCycleContext);
    const setDutyCycleName = useContext(SetDutyCycleContext);
    const updateChangedParametersArray = useContext(UpdateChangedParameterContext);  
    const setDutyCycyleB64 = useContext(SetDutyCycleDataContext);
    const setDutyCycleString = useContext(SetDutyCycleString);
    const setDutyCycleStartEndInterval = useContext(SetDutyCycleStartEndIntervalContext);

    const onDrop = useCallback(
        (droppedFile)=>{
            const file = droppedFile[0];
            if(droppedFile.length>0 && file.name.split('.').pop()==='csv'){
                const reader = new FileReader();
                setDutyCycleName(file.name);
                reader.onload=()=>{
                    const csvText = reader.result;
                    const rows = csvText.trim().split('\n');
                    console.log(rows[0].split(',').map(val =>val.trim())[0]);
                    console.log(rows[rows.length-1].split(',').map(val =>val.trim())[0]);
                    updateChangedParametersArray(
                        {
                            param:"startTime",
                            value:rows[0].split(',').map(val =>val.trim())[0]
                        }
                    )
                    updateChangedParametersArray(
                        {
                            param:"stopTime",
                            value:rows[rows.length-1].split(',').map(val =>val.trim())[0]
                        }
                    )
                    setDutyCycleStartEndInterval(
                        () =>[
                            {
                                param:"startTime",
                                value:rows[0].split(',').map(val =>val.trim())[0]
                            },
                            {
                                param:"stopTime",
                                value:rows[rows.length-1].split(',').map(val =>val.trim())[0]
                            }
                        ]
                    )
                    const formatedData = rows
                    .map(
                        row=>{
                            const columns = row.split(',').map(val =>val.trim());
                            if(columns.length === 2){
                                return `{${columns[0]}, ${columns[1]}}`;
                            }
                            return null;
                        }
                    )
                    .filter(item => item !== null)
                    .join('; ');

                    setDutyCycleString(`{${formatedData}}`);
                    setDutyCycyleB64(btoa(reader.result));
                };
                reader.readAsText(file);
            }else{
                alter('Please Make Sure The File Uploaded is a .csv File');
            }
        }
    ,[]);
  
    const {getRootProps, getInputProps, isDragActive} =  useDropzone(
        {
            onDrop,
            accept: {'application/octet-stream':['.csv']},
        }
    );
    return(
        <div>
            <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()}></input>
                {isDragActive?
                    <p>Drag and Drop your file here</p>:
                    <p>Upload DutyCycle Here : {dutyCycleName}</p>
                }
            </div>
        </div>
    )
}
export default DutyCycleLoading;