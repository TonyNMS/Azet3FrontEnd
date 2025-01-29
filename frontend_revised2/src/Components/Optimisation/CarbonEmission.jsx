import React, {useState, useContext, useEffect} from "react";
import Switch from "react-switch";
import axios from "axios";
import "../Styling/CarbonEmission.css"
import { ModelInfoContext } from "../../App";
import CarbonPlotter from "./CarbonPlotter";
const PRIORITY_OPTIONS = [
        {"name":"Generator Priotiy", "value": 0},
        {"name":"Fuel Cell", "value" : 1},
        {"name":"Constant Hybrid", "value" : 2}
]
const INITIAL_FUEL_OPTIONS =[
    {"type":"Diesel", "props":{"genereator_FLHV":44e6, "genereator_Frho":820, "genereator_Frho_liq":820, "genereator_FcarbonConent":0.86,"generator_MolarMass":0.233}},
    {"type":"Methanol", "props":{"genereator_FLHV":20.1e6, "genereator_Frho":791.4, "genereator_Frho_liq":791.4, "genereator_FcarbonConent":0.2,"generator_MolarMass":0.03204}},
    {"type":"Natural Gas", "props":{"genereator_FLHV":47.1e6,"genereator_Frho":0.78, "genereator_Frho_liq":422.6, "genereator_FcarbonConent":0.75,"generator_MolarMass":0.01604}},
    {"type":"Bio Diesel", "props": {"genereator_FLHV": 37.8e6,"genereator_Frho": 920, "genereator_Frho_liq": 920, "genereator_FcarbonConent": 0.87,"generator_MolarMass": 0.292}},
    {"type":"Ammonia", "props": {"genereator_FLHV": 18.6e6, "genereator_Frho": 0.86,"genereator_Frho_liq": 682, "genereator_FcarbonConent": 0.0,"generator_MolarMass": 0.01703}}
]
const createFuelOption = (Fname, FLHV, Frho, FliqRho, Fcarbon, FMolarMass) => ({
    "type":Fname,
    "props": { "genereator_FLHV": FLHV, "genereator_Frho": Frho,"genereator_Frho_liq":FliqRho, "genereator_FcarbonConent":Fcarbon, "genereator_MolarMass":FMolarMass},
});

const CarbonEmission =()=>{
    const modelName = useContext(ModelInfoContext);

    const[useBattery, setUseBattery] = useState(true);
    const[useFuelCell, setUseFuelCell] = useState(true);
    const[H2SOC, setH2SOC] =useState(1);
    const[H2Volumn, setH2Volumn]= useState(27);
    const[priorAssign, setPrioriAssign] =useState(0);
    const[genDutyPercent, setGenDutyPrecent] =useState(0.5);
    const[fcDutyPercent, setFCDutyPercent] = useState(0.5);
    const[batCapacity, setBatCapacity] =useState(7.74e+8);
    const[batStartSOC, setBatStartSOC] = useState(0.9);
    const[genRatedPwr, setGenRatedPwr] = useState(100000);
    
    const renderPriotiySelectOptions =()=>{
        return PRIORITY_OPTIONS.map((item, index)=>(
            <option key={`carbon-emi-${index}`} value = {item.value}>{item.name}</option>
        )           
    )}
    const renderTrueNFalse=()=>{
        return [
            <option key={`carbon-emi-tf-1`} value = "true">Yes</option>,
            <option key={`carbon-emi-tf-2`} value = "false">No</option>
        ]
    }
    const[customFuelName, setCusomFuelName] = useState("");
    const[LHV,setLHV] = useState(-1);
    const[rho,setRHO] = useState(-1);
    const[liqRho, setLiqRho] = useState(-1);
    const[carbonConent, setCarbonConent] = useState(-1);
    const[molarMass, setMolarMass] = useState(-1);

    const[CO2ResultCollection, setCO2ResultCollection] = useState([]);
    const[fuelUnderSim, setFuelUnderSim]=useState("");
    const[simTimeDuration, setSimTimeDueration]=useState(0);
    const [shouldStartSimulation, setShouldStartSimulation] = useState(false);

    const[toggleCalCarbonEmi, setToggleCalCarbonEmi] = useState(false);
    const[toggleVesConfig, setToggleVesConfig] = useState(false);
    const[toggleFuelConfig, setToggleFuelConfig] = useState(false);
    const[toggleFuelState, setToggleFuelState] = useState(false);
    const[togglePwrTrain, setTogglePwrTrain] = useState(false);
    /**LHV is measured in [J/kg] */
    const[fuelOptions, setFuelOptions]=useState(INITIAL_FUEL_OPTIONS);
    

    const handleGenRatedPwr =(e)=>{setGenRatedPwr(Number(e.target.value) * 1000)}
    const handleBatStartSOC =(e)=>{setBatStartSOC(Number(e.target.value) / 100)}
    const handleBatCapcity = (e)=>{setBatCapacity(Number(e.target.value) * 1e+8)}
    const handlePriorityAssign =(e)=>{setPrioriAssign(Number(e.target.value))}
    const handleH2SOC =(e)=>{setH2SOC(Number(e.target.value) / 100)}
    const handleH2Volumn =(e)=>{setH2Volumn(Number(e.target.value))}
     

    const handleFuelName = (e)=>{setCusomFuelName(e.target.value);}
    const handleLHV =(e)=>{setLHV((e.target.value) * 1e6);}
    const handleRHO =(e)=>{setRHO(e.target.value);}
    const handleliqRho =(e)=>{setLiqRho(e.target.value);}
    const handleCarbonContent =(e)=>{setCarbonConent((e.target.value) / 100);}
    const handleMolarMass =(e)=>{setMolarMass(e.target.value);}
    
    const handleAdditionalFuelType =()=>{
        if(customFuelName !== "" && LHV !== -1 && rho != -1 && liqRho !== -1 && carbonConent !== -1 && molarMass !== -1){
            setFuelOptions([...fuelOptions, createFuelOption(customFuelName,LHV,rho,liqRho,carbonConent,molarMass )]);
            alert("Fuel Adding Successul");
        }else{
            alert("Missing Fuel Property, Check again");
            return;
        }
    }
    const simFlagGenerator =(Fname,LHV, rho,liqRho,carbonContent, molarMass)=>{
        console.log(`Constructing Sim Flag for ${Fname}`)

        return [
            {param:"generator_FLHV", value:LHV},
            {param:"generator_Frho", value:rho},
            {param:"generator_Frho_liq", value:liqRho},
            {param:"generator_FcabonContent", value:carbonContent},
            {param:"generator_FMolarMass",value:molarMass},
            {param:"mCtlr_PirorityAssignement",value:priorAssign},
            {param:"genreator_P_rat", value:genRatedPwr},
            {param:"hydrogen_tank_SOC_start", value:useFuelCell? H2SOC : 0},
            {param:"hydrogen_tank_storage", value:useFuelCell? H2Volumn : 0},
            {param:"battery_SOC_start", value:useBattery? batStartSOC: 0},
            {param:"battery_Capacity", value:useBattery? batCapacity:0},
        ];
    }
    const handleSingleSimulation = (Fname, LHV, rho, liqRho, carbonContent, molarMass) => {
        return new Promise((resolve, reject) => {
            const changedParam = simFlagGenerator(Fname, LHV, rho, liqRho, carbonContent, molarMass);
            setFuelUnderSim(Fname);
            console.log(`Simulation Started for ${Fname}`);
    
            if (modelName === '') {
                alert("Cannot proceed with calculation: Model Name or Simulation Name is missing.");
                reject("Missing model name");
                return;
            }
            axios.post('http://127.0.0.1:5000/model/simulate', {
                model_name: modelName,
                overrides: changedParam
            }).then(response => {
                const a = formatResArrary(response.data.result).map(item => item["TotalCO2Result.showNumber"]);
                setCO2ResultCollection(prev => [...prev, { ftype: Fname, data: a }]);
                console.log(`Simulation successful for ${Fname}`);
                resolve(); 
            }).catch(error => {
                console.log('Error During Simulation:', error);
                alert(`Simulation Failed: ${error}`);
                reject(error);
            });
        });
    };
    
    const formatResArrary = (csvString)=>{
        const[keys, ...rest]=csvString.trim().split("\n").map((item)=>item.split(','));
        const normalizedKeys = keys.map((key) => key.replace(/\"/g, ""));
        return rest.map((row)=>{
            const obj = {}
            normalizedKeys.forEach((key, index)=>{
                obj[key]=isNaN(row[index])? row[index]:parseFloat(row[index]);
            });
            return obj;
        });
    }
    /** 
    const commitCarbonCalulation = async ()=>{
        fuelOptions.map((fuel)=>{
           await handleSingleSimulation(fuel.type,fuel.props.genereator_FLHV, fuel.props.genereator_Frho, fuel.props.genereator_Frho_liq, fuel.props.genereator_FcarbonConent,fuel.props.generator_MolarMass);
        })
    }*/
    const commitCarbonCalculation = async () => {
        for (const fuel of fuelOptions) {
            await handleSingleSimulation(
                fuel.type,
                fuel.props.genereator_FLHV,
                fuel.props.genereator_Frho,
                fuel.props.genereator_Frho_liq,
                fuel.props.genereator_FcarbonConent,
                fuel.props.generator_MolarMass
            );
        }
    };
    const getLatestCO2Value = (fuelType) => {
        const result = CO2ResultCollection.find((item) => item.ftype === fuelType);
        return result && result.data.length > 0 ? result.data[result.data.length - 1] : "N/A";
    };
    useEffect(() => {
        if (shouldStartSimulation) {
            commitCarbonCalculation();
            setShouldStartSimulation(false); 
        }
    }, [shouldStartSimulation]);
        

    const toggleVesselConfigr = () =>{
        setToggleVesConfig(!toggleVesConfig);
        setToggleCalCarbonEmi(false);
        //when we want to close the Vessel COnfigr tab.
        //at the moment of Clicking, if the toggleVesConfig is ture.
            // then it means we intend to turn it off.
            // so we turn off all of sub components.
        toggleVesConfig ? setToggleFuelConfig(false) : null;
        toggleVesConfig ? setToggleFuelState(false) : null;
        toggleVesConfig ? setTogglePwrTrain(false) :null;
    }
    
    const toggtoggleCalCarbonEmile =()=>{
        setToggleCalCarbonEmi(!toggleCalCarbonEmi);
        setToggleVesConfig(false);
        toggleFuelConfig ? setToggleFuelConfig(false) : null;
        toggleFuelState ? setToggleFuelState(false) : null;
        togglePwrTrain ? setTogglePwrTrain(false) :null;
    }

    const toggleFuelStateConfigr =()=>{
        setToggleFuelState(!toggleFuelState);
        setToggleFuelConfig(false);
        setTogglePwrTrain(false);
    } 
    const toggleAddFuelModConfigr =()=>{
        setToggleFuelConfig(!toggleFuelConfig);
        setToggleFuelState(false);
        setTogglePwrTrain(false);
    }
    const togglePowerTrainConfigr =()=>{
        setTogglePwrTrain(!togglePwrTrain);
        setToggleFuelState(false);
        setToggleFuelConfig(false);
    }
    const renderVesselConfigOpts = ()=>{
        return(
            <div className="vesselConfiOpts">
                <button title="Click to Add a Custom Fuel Mixture " onClick={toggleAddFuelModConfigr}>Add Fuel Type</button>
                <button title="Click to Define whether the egine takes Liqud or Gaseous Fuel" onClick={toggleFuelStateConfigr}>Set Fuel State</button>
                <button title="Click to Setup a Simple Power Production Scheme" onClick={togglePowerTrainConfigr}>Power Train </button>
            </div>
        )
    }
    const renderCalcCarbonEmi =()=>{
        return(
            <div className="vesselCO2Calc">
                <div className="carbon-calc-description">
                    <p>Estimated Carbon Dioxisde Emission base on the current power train configuration</p>
                </div>
                <table>
                    <thead><th scope="col" colSpan={7}>Vessel Configuration Receipt</th></thead>
                    <thead>
                        <tr>
                            <th>Hydrogen Tank Start Level</th>
                            <th>Hydrogen Tanlk Volumn</th>
                            <th>Generator Rated Power</th>
                            <th>Battery Capacity</th>
                            <th>Battery Start Level</th>
                            <th>Priority Mode</th>
                            <th>Fuel Type</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        <tr>
                            <td>{useFuelCell? `${H2SOC * 100} %`:"No Fuel Cell Used"}</td>
                            <td>{useFuelCell? `${H2Volumn} L`:"No Fuel Cell Used"}</td>
                            <td>{`${genRatedPwr/ 1000} kWatt`}</td>
                            <td>{useBattery? `${batCapacity} J` : "No Battery Used"}</td>
                            <td>{useBattery? `${batStartSOC * 100} %` : "No Battery Used"}</td>
                            <td>{priorAssign == 0 ? "Generator Priority" : priorAssign ==1 ? "Fuel Cell Prority" : "Hybrid"}</td>
                            <td>{fuelUnderSim}</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead><th scope="col" colSpan={4}>Carbon Emission Summary in KG (Voyage)</th></thead>
                    <thead>
                        <th>Diesel</th><th>Methanol</th><th>Natural Gas</th><th>Bio Diesel</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{getLatestCO2Value("Diesel")}</td>
                            <td>{getLatestCO2Value("Methanol")}</td>
                            <td>{getLatestCO2Value("Natural Gas")}</td>
                            <td>{getLatestCO2Value("Bio Diesel")}</td>
                        </tr>

                    </tbody>
                </table>
                <table>

                </table>
                <button onClick={()=>{
                    setCO2ResultCollection([]); 
                    setShouldStartSimulation(true);
                }}>Begin Estimation</button>
                <CarbonPlotter data={CO2ResultCollection}></CarbonPlotter>
            </div>
        )
    }
    const renderCustomeFuelOption = ()=>{
        return(
            <div className="render_custome_fuel_opt">
                <div className="custom_fuel_description">
                    <p>Other than Hydrogen, Diesel, Bio Diesel, Methanol, Methan. Create you custom fuel with specific properties</p>
                </div>
                <table>
                    <tbody>
                        <tr><td>Fuel Name: </td><td><input type ="text" placeholder="Name of Fuel" onChange={e=>handleFuelName(e)}/></td><td></td></tr>
                        <tr><td>Fuel Lower Heat Value: </td><td><input type ="number" placeholder="LHV" onChange={e=>handleLHV(e)}/></td><td>[MJ/kg]</td></tr>
                        <tr><td>Fuel Density:</td><td><input type ="number" placeholder="Density" onChange={e=>handleRHO(e)}/></td><td>[kg/m³ ]</td></tr>
                        <tr><td>Fuel Liquid Density: </td><td><input type ="number" placeholder="Liquid Density" onChange={e=>handleliqRho(e)}/></td><td>[kg/m³ ]</td></tr>
                        <tr><td>Fuel Carbon Conent: </td><td><input type ="number" placeholder="Carbon Content in %" onChange={e=>handleCarbonContent(e)}/></td><td>[%]</td></tr>
                        <tr><td>Fuel Molar Mass: </td><td><input type ="number" placeholder="Molar Mass" onChange={e=>handleMolarMass(e)}/></td><td>[kg/mol]</td></tr>
                        <tr><td scop = "col" colSpan="3">New Fuel Name: {customFuelName} - LHV: {LHV} - Density: {rho} - LiqDensity:{liqRho} - Carbon Content: {carbonConent} - Moalr Mass: {molarMass}</td></tr>
                        <tr><th scope="col" colSpan="3"><button onClick={handleAdditionalFuelType}>Add Custome Fuel Values</button></th></tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const renderFuelStateOptions =()=>{
        return (
            <div className="render_fuel_state">
                <div className="fuel_state_description">
                    <p>Choose to use Gaseous or Liquified fuel for Natural Gas or Hydrogen</p>
                </div>
                <table>
                    <tbody>
                        <tr><td>Natual Gas</td><td><Switch></Switch></td></tr>
                        <tr><td>Hydrogen </td><td><Switch></Switch></td></tr>
                    </tbody>
                </table>
            </div>
        )
    }
    
    const renderPwrConfigOptions =()=>{
        return(
            <div className="render_mini_pwr_configr">
                <div className="mini_pwr_description">
                    <p>Configure a Simple Power Production Scheme to Test the Performance of different Fuel</p>
                </div>
                <table>
                    <tbody>
                        <tr><td>Use Battery ? </td><td><select value = {useBattery.toString()} onChange={e=>setUseBattery(e.target.value === "true")}>{renderTrueNFalse()}</select></td></tr>
                        {useBattery &&(
                            <>
                                <tr>
                                    <td>Battery Start Level Of Charge</td>
                                    <td><input type ="number" placeholder="Start SOC, Default to 90%" onChange={handleBatStartSOC} /></td>
                                </tr>
                                <tr>
                                    <td>Battery Capacity</td>
                                    <td><input type="number" placeholder="Battery Capcity, Default to 7.74e+8 J" onChange={handleBatCapcity}/></td>
                                </tr>
                            </>

                        )}
                        <tr><td>Use Fuel Cell ? </td><td><select value ={useFuelCell.toString()} onChange={e=>setUseFuelCell(e.target.value === "true")}>{renderTrueNFalse()}</select></td></tr>
                        {useFuelCell &&(
                           <>
                                <tr>
                                    <td>Hydrogen Tank Start Level</td>
                                    <td><input type="number" placeholder="Hydrogen Tank Start SOC, Default to 100%" onChange={handleH2SOC}/></td>
                                </tr>
                                <tr>
                                    <td>Hydrogen Tank Volumn</td>
                                    <td><input type="number" placeholder="Hydrogen Tank Volumn, Default to 27 liter" onChange={handleH2Volumn}/></td>
                                </tr>
                           </>
                        )}
                        <tr>
                            <td>Generator Rated Power</td>
                            <td><input type="number" placeholder="Generator Rated Power, Default 100kWatt" onChange={handleGenRatedPwr}/ ></td>
                        </tr>
                        <tr><td>Priority Assignment</td><td><select value= {priorAssign} onChange ={e=>setPrioriAssign(e.target.value)}>{renderPriotiySelectOptions()}</select></td></tr>
                        {priorAssign == 2 && (
                            <>
                                <tr>
                                    <td>Generator's Share on Power Demand</td>
                                    <td><input type="number" placeholder = "Generator's share on" onChange={handlePriorityAssign}/></td>
                                </tr>
                                <tr>
                                    <td>Fuel Cell's Share on Power Demand</td>
                                    <td><input/></td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
    
    return(
        <>
            <div className="optimisation-description">
                <p>Predict vessel carbon emission under various fuel type usage</p>
            </div>
            <div className="ves-config-toggle">
                <button onClick={toggleVesselConfigr}>Simple Vessel Configurator</button>
                <button onClick={toggtoggleCalCarbonEmile}>Calulate Carbon Dioxide Emission </button>
            </div>
            {toggleVesConfig? (renderVesselConfigOpts()):null}
            {toggleFuelConfig?(renderCustomeFuelOption()):null}
            {toggleFuelState?(renderFuelStateOptions()):null}
            {togglePwrTrain?(renderPwrConfigOptions()):null}
            {toggleCalCarbonEmi? (renderCalcCarbonEmi()):null}
        </>
    )
}
export default CarbonEmission;