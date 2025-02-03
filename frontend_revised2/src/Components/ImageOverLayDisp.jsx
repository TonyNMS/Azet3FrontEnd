import React, { useState } from "react";
import { Tooltip as ReactTooltip, Tooltip } from 'react-tooltip'
import modelicaImage from "../assets/modelicaImage.png"
const ImageoverLayDisp = () =>{
    const [data, setData] = useState(
        {
            battery:"Capcity: 1200kWh",
            generator:"Rated Power Output: 100kW"
        }
    )
    const container_area = {
        position:"relative",
        width: "850px",
        height:"600px",
        backgroundImage:`url(${modelicaImage})`,
        backgroundSize:"contain",
        backgroundRepeat:"no-repeat",
        display:"flex", 
        justifyContent:"center", 
        alignContent:"center"
    }
    const battery_tooltip={
        position:"absolute",
        top:"200px",
        left:"333px",
        padding:"5px",
        background:"green",
        color:"white",
        borderRadius:"5px",
        cursor:"pointer"
    }
    const generator_tooltip={
        position:"absolute",
        top:"305px",
        left:"290px",
        padding:"5px",
        background:"green",
        color:"white",
        borderRadius:"5px",
        cursor:"pointer"
    }
    return(
        <div style={container_area}>
            <div style={battery_tooltip}><a data-tooltip-id="tt-test_bat" data-tooltip-content={`Battery ${data.battery}`} style={{color:"white"}}>Test Battery</a></div>
            <div style={generator_tooltip}><a data-tooltip-id="tt-test_gen" data-tooltip-content={`Generator ${data.generator}`} style={{color:"white"}}>Test Generator</a></div>
            <Tooltip id="tt-test_bat"></Tooltip>
            <Tooltip id="tt-test_gen" place="right"></Tooltip>
        </div>
    )
}

export default ImageoverLayDisp;