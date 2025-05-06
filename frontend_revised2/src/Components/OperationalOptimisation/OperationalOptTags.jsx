import React, {useState, useEffect, CSSProperties} from "react";
import { useCallback } from "react";
import {useDropzone} from "react-dropzone";
import * as XLSX from 'xlsx';
import Plot from 'react-plotly.js';
import "../Styling/OprOptTabs.css"
import ParameterList from "../ParameterList";
import {ClipLoader} from "react-spinners";
const CREW_OCCUPATION_LIST =[
  "Captain", "1st Mate", "Chief Engineer", "Chief Mechanic", "Medic",
  "Operator", "Cook"
];
const OPTIMUA = [
  {
    name: 'Cost Optimum',
    x: 5768.1,
    y: 36.6,
    z: 3.4,
    color: '#2ecc71',
  },
  {
    name: 'Time Optimum',
    x: 17032.4,
    y: 22.7,
    z: 24.2,
    color: '#f1c40f',
  },
  {
    name: 'Carbon Optimum',
    x: 6171.1,
    y: 39.6,
    z: 3.6,
    color: '#9b59b6',
  },
];

const start_cost = 0, end_cost = 100000;
const start_time = 0,    end_time = 60;
const start_co2  = 0,    end_co2  = 175;
const DIESEL_PRICE_PLACEHOLDER = 1.23;
const HYDROGEN_PRICE_PLACEHOLDER = 4.56;
const OperationalOptTags = ()=>{
  const [data3d, setData3d] = useState({ x: [], y: [], z: [] });
  const [pareto3d, setPareto3d] = useState({ x: [], y: [], z: [] });
  const [status, setStatus]   = useState('loading'); // 'loading' | 'error' | 'ready'
  
  const [isResultLoading, setIsResultLoading] = useState (false);
  const [isRendeResult, setIsRenderResult] = useState(false);
  
  const [inputText, setInputText] = useState("");
  const [dutyCycleName, setDutyCycleName] = useState();
  const [dutyCycleData, setDutyCycleData] = useState({power:[], time:[]});
  const [engineEffciency, setEngineEffciency] = useState([]);
  const [dieselPrice, setDieselPrice] = useState('');
  const [hydrogenPrice, setHydrogenPrice] = useState('');
  const [crewConfiguration, setCrewConfiguration] = useState([]);

  const  EXCEL_URL ='/src/assets/Ians_Optimized_Speed_Power_For_FC_ALL_COST_Time_and_CO2_VALUES.xlsx';
  useEffect(() => {
    fetch(EXCEL_URL)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.arrayBuffer();
      })
      .then(buffer => {
        const wb = XLSX.read(buffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const dataRows = rows.slice(1);

        // Apply threshold filtering
        const filtered = dataRows.filter(r =>
          r.length >= 3 &&
          +r[0] >= start_cost && +r[0] <= end_cost &&
          +r[1] >= start_time && +r[1] <= end_time &&
          +r[2] >= start_co2  && +r[2] <= end_co2
        );

        // Build point objects
        const points = filtered.map(r => ({ x: +r[0], y: +r[1], z: +r[2] }));

        // Compute Pareto front (O(n^2))
        const front = points.filter(p =>
          !points.some(q => dominates(q, p))
        );

        // Split into arrays
        setData3d({
          x: points.map(p => p.x),
          y: points.map(p => p.y),
          z: points.map(p => p.z)
        });
        setPareto3d({
          x: front.map(p => p.x),
          y: front.map(p => p.y),
          z: front.map(p => p.z)
        });
        setStatus('ready');
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  }, []);
    
  const onDrop = useCallback(acceptedFiles => {
      const file = acceptedFiles[0];
      if (!file) return;
  
      setDutyCycleName(file.name);
  
      const reader = new FileReader();
      reader.onload = e => {
        const data = new Uint8Array(e.target.result);
    
        const wb = XLSX.read(data, { type: 'array' });
  
        const ws = wb.Sheets[wb.SheetNames[0]];
      
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
     
        const dataRows = rows.slice(1);
  
        const power = [];
        const time  = [];
  
        dataRows.forEach(row => {
         
          if (row.length >= 2) {
            power.push(row[0]);
            time.push(row[1]);
          }
        });
        console.log(power)
        setDutyCycleData({ power, time });
      };
  
      reader.readAsArrayBuffer(file);
    }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  });
  const renderDutyCycleDropZone = () => (
    <div className="dutycycle-loading">
      <h3>Duty Cycle Drop Zone</h3>
      <div {...getRootProps()} className="dropzone-rect">
        <input {...getInputProps()} />
        {isDragActive
          ? <p>Drop Excel file here…</p>
          : <p>Drag & drop an .xlsx file, or click to select</p>
        }
      </div>
    </div>
  );
  let inputHandeler =(e)=>{
    setInputText(e.target.value);
  };
  
  const renderFuelPriceSelector  = ()=>{
    return(
      <>
      {/* Left: two rows of inputs */}
      <h3>Fuel Price Configurator</h3>
      <div
        className="fuel-price-section"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Diesel row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ width: '80px' }}>Diesel:</label>
            <input
              type="number"
              value={dieselPrice}
              onChange={e => setDieselPrice(e.target.value)}
              style={{ width: '100px', padding: '4px' }}
            />
            <span>USD/L</span>
            <button onClick={()=>setDieselPrice(DIESEL_PRICE_PLACEHOLDER)} style={{ marginLeft: '8px' }}>
              Fetch live price
            </button>
          </div>

          {/* Hydrogen row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ width: '80px' }}>Hydrogen:</label>
            <input
              type="number"
              value={hydrogenPrice}
              onChange={e => setHydrogenPrice(e.target.value)}
              style={{ width: '100px', padding: '4px' }}
            />
            <span>USD/kg</span>
            <button onClick={()=>setHydrogenPrice(HYDROGEN_PRICE_PLACEHOLDER)} style={{ marginLeft: '8px' }}>
              Fetch live price
            </button>
          </div>
        </div>
      </div></>
    ) 
  }
  const renderOptimisationCheckBoxContainer =()=>{
    return(
      <div className="opt-checkbox-section">
        <div className= "opt-checkbox-title">
          <h3>Optimisation Target Configurator</h3>
        </div>
        <label>For Least Carbon Emission</label>
        <input type="checkbox"></input>
        <label>For Least Time Spend</label>
        <input type="checkbox"></input>
        <label>For Least Overall Cost</label>
        <input type="checkbox"></input> 
      </div>
    )
  }
  const renderOldPowerTrainConfiguration = () => (
    <div>
      <h4>Current Power Train Configuration</h4>
      <div className="quick-access-panel">
        <button value ={"generator"} onClick={e=>inputHandeler(e)}>Generator</button>
        <button value={"fuel_"} onClick={e=>inputHandeler(e)}>Fuel</button>
        <button value={"fuelCell"} onClick={e=>inputHandeler(e)}>FuelCell</button>
        <button value={"fuel_tank"} onClick={e=>inputHandeler(e)}>Fuel Tank</button>
        <button value={"hydrogen_tank"} onClick={e=>inputHandeler(e)}>Hydrogen Tank</button>
        <button value={"battery"} onClick={e=>inputHandeler(e)}>Battery</button>
        <button value={""} onClick={e=>inputHandeler(e)}> Show All</button>
      </div>
      <div className ="search">
          <input type ='search' onChange = {inputHandeler} placeholder="Search a Parameter"></input>
      </div>
      <ParameterList input = {inputText}></ParameterList>
    </div>
  );
 
  const renderCrewConfigurator =()=>{
    return (
      <div className="crew-configuration">
        <h3>Vessel Crew Configurator</h3>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Count</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Hourly Rate</th>
                <th style={{ padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crewConfiguration.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px' }}>
                    <select
                      value={row.role}
                      onChange={updateRow(idx, 'role')}
                      style={{ width: '100%' }}
                    >
                      <option value="">– Select Role –</option>
                      {CREW_OCCUPATION_LIST.map(role => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="number"
                      value={row.count}
                      onChange={updateRow(idx, 'count')}
                      min="0"
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="number"
                      value={row.hourlyRate}
                      onChange={updateRow(idx, 'hourlyRate')}
                      min="0"
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <button onClick={() => removeRow(idx)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="crew-add-button">
          <button onClick={addRow}>Add Crew Member</button>
        </div>
      </div>
    );
  }
  const renderEngineEffciencyConfigurator =()=>{
    return(
      <div className = "engine-effciency-section">
        <h3>Estimated Engine Effciency Configurator</h3>
        <label>Estimated Engine Effciency: </label>
        <input
          type="number"
          value={engineEffciency}
          onChange={e=>setEngineEffciency(e.target.value)}
        />
        <span>%</span>
      </div>
    )
  }
  const renderDutyCycyelPlot=()=>{
    const { power, time } = dutyCycleData;
      // If no data yet, show a placeholder
      if (power.length === 0 || time.length === 0) {
        return <p>No duty cycle data to plot.</p>;
      }

      return (
        <div className="duty-cycle-plot">
          <Plot
            data={[
              {
                x: time,
                y: power,
                type: 'scatter',
                mode: 'lines',
                line:   { shape: 'linear' }
              }
            ]}
            layout={{
              title: {text:'Duty Cycle: Power vs Time'},
              xaxis: { title: {text : 'Time (hr)'} },
              yaxis: { title: {text : 'Power (kW)'} },
              autosize: true,
            }}
            style={{ width: '100%', height: '350px' }}
            config={{ displayModeBar: false }}
          />
        </div>
      );
  }
  const render3dScatterPlot =()=>{
    if (status === 'loading') return <p>Loading data…</p>;
    if (status === 'error')   return <p style={{ color: 'red' }}>Failed to load data</p>;  
      return(
        <div>
          <Plot
            data={[
              {
                x: data3d.x,
                y: data3d.y,
                z: data3d.z,
                type: 'scatter3d',
                mode: 'markers',
                marker: { size: 3, opacity: 0.4, color: '#888' },
                name: 'All points'
              },
              {
                x: pareto3d.x,
                y: pareto3d.y,
                z: pareto3d.z,
                type: 'scatter3d',
                mode: 'markers',
                marker: { size: 6, symbol: 'diamond', color: '#e74c3c' },
                name: 'Pareto Front'
              },
              {
                x: OPTIMUA.map(p => p.x),
                y: OPTIMUA.map(p => p.y),
                z: OPTIMUA.map(p => p.z),
                type: 'scatter3d',
                mode: 'markers+text',
                marker: {
                  size: 8,
                  symbol: 'circle',
                  color: OPTIMUA.map(p => p.color),
                  line: { width: 1, color: '#333' }
                },
                text: OPTIMUA.map(p => p.name),
                textposition: 'top center',
                textfont: { size: 12, color: '#333' },
                name: 'Optimum points'
              }
            ]}
            layout={{
              title: { text: '3D Scatter with Pareto Front' },
              autosize: true,
              scene: {
                xaxis: { title: { text: 'Cost (GBP)' } },
                yaxis: { title: { text: 'Time (Hr)' } },
                zaxis: { title: { text: 'CO₂ Emission (Tonnes)' } }
              }
            }}
            config={{ webgl2: true, displayModeBar: true }}
            style={{ width: '100%', height: '600px' }}
          />
        </div>
      )
  }
 
  const renderOptimumable=()=>{
     return(
      <div className="optimum-result-section">
        <h4>Table of Optimized Outcome</h4>
        <table>
          <thead>
            <tr>
              <th></th><th>Cost Optimum</th><th>Time Optimum</th><th>Carbon Optimum</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Cost (£)</td><td>5768.1</td><td>17032.4</td><td>6171.1</td></tr>
            <tr><td>Time (Hrs)</td><td>36.6</td><td>22.7</td><td>39.6</td></tr>
            <tr><td>CO₂ (t)</td><td>3.4</td><td>24.2</td><td>3.6</td></tr>
          </tbody>
        </table>
      </div>
     )
  } 
  // Helper: does a dominate b in all objectives?
  const dominates = (a, b) => {
    const le = a.x <= b.x && a.y <= b.y && a.z <= b.z;
    const lt = a.x <  b.x || a.y <  b.y || a.z <  b.z;
    return le && lt;
  };
  // Add an empty row
  const addRow = () => {
    setCrewConfiguration(prev => [
      ...prev,
      { role: "", count: "", hourlyRate: "" }
    ]);
  };

 
  const removeRow = idx => {
    setCrewConfiguration(prev => prev.filter((_, i) => i !== idx));
  };

  const updateRow = (idx, field) => e => {
    const value = e.target.value;
    setCrewConfiguration(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };
  const handleOptimisationButtonClick =()=>{
    setIsResultLoading(true);
    setIsRenderResult(false);

    setTimeout(
      ()=>{
        setIsResultLoading(false);
        setIsRenderResult(true);
      }, 4000);
  }

  return(
    <div className="operational-optimisation-section">

      {/* First row */}
      <div className="row row-top">
        <div className="card card-duty">{renderDutyCycleDropZone()}</div>
        <div className="card card-plot">{renderDutyCycyelPlot()}</div>
        <div className="card card-fuel">{renderFuelPriceSelector()}</div>
      </div>

      {/* Second row */}
      <div className="row row-old">
        <div className="card card-old">{renderOldPowerTrainConfiguration()}</div>
      </div>

      {/* Third row */}
      <div className="row row-config">
        <div className="card card-crew">{renderCrewConfigurator()}</div>
        <div className="card card-optcheckbox">{renderOptimisationCheckBoxContainer()}</div>
        <div className="card card-action">
          <button onClick={() => handleOptimisationButtonClick()}>
            {isResultLoading ? 'Loading...' : 'Start Simulation'}
          </button>
        </div>
      </div>

      {/* Fourth row */}
      <div className="row row-engine">
        <div className="card card-engine">{renderEngineEffciencyConfigurator()}</div>
      </div>

      {/* Fifth row */}
      {isRendeResult &&  (
        <div className="row row-result">
          <div className="card card-result3d">{render3dScatterPlot()}</div>
          <div className="card card-resultopt">{renderOptimumable()}</div>
        </div>
      )}
      {!isRendeResult && isResultLoading && (
        <div className="row row-result">
          <div className="card card-result3d">
            <div style={{ marginTop: '24px' }}>
              <ClipLoader
                loading={isResultLoading}
                size={48}
                color="#3498db"
                aria-label="Loading Spinner"
              />
            </div>
          </div>
          <div className="card card-resultopt">
            <div style={{ marginTop: '24px' }}>
              <ClipLoader
                loading={isResultLoading}
                size={48}
                color="#3498db"
                aria-label="Loading Spinner"
              />
            </div>
          </div>
          
        </div>
      )}

    </div>
  )
}
export default OperationalOptTags;