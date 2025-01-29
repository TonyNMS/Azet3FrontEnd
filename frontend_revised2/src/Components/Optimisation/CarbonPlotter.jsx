import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Legend, Title, Tooltip } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Title, Tooltip);

const CarbonPlotter = ({ data }) => {
    if (!data || data.length === 0) return <p>No data available</p>;

   
    const labels = data[0]?.data.map((_, index) => `Run ${index + 1}`);

    
    const chartData = {
        labels,
        datasets: data.map((item, index) => ({
            label: item.ftype, 
            data: item.data, 
            borderColor: `hsl(${index * 60}, 70%, 50%)`, 
            backgroundColor: `hsl(${index * 60}, 70%, 80%)`,
            fill: false,
            tension: 0.3,
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "CO2 Emission Results" },
        },
        scales: {
            x: { title: { display: true, text: "Simulation Runs" } },
            y: { title: { display: true, text: "CO2 Emissions" } },
        },
    };

    return (
        <div style={{ width: "80%", margin: "auto" }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default CarbonPlotter;
