
import React, {useContext, useState} from "react"
import {Line} from "react-chartjs-2"
import {Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend} from "chart.js";
import { ResultsContext } from "../App";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
const Plotter =()=>{
    const result = useContext(ResultsContext);
    const [plottingData, setPlottingData]=useState([]);
    const [currentFormatedResult, setCurrentFormatedResult] = useState([]);
    const [currentFomatedTitleCollection, setCurrentFomatedTitleCollection] = useState([]);
    const [currentSimName, setCurrentSimName] = useState('');
    const [currentXTitle, setCurrentXTitile] = useState('');
    const [currentYTitle, setCurrentYTitile] = useState('');
    const [xVarName, setXVarName] = useState('');
    const [yVarName, setYVarName] = useState('');
    const formatTitleArray = (csvString)=>{
        //extract the Array of avalible varaibles to plot 
        const[keys, ...rest]=csvString.trim().split("\n").map((item)=>item.split(','));
        for(let i=0; i<keys.length; i++){
            keys[i]=keys[i].replace(/\"/g, "");
        };
        return keys;
    }
    const formatResArrary = (csvString)=>{
        // formate the csvstring from the simulation in a array
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
    const formatedResCollection=result.map((item)=>{
            const name = item.sim_name;
            const data = formatResArrary(item.data);
            return {"name": name, "data" : data} 
    })
    const formatedTitlesCollection = result.map((item)=>{
        const name = item.sim_name;
        const titles = formatTitleArray(item.data);
        return {"name": name, "titles" : titles} 
    })
    
    const simulationResultOptions =()=>{
        return result.length > 0 ? (
            [<option key = {"sim_name_placeholder"} value ={null}> Select a Simulation</option>, ...result.map((item, index) => (
                <option key={`sim_name_${index}`} value={item.sim_name}>
                    {item.sim_name}
                </option>
            ))]
        ) : (
            <option key={"sim_name_no_sim"}>No Simulation Done</option>
        );
    }
    const handleCurrentSimulationSelection = (e)=>{
        // if a simulation name is chosen, then we  ready corresponding data for the other selectors
        setCurrentSimName(e);
        const selectedData = formatedResCollection.find((item) => item.name === e)?.data;
        const selectedTitles = formatedTitlesCollection.find((item) => item.name === e)?.titles;    
        setCurrentFormatedResult(selectedData === undefined ? []:selectedData);
        setCurrentFomatedTitleCollection(selectedTitles===undefined? []:selectedTitles);
        if (selectedTitles.includes("time")) {
            setCurrentXTitile("time");
        } 
    }
    const filteredVaraibleListX = currentFomatedTitleCollection.filter((el)=>{
            return xVarName === '' ? el : el.includes(xVarName);
        }
    );
    const filteredVariableListY = currentFomatedTitleCollection.filter((el)=>{
            return yVarName === '' ? el : el.includes(yVarName);
        }
    );
    const inputHandelerX = (e)=>{setXVarName(e);};
    const inputHandelerY = (e) =>{setYVarName(e);};
    const xAxisOptions = ()=>{
        return currentFomatedTitleCollection.length>0 ?(
            [   
                <option key = {"x-axis_placeholder"} value ={null}>Select A Variable</option>,
                ...filteredVaraibleListX.map((item, index)=><option value={item} key={`x-axis_placeholder_${index}`}>{item}</option>)
            ]
        ):(
            <option key={"x-axis_no_sim"}>No Simulation Selected</option>
        );
    }
    const handleXAxisOptions = (e)=>{setCurrentXTitile(e);}
    const yAxisOptions =()=>{
        return currentFomatedTitleCollection.length>0 ?(
            [
                <option key = {"y-axis_placeholder"} value ={null}>Select A Variable</option>,
                ...filteredVariableListY.map((item, index)=><option value={item} key={`y-axis_${index}`}>{item}</option>)
            ]
        ):(
            <option key={"y-axis_no_sim"}>No Simulation Selected</option>
        );
    }
    const handleYAxisOptions=(e)=>{
        setCurrentYTitile(e);
    }
    const handleSubmission =()=>{
        setPlottingData([...plottingData, {
            "sim_name": currentSimName,
            "xName" :currentXTitle,
            "yName" :currentYTitle,
            "xData" :currentFormatedResult.map(item=>item[currentXTitle]),
            "yData" :currentFormatedResult.map(item=>item[currentYTitle])
        }])  
    }
    const generateChartData = () => {
        return {
            labels: [], 
            datasets: plottingData.map((data, index) => ({
                label: `${data.sim_name} --> ${data.yName} vs ${data.xName}`,
                data: data.xData.map((x, i) => ({ x, y: data.yData[i] })),
                borderColor: `hsl(${(index * 50) % 360}, 70%, 50%)`, 
                backgroundColor: `hsla(${(index * 50) % 360}, 70%, 50%, 0.5)`,
                borderWidth: 1,
                pointRadius:0,
                tension: 0.2,
                fill : false,
            })),
        };
    };
    const options={
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Simulation Data Plot' },
        },
        scales: {
            x: {
                type: 'linear',
                title: { 
                    display: true, text: plottingData[0]?.xName || 'X-Axis' },
                ticks:{
                    callback: function(value) {
                        return Math.round(value);
                    },
                    color: 'red'
                }    
            },
            y: { title: { display: true, text: 'Y-Axis' } },
        },
    }
    
   
    

    return(
        <div className = "plotter=container ">
            <h3>Plot goes here</h3>
            <div className="plot-option-container">
                <select value = {currentSimName} onChange={(e)=>handleCurrentSimulationSelection(e.target.value)}>{simulationResultOptions()}</select>
                <div>
                    <input type ='search' placeholder="Search a Variable" onChange={(e)=>{inputHandelerX(e.target.value)}}></input>
                    
                    <select onChange={(e)=>handleXAxisOptions(e.target.value)}>{xAxisOptions()}</select>
                </div>
                <div>
                    <input type ='search' placeholder="Search a Variable" onChange={(e)=>{inputHandelerY(e.target.value)}}></input>

                    <select onChange={(e)=>handleYAxisOptions(e.target.value)}>{yAxisOptions()}</select>
                </div>
                
                <button onClick={handleSubmission}>Submit</button>
            </div>
            <div className = "plot-display-container">
                <Line data={generateChartData()} options={options} className="plot-region"></Line>
            </div>
        </div>
    )
}
export default Plotter;