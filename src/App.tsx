import { useEffect,useState } from 'react';

import './App.css';

import { promise } from './ninja/utils'

import { filters, Model, INinja, ISide, ILayer, IKeys, IKey,IKeyInfo } from './ninja/ninja'
import {NinjaKeyboard} from './components/NinjaKeyboard';
import {KeyDialog} from './components/KeyDialog';
import { getKeyCode } from './ninja/keys';

function App() {
  const [device, setDevice] = useState<HIDDevice | null>(null);
  const [ninja, setNinja] = useState<INinja>({
    model: Model.none,
    sides: 0,
    layers: 0,
    rows: 0,
    cols: 0,
  });
  const [layer, setLayer] = useState<number>(0);
  const [keysL, setKeysL] = useState<ILayer|null>(null);
  const [keysR, setKeysR] = useState<ILayer|null>(null);
  const [report, setReport] = useState<number[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [keyDialog, setKeyDialog] = useState<IKeyInfo>({
    side:0,
    row:0,
    col:0,
    x:0,
    y:0,
    key:{keyType:0,keyCode:0,keyName:""}
  });

  useEffect(() => {
    request_kb_info()
  }, [device])

  useEffect(() => {
  }, [keyDialog])

  //process reports
  useEffect(() => {
    const first_byte = report[0]
    switch (first_byte) {
      case 0://kb info
        {
          console.log("report kb info ")
          const [_t, model, sides, layers, rows, cols] = report;
          let keys: IKeys = { sides: [] };
          for (let s = 0; s < sides; s++) {
            let side: ISide = { layers: [] };
            for (let l = 0; l < layers; l++) {
              const layer: ILayer = { keys: [], promise: null }
              side.layers.push(layer)
            }
            keys.sides.push(side)
          }
          setNinja({ model, sides, layers, rows, cols, keys })
          console.log("model", model);
          console.log("sides", sides);
          console.log("layers", layers);
          console.log("rows", rows);
          console.log("col", cols);
        }
        break;
      case 1://keys
        {
          let side_i = report[2]
          let layer_i = report[3]
          let k = 4
          console.log("report keys side:", side_i, " layer: ", layer_i)
          let key: IKey;
          if (ninja.keys) {
            ninja.keys.sides[side_i].layers[layer_i].keys=[]
            for (let i = 0; i < ninja.rows; i++) {
              let col:IKey[]=[]
              for (let j = 0; j < ninja.cols; j++) {
                const keyType = report[k]
                const keyCode = report[k + 1]
                let kc=getKeyCode(keyType,keyCode)
                const keyName = kc.symbol+kc.name
                col.push({ keyType, keyCode,keyName })
                k += 2
              }
              ninja.keys.sides[side_i].layers[layer_i].keys.push(col)
            }
            //console.log("keys ", ninja.keys);
            ninja.keys.sides[side_i].layers[layer_i].promise.resolve()
            if(side_i==0 && layer==layer_i){
              setKeysL(ninja.keys.sides[side_i].layers[layer_i])
            }
            if(side_i==1 && layer==layer_i){
              setKeysR(ninja.keys.sides[side_i].layers[layer_i])
            }
            setNinja({...ninja})
          } else {
            console.log("no ninja info")
          }
        }
        break;
      case 2:
        console.log("raw ", report);
        break;
    }

  }, [report])

  const open = async () => {
    console.log("open")
    //this MUST be called from button or user interaction
    const [device] = await navigator.hid.requestDevice({ filters });

    //console.log("device ",device)
    if (!device.opened) {
      await device.open();
      device.addEventListener("inputreport", reportListener);
    }
    setDevice(device)
  }
  const close = async () => {
    if (device) {
      device.removeEventListener("inputreport", reportListener);
      device.close()
      setDevice(null)
    }
    const devices = await navigator.hid.getDevices()
    for (const d in devices) {
      await devices[d].forget()
    }
  }
  const read_conf = async () => {
    if (!device)
      return;
    if (!ninja.keys)
      return;
    for (let s = 0; s < ninja.sides; s++) {
      for (let l = 0; l < ninja.layers; l++) {
        //console.log(`request side: ${s} layer: ${l}`)
        const data = [2, s, l];//2 == request keys ,side, layer
        device.sendReport(0, new Uint8Array(data));

        // we need to wait for the eventlistener to finish geting the last report
        ninja.keys.sides[s].layers[l].promise = promise();
        await ninja.keys.sides[s].layers[l].promise
      }
    }
  }
  const dump_keys=(side:number,layer:number)=>{
    if (!ninja.keys)
      return null;
    let data = [1,0,side,layer];
    for(let i=0;i<ninja.rows;i++){                    
        for(let j=0;j<ninja.cols;j++){                        
            data.push(ninja.keys.sides[side].layers[layer].keys[i][j].keyType)
            data.push(ninja.keys.sides[side].layers[layer].keys[i][j].keyCode)                        
        }
    }
    return data
  }
  const write_conf =async () => {
    if (!device)
      return;
    if (!ninja.keys)
      return;
    for(let s=0;s<ninja.sides;s++){                        
      for(let l=0;l<ninja.layers;l++){
          let data=dump_keys(s,l)
          if(data!=null){
            console.log("writing side: ",s," layer",l)
            device.sendReport(0, new Uint8Array(data));
            await setTimeout(()=>{},1000)
          }
      }
    }
    
  }
  const save_eeprom = () => {
    if (!device)
      return;
    //save eeprom    
    device.sendReport(0, new Uint8Array([4]));
  }
  const reset_eeprom = () => {
    if (!device)
      return;
    device.sendReport(0, new Uint8Array([3]));
  }
  const load = () => {

  }
  const save = () => {
    let fileContent = JSON.stringify(ninja, null, 2);
    let bb = new Blob([fileContent], { type: "text/plain" });
    let a = document.createElement("a");
    const model=Model[ninja.model]
    a.download = "ninja_"+model+".json";
    a.href = window.URL.createObjectURL(bb);
    a.click();
  }

  const request_kb_info = () => {
    //console.log("request_kb_info ", device)
    if (!device){
      console.log("request_kb_info no device ")
      return;
    }
    const data = [0];//0 == request kb info
    device.sendReport(0, new Uint8Array(data));
  }

  //process al webhid reports responses
  const reportListener = (event: HIDInputReportEvent) => {
    const { data, device, reportId } = event;
    let bytes: number[] = []
    for (let i = 0; i < data.byteLength; i++) {
      bytes.push(data.getUint8(i))
    }
    setReport(bytes)
  }

  const setKey=(ki:IKeyInfo)=>{
    console.log("setKey")
    if(ninja.keys){
      const {side,row,col,key}=ki      
      let keys={...ninja.keys}
      keys.sides[side].layers[layer].keys[row][col]=key;
      console.log(keys.sides[side].layers[layer].keys[row][col])
      setNinja({...ninja,keys})
      console.log("side ",side)
      refresh_keys(keys.sides[side],side)
    }
  }

  useEffect(()=>{    
    console.log("refreshing keys ")
    if(ninja.keys){
      refresh_keys(ninja.keys.sides[0],0)
      refresh_keys(ninja.keys.sides[1],1)
    }else{
      console.log("no keys")
    }
  },[layer])
  
  /*useEffect(()=>{    
    if(ninja.keys){
      console.log("Keys ",ninja.keys.sides[0].layers[0].keys)
    }
  },[ninja])*/

  const refresh_keys=(side:ISide,side_i:number)=>{
    let l=side.layers[layer]
    if(side_i==0){
      console.log("setKeysL")
      setKeysL({...l})
    }else{
      console.log("setKeysR")
      setKeysR({...l})
    }
  }

  const onLayer = (e: React.FormEvent<HTMLSelectElement>) => {
    setLayer(+e.currentTarget.value)
  }
  

  return (
    <div className="flex column jc-space-evenly flex-wrap">
      <div className="flex jc-center">
        <button onClick={open}>Open</button>
        <button onClick={close}>Close</button>
        <button onClick={read_conf}>Read Keyboard</button>
        <button onClick={write_conf}>Write Keyboard</button>
        <button onClick={save_eeprom}>Save Eeprom</button>
        <button onClick={reset_eeprom}>Reset Eeprom</button>
        <button onClick={load}>Load from file</button>
        <button onClick={save}>Save to file</button>
      </div>
      {ninja.keys && ninja.model != Model.none &&

        <div>
          <div className="flex jc-center align-center"> Layer 
            <select value={layer} onChange={onLayer}>
              {Array(ninja.layers).fill(0).map((_,i)=><option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="flex jc-space-evenly flex-wrap" id="kb">
            <NinjaKeyboard  svg={Model[ninja.model]+"_left.svg"}  
               rows={ninja.rows} cols={ninja.cols} side={0} keys={keysL} 
               onKeyClicked={(keyinfo: IKeyInfo)=>{                
                setShowDialog(true)
                setKeyDialog(keyinfo)
               }}
            />
            <NinjaKeyboard  svg={Model[ninja.model]+"_right.svg"} 
               rows={ninja.rows} cols={ninja.cols} side={1} keys={keysR} 
               onKeyClicked={(keyinfo: IKeyInfo)=>{                
                setShowDialog(true)
                setKeyDialog(keyinfo)
              }}
            />
          </div>
          <KeyDialog keyinfo={keyDialog} show={showDialog}
            onSet={setKey}
            onClose={()=>setShowDialog(false)}
          />
        </div>
      }
    </div>
  );
}

export default App;
