import React, {useContext} from "react";
import { useCallback } from "react";
import {useDropzone} from "react-dropzone";
import { DutyCycleContext, DutyCycleObject, SetDutyCycleContext, SetDutyCycleDataContext, SetDutyCycleString} from "../App";
const DutyCycleLoading = () =>{
    const dutyCycleName=  useContext(DutyCycleContext);
    const setDutyCycleName = useContext(SetDutyCycleContext);
    const setDutyCycyleB64 = useContext(SetDutyCycleDataContext);
    const setDutyCycleString = useContext(SetDutyCycleString);
    const onDrop = useCallback(
        (droppedFile)=>{
            const file = droppedFile[0];
            if(droppedFile.length>0 && file.name.split('.').pop()==='csv'){
                const reader = new FileReader();
                setDutyCycleName(file.name);
                reader.onload=()=>{
                    const csvText = reader.result;
                    const rows = csvText.trim().split('\n');
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
            accept: '.csv',
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