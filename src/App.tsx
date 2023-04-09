import React, { useEffect } from 'react';
import { useState } from "react";
import './App.css';

import {promise} from './ninja/utils'

import NinjaKeyboard from './components/NinjaKeyboard'

//import * as nj from './ninja/ninja'
import {filters,Model,Ninja,Side,Layer,Keys,Key} from './ninja/ninja'


function App() {
    const [device,setDevice]=useState<HIDDevice|null>(null);
    const [ninja, setNinja] = useState<Ninja>({
        model: Model.none,
        sides:0,
        layers:0,
        rows:0,
        cols:0,
    });
    

    useEffect(()=>{
        //console.log( "useEffect ninja ",ninja)        
        console.log("device ",device)
        request_kb_info()
        
    },[device])

    const open=async ()=>{
        console.log("open")
        const [device] = await navigator.hid.requestDevice({ filters });//this MUST be called from button or user interaction
        
        //console.log("device ",device)
        if(!device.opened){
            await device.open();
            device.addEventListener("inputreport", report);
        }
        await setDevice(device)
    }
    const close=async ()=>{
        if(device){
            device.removeEventListener("inputreport", report);
            device.close()
            await setDevice(null)
        }
        const devices  = await navigator.hid.getDevices()
        for(const d in devices){
            await devices[d].forget()
        }
    }
    const read_conf=async ()=>{
        if(!device)
            return;
        if(!ninja.keys)
            return;
        for(let s=0;s<ninja.sides;s++){
            for(let l=0;l<ninja.layers;l++){            
                console.log(`request side: ${s} layer: ${l}`)
                // we need to wait for the eventlistener to finish geting the last report
                const data = [2,s,l];//2 == request keys ,side, layer
                await device.sendReport(0, new Uint8Array(data));
                await ninja.keys.sides[s].layers[l].promise
            }
        }
    }    
    const write_conf=()=>{
        
    }
    const reset_conf=()=>{
        
    }
    const load=()=>{
        
    }
    const save=()=>{
        
    }

    const request_kb_info = ()=>{        
        console.log("request_kb_info ",device)
        if(!device)
            return;
        const data = [0];//0 == request kb info
        device.sendReport(0, new Uint8Array(data));
    }

    //process al webhid reports responses
    const report= (event: HIDInputReportEvent) => {        
        const { data, device, reportId } = event;
        console.log("report ",event)
        let bytes=[]
        for(let i=0;i<data.byteLength;i++){
            bytes.push(data.getUint8(i))
        }
        const first_byte=bytes[0]
        switch(first_byte){
            case 0://kb info
            {
                console.log("report kb info ")
                const [_t,model,sides,layers,rows,cols]=bytes;
                let keys:Keys={sides:[]};
                for(let s=0;s<sides;s++){
                    let side:Side={layers:[]};
                    for(let l=0;l<layers;l++){
                        const layer:Layer={keys:[],promise:promise()}
                        side.layers.push(layer)
                    }
                    keys.sides.push(side)
                }
                setNinja({model,sides,layers,rows,cols,keys})
                console.log("model",model);
                console.log("sides",sides);
                console.log("layers",layers);
                console.log("rows",rows);
                console.log("col",cols);
            }
            break;
            case 1://keys
            {
                
                let side_i  = bytes[2]
                let layer_i = bytes[3]
                let k=4
                console.log("report keys side:",side_i, " layer: ",layer_i)
                let key:Key;
                if(ninja.keys){
                    for(let i=0;i<ninja.rows;i++){
                        for(let j=0;j<ninja.cols;j++){
                            const ktype=bytes[k]
                            const code=bytes[k+1]
                            ninja.keys.sides[side_i].layers[layer_i].keys.push({ktype,code})
                            k+=2
                        }
                        //rows.push(col)
                    }
                    console.log("keys ",ninja.keys);
                    //resolve promise
                    ninja.keys.sides[side_i].layers[layer_i].promise.resolve()
                }
            }
            break;
            case 2:
                console.log("raw ",bytes);
            break;
        }
    }
    
    return (
        <div className="flex column jc-space-evenly flex-wrap">
            <div className="flex jc-center">
                <button onClick={open}>Open</button>
                <button onClick={close}>Close</button>
                <button onClick={read_conf}>Read Keyboard</button>
                <button onClick={write_conf}>Write Keyboard</button>
                <button onClick={reset_conf}>Reset Conf</button>
                <button onClick={load}>Load from file</button>
                <button onClick={save}>Save to file</button>
            </div>
            <NinjaKeyboard model={ninja.model} />
        </div>
    );
}

export default App;
