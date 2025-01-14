import React, { useContext, useState } from "react";
import Papa from "papaparse";
import { ResultsContext } from "../App";

const ResultTableDisplay = () => {
    const results = useContext(ResultsContext);
    const [selectedResult, setSelectedResult] = useState([]);
    const [currentSelection, setCurrentSelection] = useState(""); 
    const resultNameOption = () => {
        return results.length > 0 ? (
            [<option key = {"res_name_placeholder"} value ={null}> Select a Simulation</option>, ...results.map((item, index) => (
                <option key={`res_name_${index}`} value={item.sim_name}>
                    {item.sim_name}
                </option>
            ))]
        ) : (
            <option key={"res_name_no_sim"}>No Simulation Done</option>
        );
    };
    const resOptionSelection = (e) => {
        const selectedSimName = e.target.value;
        setCurrentSelection(selectedSimName); 
        const res = results.find((item) => item.sim_name === selectedSimName)?.data;
        if (res) {
            setSelectedResult(Papa.parse(res, { header: true }).data);
        } else {
            setSelectedResult([]);
        }
    };

    return (
        <div className="result-display">
            <div className="result-selector">
                <label>Select an Experimental Result</label>
                <select
                    value={currentSelection} 
                    onChange={(e) => resOptionSelection(e)}
                >
                    {resultNameOption()}
                </select>
            </div>
            <div className="csv-container">
                <h3>Simulation Result Display</h3>
                <div className="csv-table-container">
                    <table className="csv-table">
                        <thead>
                            <tr>
                                {selectedResult.length > 0 &&
                                    Object.keys(selectedResult[0]).map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedResult.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.values(row).map((value, cellIndex) => (
                                        <td key={cellIndex}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResultTableDisplay;
