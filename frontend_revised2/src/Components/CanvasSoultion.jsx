import React, { useEffect, useRef, useState } from "react";
import {Canvas, Rect, Circle, Line, IText, Polygon } from "fabric";
//import "../Components/Styling/CanvasSoultion.css"
const CanvasSoultion =()=>{
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    useEffect(() => {
        
        if (!canvasRef.current) return;
    
        const fabricCanvas = new Canvas(canvasRef.current, {
            selection: false,
            backgroundColor: "#f0f0f0",
        });
    
        
        fabricCanvas.setWidth(1500); 
        fabricCanvas.setHeight(800); 
        
    
        const batteryText = new IText("Battery", {
            left: 110,
            top: 160,
            fontSize: 16,
            fill: "black",
            selectable: false,
        });
    
        
        const fuelCellText = new IText("Fuel Cell", {
            left: 290,
            top: 160,
            fontSize: 16,
            fill: "black",
            selectable: false,
        });
    
        const connection = new Line([180, 125, 300, 125], {
            stroke: "black",
            strokeWidth: 2,
            selectable: false,
        });

        const masterController = new Rect({
            left: 469,
            top :290,
            fill:"#EB5A3C",
            width:220,
            height:220,
            selectable: true,
        })
        const fuelCell = new Rect({
            left: 800,
            top: 220,
            fill: "#0A5EB0",
            width: 180,
            height:60,
            selectable:true
        });
        const fuelCellTank = new Circle({
            left: 705,
            top: 50,
            fill: "#B1F0F7",
            radius: 45,
        })
        const generator = new Rect({
            left: 800,
            top: 500,
            fill:"#B3C8CF",
            width:180,
            height:60,
            selectable: true
        })

        const genereatorTank = new Circle({
            left: 705,
            top:  650,
            fill: "#86A7FC",
            radius:45,
        });
        const battery = new Rect({
            left: 800,
            top:360,
            fill:"#AEEA94",
            width:180,
            height:60,
            selectable: true
        });
      
        fabricCanvas.add(battery, batteryText, generator, genereatorTank,fuelCell, fuelCellTank, fuelCellText, connection, masterController);
        fabricCanvas.renderAll();
    
        return () => {
            fabricCanvas.dispose();
        };
    }, []);
    
    return(
        <div style={{width:"100%", height: "750px", display:"flex", justifyContent:"center", alignContent:"center"}}>
            <canvas ref={canvasRef}></canvas>
        </div>
        
    ) 
}
export default CanvasSoultion