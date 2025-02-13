import React, {useState} from "react";
import "./Styling/FuelOptimisation.css"; 
const ALL_DEFAULT_FUEL_TYPE = ["Liquified Hydrogen", "Marine Diesel", "Bio Diesel", "Methan", "Ammonia"];
const FuelOptimisation =()=>{
  const [selectCustomFuel, setSelecteCustomFuel] = useState(false);
  const toggleCustomFuel =()=>{setSelecteCustomFuel(!selectCustomFuel)};
  return(
    <div className="fuel-consumption-optimisation">
      <div className="optimisation-description">
        <p>Fuel Consumption Optimisation will explore the options of different fuel mixure to save expenses</p>
      </div>
      <div className="fuel-optimisation-selection">
          <button>Marine Diesel</button>
          <button>Mathanol</button>
          <button>Methan</button>
          <button>Ammonia</button>
          <button onClick={toggleCustomFuel} className="submition">Custom</button>
      </div>
      {
        selectCustomFuel ? (
            <div>
                <div className="custome=fuel-prop">
                    <table>
                        <tbody>
                            <tr><td><label>Fuel LHV</label></td><td><input type="number" placeholder="Fuel LHV"/></td></tr>
                            <tr><td><label>Fuel Density</label></td><td><input type="number" placeholder="Density"/></td></tr>
                            <tr><td><label>Fuel Liquid Density</label></td><td><input type="number" placeholder="Liquid Density"/></td></tr>
                            <tr><td><label>Fuel Carbon Content</label></td><td><input type="number" placeholder="Liquid Carbon Content"/></td></tr>
                            <tr><td><label>Fuel Molar Mass</label></td><td><input type="number" placeholder="Molar Mass"/></td></tr>
                            <tr><td><label>Fuel Molar Energy</label></td><td><input type="number" placeholder="Molar Energy"/></td></tr>
                        </tbody>
                    </table>
                    
                </div>
                <button className="submition">Submit</button>
            </div>
        ):null}
        <select className="fuel-price-projection">
            {ALL_DEFAULT_FUEL_TYPE.map((item, index)=><option value = {item} key={`fuel-opt_SA_-${index}`}>{item}</option>)}
        </select>
        <button className="submition">Optimise Fuel Cosumption</button>
        <table className="fuel-opt-fin-expense">
            <caption>Duty Cycle Optimisation Expense Table</caption>
            <thead>
                <tr><th>Hydrogen(£/yr)</th><th>Marine Diesel(£/yr)</th><th>Bio Diesel(£/yr)</th><th>Ammonioa(£/yr)</th><th>Methan(£/yr)</th></tr>
            </thead>
            <tbody>
                <tr><td></td><td></td><td></td><td></td><td></td></tr>
            </tbody>
        </table>
        <table className="fuel-optisation-summarytable">
            <caption>Fuel Optimisation Summary Table</caption>
                <thead>
                    <tr>
                        <th>Current Expense per Voyage</th>
                        <th>Sum Expense Projection 5 Years</th>
                        <th>Optimised Expense per Voyage</th>
                        <th>Optimised Sum Expense Projecion 5 Years</th>
                        <th>Optimised Sum Expense Projection 10 Years</th>
                    </tr>
                </thead>
                <tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody>
        </table>
    </div>
  )
}
export default FuelOptimisation