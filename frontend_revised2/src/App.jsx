import React, { useState,createContext } from 'react'
import './App.css'
import Loading from './Components/Loading';
import Simulation from './Components/Simulation';
import Optimisation from './Components/Optimsation';
import ImageoverLayDisp from './Components/ImageOverLayDisp';
import CanvasSoultion from './Components/CanvasSoultion';
import SideMenuBar from './Components/SideMenuBar';
import Tags from './Components/Tags';

export const ResultsContext = createContext();
export const UpdateResultContext = createContext();
export const ModelInfoContext= createContext();
export const SetModelNameContext = createContext();
export const ModelDataContext = createContext();
export const SetModelDataContext = createContext();
export const ParameterContext= createContext();
export const SetParameterContext = createContext();
export const DutyCycleContext = createContext();
export const SetDutyCycleContext = createContext();
export const ChangedParameterContext = createContext();
export const UpdateChangedParameterContext = createContext();
export const ResetChangedParameterContext =createContext();
export const DutyCycleDataContext = createContext();
export const SetDutyCycleDataContext = createContext();
export const DutyCycleObject = createContext();
export const DutyCycleStartEndIntervalContext = createContext();
export const SetDutyCycleStartEndIntervalContext = createContext();
export const SetDutyCycleString = createContext();
export const RenderedTagsContext = createContext();
export const SetRenderedTagsContext = createContext();
function App() {
  const [resultCollection, setResultCollection] = useState([]);
  const [curModelName, setCurModelName] = useState('');
  const [cur_Model_b64, setCur_Model_b64] = useState('');
  const [curDutyCycleName, setCurDutyCycleName] = useState('');
  const [cur_DutyCycle_b64, setCur_DutyCycle_b64] = useState('');
  const [parameters, setParameteres] = useState([]);
  const [changedParameters, setChangedParameters] = useState([]);
  const [csvString, setCSVString] = useState('');
  const [renderedTags, setRenderedTags] = useState(['Welcome']);
  const [dutyCycleStartEndInterval, setDutyCyleStartEndInterval] = useState([]);
  const updateResultCollection =(newResult)=>{
    setResultCollection([...resultCollection, newResult]);
  };
  const setCurrentModelName = (modelName) =>{
    setCurModelName(modelName);
  };
  const setCurrentDutyCycleName = (dutyCycleName)=>{
    setCurDutyCycleName(dutyCycleName);
  };
  const setCurrentModelB64 = (modelB64) =>{
    setCur_Model_b64(modelB64);
  };
  const setCurrentCSVb64 = (csvB64) =>{
    setCur_DutyCycle_b64(csvB64);
  };
  const setParametersArray = (parameter)=>{
    setParameteres(parameter);
  };
  const updateChangedParametersArray = (a)=>{
    console.log(changedParameters)
    if (a.param === "numberOfIntervals"){
      const newList = changedParameters.filter(item=>item.param !== a.param && item.param !=="interval");
      console.log(`current overriden parameter ${[...newList, a].map(b=>JSON.stringify(b))}`);
      setChangedParameters([...newList, a]);
    }else if (a.param === "interval"){
      const newList = changedParameters.filter(item=>item.param !==a.param && item.param !=="numberOfIntervals");
      console.log(`current overriden parameter ${[...newList, a].map(b=>JSON.stringify(b))}`);
      setChangedParameters([...newList, a]);
    }else{
      const newList = changedParameters.filter(item=>item.param !== a.param);
      console.log(`current overriden parameter ${[...newList, a].map(b=>JSON.stringify(b))}`);
      setChangedParameters([...newList, a]);  
    }
  };
  const resetChangedParameterArray =()=>{
    setChangedParameters([]);
  };
  const setCSVObject =(CSVString)=>{
    setCSVString(CSVString);
  };
  const defineRenderedTag =(input)=>{
    if(renderedTags.includes(input)){
      const newList = renderedTags.filter(item=>item !==input)
      console.log(newList);
      setRenderedTags(renderedTags.filter(item=>item !==input))
    }else{
      const newList = [...renderedTags, input]
      console.log(newList);
      setRenderedTags([...renderedTags, input])
    }
    
  };
  return (
    <>
      <ResultsContext.Provider value = {resultCollection}>
        <UpdateResultContext.Provider value = {updateResultCollection}>
          <ModelInfoContext.Provider value = {curModelName}>
            <SetModelNameContext.Provider value = {setCurrentModelName}>
              <ModelDataContext.Provider value = {cur_Model_b64}>
                <SetModelDataContext.Provider value ={setCurrentModelB64}>
                  <ParameterContext.Provider value = {parameters}>
                    <SetParameterContext.Provider value = {setParametersArray}>
                      <DutyCycleContext.Provider value={curDutyCycleName}>
                        <SetDutyCycleContext.Provider value={setCurrentDutyCycleName}>
                          <ChangedParameterContext.Provider value={changedParameters}>
                            <UpdateChangedParameterContext.Provider value={updateChangedParametersArray}>
                              <ResetChangedParameterContext.Provider value={resetChangedParameterArray}>
                                <DutyCycleDataContext.Provider value={cur_DutyCycle_b64}>
                                  <SetDutyCycleDataContext.Provider value ={setCurrentCSVb64}>
                                    <DutyCycleStartEndIntervalContext.Provider value = {dutyCycleStartEndInterval}>
                                      <SetDutyCycleStartEndIntervalContext.Provider value = {setDutyCyleStartEndInterval}>
                                        <DutyCycleObject.Provider value ={csvString}>
                                        <SetDutyCycleString.Provider value={setCSVObject}>
                                          {/**<Loading></Loading>
                                          <Simulation></Simulation>
                                          <Optimisation></Optimisation>
                                           */}
                                          
                                            <div className='app-container'>
                                              <RenderedTagsContext.Provider value ={renderedTags}>
                                                <SetRenderedTagsContext.Provider value ={defineRenderedTag}>
                                                  <SideMenuBar></SideMenuBar>
                                                  <Tags></Tags>
                                                </SetRenderedTagsContext.Provider>
                                              </RenderedTagsContext.Provider>
                                            </div>
                                        </SetDutyCycleString.Provider>
                                      </DutyCycleObject.Provider>
                                      </SetDutyCycleStartEndIntervalContext.Provider>
                                    </DutyCycleStartEndIntervalContext.Provider>
                                  </SetDutyCycleDataContext.Provider>
                                </DutyCycleDataContext.Provider>
                              </ResetChangedParameterContext.Provider>
                            </UpdateChangedParameterContext.Provider>
                          </ChangedParameterContext.Provider>
                        </SetDutyCycleContext.Provider>
                      </DutyCycleContext.Provider>
                    </SetParameterContext.Provider>
                  </ParameterContext.Provider>
                </SetModelDataContext.Provider>
              </ModelDataContext.Provider>
            </SetModelNameContext.Provider>
          </ModelInfoContext.Provider>
        </UpdateResultContext.Provider>
      </ResultsContext.Provider>
    </>
  )
}
export default App
