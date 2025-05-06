import React, { useState } from "react";
import { useCallback } from "react";
import {useDropzone} from "react-dropzone";
import "../Styling/TechOptiTabs.css";
import * as XLSX from 'xlsx';
import Modal from 'react-modal';
import Plot from 'react-plotly.js';
const data = [
  {
    label: 'Original',
    time: '24h',
    totalEnergy: '20,932',
    peakPower: '1,838',
    entries: [
      { config: 'Diesel',    capex: '£0',         opex: '£3,550,000', co2: '0'   },
      { config: 'Hydrogen',  capex: '£1,450,715', opex: '£1,720,000', co2: '100' },
    ]
  },
  {
    label: 'Cost',
    time: '36h 37m',
    totalEnergy: '3,986',
    peakPower: '556',
    entries: [
      { config: 'Diesel',    capex: '£0',        opex: '£400,000', co2: '81'  },
      { config: 'Hydrogen',  capex: '£235,854',  opex: '£500,000', co2: '100' },
    ]
  },
  {
    label: 'CO₂',
    time: '39h 37m',
    totalEnergy: '3,485',
    peakPower: '162',
    entries: [
      { config: 'Diesel',    capex: '£0',        opex: '£425,000', co2: '81'  },
      { config: 'Hydrogen',  capex: '£312,739',  opex: '£585,000', co2: '100' },
    ]
  },
  {
    label: 'Time',
    time: '24h',
    totalEnergy: '33,754',
    peakPower: '1,838',
    entries: [
      { config: 'Diesel',    capex: '£0',         opex: '£4,800,000', co2: '-37'  },
      { config: 'Hydrogen',  capex: '£2,940,409',  opex: '£2,250,000', co2: '100'  },
    ]
  }
];
const MODEL_STYLE ={
  content : {
    maxWidth: "1000px",
    maxHeight: "55%",
    height:"auto",
    margin:"auto",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "white",
    color:"black",
    display:"flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
    position: 'absolute'
  },
  overlay:{
    backgroundColor: "rgba(122,117,117,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
}
const ENGINE_LIST = [
{engineName : "MAN D2862 Dual Fuel", ratedPower: 749},
{engineName : "MAN D2676-LE457", ratedPower: 221},
{engineName : "MAN D2876-LE494", ratedPower: 331},
{engineName : "MAN D2868-LE426", ratedPower: 735},
{engineName : "MAN D2868-LE431", ratedPower: 500},
{engineName : "Volvo Penta D16 MG", ratedPower : 390},
{engineName : "Hyundai DL06-4L066C", ratedPower : 184},
{engineName : "Hyundai DL08-4L086C", ratedPower : 235},
{engineName : "Hyundai DX12-4L126C", ratedPower : 331},
{engineName : "Hyundai DX15-4V158C", ratedPower : 449},
];
const BATTERY_LIST =[
  "A123 2253P",
  "Placeholder Battery"
];
const FUELCELL_LIST =[
  "Horizon 30W PEM Fuel Cell",
  "Horizon 12W PEM Fuel Cell",
  "H-CELL 2.0",
  "FCmove-XD",
  "FCmove-HD+",
  "FCmove-MD"
];
const CREW_OCCUPATION_LIST =[
  "Captain", "1st Mate", "Chief Engineer", "Chief Machanic", "Medic",
  "Operator", "Cook"
];
const FUEL_LIST=[
  "Diesel", "Bio Diesel", "Marine Diesel" , "Hydrogen"
]; 
const DIESEL_PRICE_PLACEHOLDER = 1.23;
const HYDROGEN_PRICE_PLACEHOLDER = 4.56;
const TechOptiTabs =()=>{
  const [dutyCycleName, setDutyCycleName] = useState();
  const [dutyCycleData, setDutyCycleData] = useState({power:[], time:[]});
  const [dieselPrice, setDieselPrice] = useState('');
  const [hydrogenPrice, setHydrogenPrice] = useState('');
  const [crewConfiguration, setCrewConfiguration] = useState([]);
  const [engineEffciency, setEngineEffciency] = useState([]);
  const [newComponentConfiguration, setNewComponentConfiguration] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState({name:"", count:0});
  const [seletedFuelCell, setSelectedFuelCell] = useState({name:"", count:0});
  const [selectedBattery, setSelectedBattery] = useState({name:"", count:0});
  const [modelIsOpen, setModelIsOpen] = useState(false);
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

  const renderCSVDropZone = () => {
    return (
      <div className="dutycycle-loading">
        <h3> Duty Cycle Drop Zone</h3>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive
            ? <p>Drop your Excel file here…</p>
            : <p>Upload DutyCycle Here: {dutyCycleName || 'None'}</p>}
        </div>
        
      </div>
    )}
  const renderFuelPriceInput =()=>{
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
  const renderCrewConfigurator = () => {
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
  };

  const renderDutyCyclePlot = () =>{
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
          style={{ width: '100%', height: '450px' }}
          config={{ displayModeBar: false }}
        />
      </div>
    );

  }
  const renderNewPowerComponent =()=>{
    return(
      <div className="new-component-configuration" style={{ padding: '1rem' }}>
        <h3>New Power Components Configurator</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Component Category</th>
              <th>Component Model</th>
              <th>Count</th>
              <th>Action Confirm</th>
            </tr>
          </thead>
          <tbody>
            {/* Engine Row */}
            <tr>
              <td>Engine</td>
              <td>
                <select
                  value={selectedEngine.name}
                  onChange={e =>
                    setSelectedEngine(prev => ({ ...prev, name: e.target.value }))
                  }
                >
                  <option value="">-- Select Engine --</option>
                  {ENGINE_LIST.map((model, idx) => (
                    <option
                      key={`eng-${idx}`}
                      value={model.engineName}
                    >
                      {`${model.engineName} – ${model.ratedPower} kW`}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={selectedEngine.count}
                  onChange={e =>
                    setSelectedEngine(prev => ({ ...prev, count: e.target.value }))
                  }
                  style={{ width: '4rem' }}
                />
              </td>
              <td>
                <button onClick={onConfirmEngine}>Confirm</button>
              </td>
            </tr>

            {/* Battery Row */}
            <tr>
              <td>Battery</td>
              <td>
                <select
                  value={selectedBattery.name}
                  onChange={e =>
                    setSelectedBattery(prev => ({ ...prev, name: e.target.value }))
                  }
                >
                  <option value="">-- Select Battery --</option>
                  {BATTERY_LIST.map((model, idx) => (
                    <option key={`bat-${idx}`} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={selectedBattery.count}
                  onChange={e =>
                    setSelectedBattery(prev => ({ ...prev, count: e.target.value }))
                  }
                  style={{ width: '4rem' }}
                />
              </td>
              <td>
                <button onClick={onConfirmBattery}>Confirm</button>
              </td>
            </tr>

            {/* Fuel Cell Row */}
            <tr>
              <td>Fuel Cell</td>
              <td>
                <select
                  value={seletedFuelCell.name}
                  onChange={e =>
                    setSelectedFuelCell(prev => ({ ...prev, name: e.target.value }))
                  }
                >
                  <option value="">-- Select Fuel Cell --</option>
                  {FUELCELL_LIST.map((model, idx) => (
                    <option key={`fc-${idx}`} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={seletedFuelCell.count}
                  onChange={e =>
                    setSelectedFuelCell(prev => ({ ...prev, count: e.target.value }))
                  }
                  style={{ width: '4rem' }}
                />
              </td>
              <td>
                <button onClick={onConfirmFuelCell}>Confirm</button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Display the accumulated configuration 
        {newComponentConfiguration.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Configured Components</h4>
            <ul>
              {newComponentConfiguration.map((c, i) => (
                <li key={i}>
                  {c.name} &times; {c.count}
                </li>
              ))}
            </ul>
          </div>
        )}*/}
      </div>
    )
  }
  const renderEngineEffciencyConfigurator =() =>{
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
  const renderBeginOptimisationButton=()=>{
    return(
      <div className="final-button-section">
        <button onClick={handleStartOptimisationClick}>Start Optimisation</button>
      </div>
    )
  }
  const renderFinalResultOutput =()=>{
    return(
      <div className="final-result-section">
        <h3>Technical Optimisation Summary</h3>
        <table>
          <thead>
            <tr><th></th><th>Motors</th><th>Batteries</th><th>Fuel Cells</th><th>Fuel</th></tr>
          </thead>
          <tbody>
            <tr><td>Name</td><td>MAN D2868-LE431</td><td>A123 2253P</td><td>Horizon 30W PEM Fuel Cell</td><td>Hydrogen</td></tr>
            <tr><td>Quantity</td><td>2</td><td>11</td><td>3</td><td>26.1kg/m^3</td></tr>
            <tr><td>Cost(£)</td><td>14000</td><td>3000</td><td>40000</td><td>5/kg</td></tr>
            <tr><td>Capex(£) </td><td colSpan={4}> 212179</td></tr>
            <tr><td>Opex per trip (£)</td><td colSpan={4}>682</td></tr>
          </tbody>
        </table>
      </div>
    )
  }
  const renderFinalResultOutPut2  = ()=>{

    return(
      <div className="results-container">
        <h2 className="results-title">
          Fortuna Crane Powertrain results for Minimal Time, Cost, and CO₂ Duty Cycles
        </h2>
        <table className="results-table">
          <thead>
            <tr>
              <th>Minimised For</th>
              <th>Time</th>
              <th>Total energy</th>
              <th>Peak power output</th>
              <th>Powertrain configuration</th>
              <th>CapEx</th>
              <th>OpEx (5 yrs)</th>
              <th>CO₂ savings (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(group =>
              group.entries.map((entry, idx) => (
                <tr key={group.label + '-' + idx}>
                  {idx === 0 && (
                    <>
                      <th rowSpan={group.entries.length} className="group-label">
                        {group.label}
                      </th>
                      <td rowSpan={group.entries.length}>{group.time}</td>
                      <td rowSpan={group.entries.length}>{group.totalEnergy}</td>
                      <td rowSpan={group.entries.length}>{group.peakPower}</td>
                    </>
                  )}
                  <td>{entry.config}</td>
                  <td>{entry.capex}</td>
                  <td>{entry.opex}</td>
                  <td>{entry.co2}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )
  }
  const handleStartOptimisationClick  =()=>{
    setModelIsOpen(true);
  }
  const closeModal =()=>{
    setModelIsOpen(false);
  }
  // Add an empty row
  const addRow = () => {
    setCrewConfiguration(prev => [
      ...prev,
      { role: "", count: "", hourlyRate: "" }
    ]);
  };

  // Remove a row by index
  const removeRow = idx => {
    setCrewConfiguration(prev => prev.filter((_, i) => i !== idx));
  };

  // Update a field in a given row
  const updateRow = (idx, field) => e => {
    const value = e.target.value;
    setCrewConfiguration(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };
  const confirmRow = (item) => {
    if (!item.name || !item.count) return;
    setNewComponentConfiguration(prev => [
      ...prev,
      { name: item.name, count: Number(item.count) }
    ]);
    // reset that row
    return { name: '', count: '' };
  };
  const onConfirmEngine = () => {
    const reset = confirmRow(selectedEngine);
    if (reset) setSelectedEngine(reset);
  };
  const onConfirmBattery = () => {
    const reset = confirmRow(selectedBattery);
    if (reset) setSelectedEngine(reset);
  };
  const onConfirmFuelCell = () => {
    const reset = confirmRow(seletedFuelCell);
    if (reset) setSelectedEngine(reset);
  };
  return (
    <div className="technical-optimisation-section">

      <div className="card card-csv">
        {renderCSVDropZone()}
      </div>

      <div className="card card-plot">
        {renderDutyCyclePlot()}
      </div>

      <div className="card card-fuel">
        {renderFuelPriceInput()}
      </div>

      <div className="card card-crew">
        {renderCrewConfigurator()}
      </div>

      <div className="card card-newComp">
        {renderNewPowerComponent()}
      </div>

      <div className="card card-engine">
        {renderEngineEffciencyConfigurator()}
      </div>

      <div className="card card-action">
        {renderBeginOptimisationButton()}
      </div>
      <Modal
        isOpen={modelIsOpen}
        onRequestClose={closeModal}
        contentLabel="Optimisation Outcome"
        ariaHideApp={false}
        style = {
          MODEL_STYLE 
        }
        >
        {renderFinalResultOutPut2()}
      </Modal>

    </div>
  )
}

export default TechOptiTabs;