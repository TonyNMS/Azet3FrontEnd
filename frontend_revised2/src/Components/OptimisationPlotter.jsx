import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Ticks,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OptimisationPlotter = ({ optRes }) => {
  const [selectedVar, setSelectedVar] = useState("");
  const formatResArray = (csvString) => {
    const [keys, ...rest] = csvString.trim().split("\n").map((item) => item.split(","));
    const normalizedKeys = keys.map((key) => key.replace(/\"/g, ""));
    return rest.map((row) => {
      const obj = {};
      normalizedKeys.forEach((key, index) => {
        obj[key] = isNaN(row[index]) ? row[index] : parseFloat(row[index]);
      });
      return obj;
    });
  };
  const formatedRes = optRes.map((item, index) => ({
    opt_name: `Iteration ${index}`,
    data: formatResArray(item),
  }));
  const formatTitleArray = (csvString) => {
    const [keys] = csvString.trim().split("\n").map((item) => item.split(","));
    return keys.map((key) => key.replace(/\"/g, ""));
  };
  const titles = formatedRes.length > 0 ? formatTitleArray(optRes[0]) : [];
  const handleVariableSelection = (e) => {
    setSelectedVar(e.target.value);
  };

  const variableOptions =()=>{
    return titles.length > 0 ? (
        [<option key = {'opt-var-placeholde'} value={null}>Select a Varaible</option>, ...titles.map(
            (item, index)=> (<option key={`opt-var-${index}`} value={item} >
                {item}
            </option>)
        )]
    ):(
        <option key={'opt-var-no_opt'}>No Optimsation Done</option>
    )
  };

  const prepareChartData = (array, variableName) => {
    if (!variableName) return null;
    const timeKey = "time"; 
    const labels = array[0].data.map((item) => item[timeKey]);
    const datasets = array.map(({ opt_name, data }, i) => ({
      label: opt_name,
      data: data.map((item) => item[variableName]),
      borderColor: `hsl(${(i * 360) / array.length}, 70%, 50%)`,
      backgroundColor: `hsla(${(i * 50) % 360}, 70%, 50%, 0.5)`,
      borderWidth: 2,
      pointRadius:0,
      tension: 0.3,
      fill: false,
    }));

    return { labels, datasets };
  };


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        type:'linear',
        title: {
          display: true,
          text: "Time",
        },
        ticks:{
            callback: function(value){
                return Math.round(value);
            },
            color: 'red'
        }
      },
      y: {
        title: {
          display: true,
          text: selectedVar || "Variable",
        },
      },
    },
  };

  const chartData = prepareChartData(formatedRes, selectedVar);

  return (
    <div>
      <div className="opr-res-selector">
        <select onChange={handleVariableSelection} value={selectedVar}>
          {variableOptions()}
        </select>
      </div>
      
      {chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Please select a variable to plot.</p>
      )}
    </div>
  );
};

export default OptimisationPlotter;
