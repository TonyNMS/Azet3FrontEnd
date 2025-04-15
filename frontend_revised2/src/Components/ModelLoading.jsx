import React, {useContext} from "react";
import { useCallback } from "react";
import {useDropzone} from "react-dropzone";
import {ModelInfoContext, SetModelNameContext, SetModelDataContext } from "../App";
const ModelLoading = ()=>{
    const modelName = useContext(ModelInfoContext);
    const setModelName = useContext(SetModelNameContext);
    const setModelB64 = useContext(SetModelDataContext);
    const onDrop = useCallback(
        (droppedFile)=>{
            const file = droppedFile[0];
            if(droppedFile.length>0 && file.name.split('.').pop()==='mo'){
                const reader = new FileReader();
                console.log(file.name.split('.')[0]);
                setModelName(file.name.split('.')[0]);
                reader.onload=()=>{
                    const base64File = btoa(reader.result);
                    setModelB64(base64File);
                };
                reader.readAsText(file);
            }else{
                alter('Please Make Sure The File Uploaded is a .mo File');
            }
        }
    ,[]);
    const {getRootProps, getInputProps, isDragActive} = useDropzone(
        {
            onDrop,
            accept: {'application/octet-stream':['.mo']},
        }
    );
    return(
        <div>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()}></input>
                {isDragActive?
                    <p>Drag and Drop your file here</p>:
                    <p>Upload Modelica Model : {modelName}</p>
                }
            </div>
        </div>
    )
}
export default ModelLoading;