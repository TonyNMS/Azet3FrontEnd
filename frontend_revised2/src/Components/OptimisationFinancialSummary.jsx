import { useState } from 'react';

const OptimisationFinancialSummary = () => {
    const [toggleSummaryTable, setToggleSummaryTable] = useState(false);
    const [selectedRows, setSelectedRows] = useState({});
    const [sumEstCo2Ton, setsumEstCo2Ton] = useState(0);
    const [sumImmCost, setSumImmCost] = useState(0);
    const [sumCapEx5yr, setSumCapEx5yr] = useState(0);
    const [sumOpEx5yr, setSumOpxC5Yr] = useState(0);
    const [sumGain5yr, setSumgain5yr] = useState(0);
    const handleToggle = () => {
        setToggleSummaryTable(!toggleSummaryTable);
    };

    const handleCheckboxChange = (index, item) => {
        setSelectedRows((prevSelected) => {
            const isSelected = !prevSelected[index];
    
            if (isSelected) {
                setsumEstCo2Ton((prev) => prev + Number(item.co2_reduc || 0));
                setSumImmCost((prev) => prev + Number(item.imm_cost || 0));
                setSumCapEx5yr((prev) => prev + Number(item.capOx || 0));
                setSumOpxC5Yr((prev) => prev + Number(item.opEx || 0));
                setSumgain5yr((prev) => prev + Number(item.gain_5yr || 0));
            } else {
                setsumEstCo2Ton((prev) => prev - Number(item.co2_reduc || 0));
                setSumImmCost((prev) => prev - Number(item.imm_cost || 0));
                setSumCapEx5yr((prev) => prev - Number(item.capOx || 0));
                setSumOpxC5Yr((prev) => prev - Number(item.opEx || 0));
                setSumgain5yr((prev) => prev - Number(item.gain_5yr || 0));
            }
    
            return {
                ...prevSelected,
                [index]: isSelected
            };
        });
    };
    
    

    const summaryTableContent = [
        { name: "Power Train Retrofit", description: "Refit the current power train with newer fuel cells and other forms of renewable resource", imm_cost: 250530, cost_10yr: "1M", gain_5yr: 0.5, gain_10yr: "1.5M", "co2_reduc":30, "capOx":170, "opEx":60, "co2_reduc_percentage":"10%"},
        { name: "Propeller Refit", description: "Use more efficient propeller", imm_cost: 50730, cost_10yr: "0.1M", gain_5yr: 0.5, gain_10yr: "0.6M","co2_reduc":32, "capOx":200, "opEx":20, "co2_reduc_percentage":"5%"},
        { name: "Slow Steaming (20%)", description: "Reduce the sail speed to reduce fuel consumption", imm_cost: 0, cost_10yr: "1.5M", gain_5yr: 0.5, gain_10yr: "1.5M","co2_reduc":0.29, "capOx":80, "opEx":30, "co2_reduc_percentage":"36%"},
        { name: "Route Optimisation", description: "More efficient shipping route", imm_cost: 250930, cost_10yr: "0.5M", gain_5yr: 0.5, gain_10yr: "1.5M","co2_reduc":22, "capOx":170, "opEx":60, "co2_reduc_percentage":"10%"},
    ];

    const renderTableContent = () => {
        return summaryTableContent.map((item, index) => (
            <tr key={`${index}-sum-tab-content`}>
                <td>
                <input 
                    type="checkbox" 
                    checked={selectedRows[index] || false} 
                    onChange={() => handleCheckboxChange(index, item)} 
                />
                </td>
                <td><p>{item.name}</p></td>
                <td><p>{item.description}</p></td>
                {selectedRows[index]  ?(
                    
                            <>
                            <td><p>{item.co2_reduc}</p></td>
                            <td><p>{item.co2_reduc_percentage}</p></td>
                            <td><p>{item.imm_cost}</p></td>
                            <td><p>{item.capOx}</p></td>
                            <td><p>{item.opEx}</p></td>
                            <td><p>{item.gain_5yr}</p></td>
                            </>              
                ):(
                    <>
                        <td></td>
                        <td><p>---</p></td>
                        <td><p>---</p></td>
                        <td><p>---</p></td>
                        <td><p>---</p></td>
                        <td><p>---</p></td>
                    </>
                )}
            </tr>
        ));
    };
    const renderTableContentB = () => {
        return summaryTableContent.map((item, index) => (
            <tr key={`${index}-sum-tab-content`}>
                <td>
                <input 
                    type="checkbox" 
                    checked={selectedRows[index] || false} 
                    onChange={() => handleCheckboxChange(index, item)} 
                />
                </td>
                <td><p>{item.name}</p></td>
                <td><p>{item.description}</p></td>
            </tr>
        ));
    };

    return (
        <div className="finance-sum-table">
            <button onClick={handleToggle}>Show Summary Table</button>
            {toggleSummaryTable ? (
                <>
                    {/*
                    <table className="gross-summary-table">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Optimisation</th>
                                <th>Description</th>
                                <th>Estimated CO2 Reduction (ton/yr)</th>
                                <th>Estimated CO2 Reduction Percentage</th>
                                <th>Immediate Cost (£)</th>
                                <th>Projected CapEx 5 Yrs (k.£)</th>
                                <th>Projected OpEx 5 Yrs (k.£)</th>
                                <th>Projected Gain 5 Yrs (M.£)</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableContent()}
                            <tr>
                                <td>Sum</td>
                                <td></td>
                                <td></td>
                                <td>30.29</td>
                                <td></td>
                                <td>250530</td>
                                <td>250</td>
                                <td>90</td>
                                <td>1</td>
                            </tr>
                        </tbody>
                    </table>*/}
                    <table className="gross-summary-table">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Optimisation</th>
                                <th>Description</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableContentB()}
                        </tbody>
                    </table>
                    <div className="optimisation-description">
                        <p>Gross Summary on Modification Expense and Gain</p>
                    </div>
                    <table className="gross-summary-table">
                        <caption>Summary Table</caption>
                        <thead>
                            <tr>
                                <th>Speed Reduction (%)</th>
                                <th>CO2 Reduction (%)</th>
                                <th>CapEx (£)</th>
                                <th>OpEx (£)</th>
                            </tr>    
                        </thead>
                        <tbody>
                            <tr>
                                
                                <td>20%</td>
                                <td>36%</td>
                                <td>80k</td>
                                <td>30k</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            ) : null}
        </div>
    );
};

export default OptimisationFinancialSummary;
