import { useEffect,useState } from 'react';

import './App.css';

import { promise } from './ninja/utils'
//import NinjaKeyboard from './components/NinjaKeyboard'

import { filters, Model, Ninja, Side, Layer, Keys, Key } from './ninja/ninja'
import NinjaKeyboard from './components/NinjaKeyboard';

const canvas = document.createElement("canvas");
const canvas_context = canvas.getContext("2d");

interface KeyDialog {
  show: boolean
  x: number
  y: number
}

function App() {
  const [device, setDevice] = useState<HIDDevice | null>(null);
  const [ninja, setNinja] = useState<Ninja>({
    model: Model.none,
    sides: 0,
    layers: 0,
    rows: 0,
    cols: 0,
  });
  const [layer, setLayer] = useState<number>(0);
  const [keysL, setKeysL] = useState<Layer|null>(null);
  const [keysR, setKeysR] = useState<Layer|null>(null);
  const [report, setReport] = useState<number[]>([]);
  const [keyDialog, setKeyDialog] = useState<KeyDialog>({
    show: false, x: 0, y: 0
  });

  useEffect(() => {
    request_kb_info()
  }, [device])

  useEffect(() => {

    /*const svg_bb = svg.getBoundingClientRect();
            const doc = svg.contentDocument;
            let key_e = doc.getElementById(`r${i}c${j}`);
            const key_bb = key_e.getBoundingClientRect();
            const dialog_bb = this.dialog.getBoundingClientRect();
            const w = dialog_bb.width - key_bb.width;
            this.dialog.style.left = svg_bb.x + key_bb.x - w / 2 + "px";
            this.dialog.style.top = key_bb.y + key_bb.height + svg_bb.y + "px";
            this.dialog.focus();*/
  }, [keyDialog])

  //process reports
  useEffect(() => {
    const first_byte = report[0]
    switch (first_byte) {
      case 0://kb info
        {
          console.log("report kb info ")
          const [_t, model, sides, layers, rows, cols] = report;
          let keys: Keys = { sides: [] };
          for (let s = 0; s < sides; s++) {
            let side: Side = { layers: [] };
            for (let l = 0; l < layers; l++) {
              const layer: Layer = { keys: [], promise: null }
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
          let key: Key;
          if (ninja.keys) {
            ninja.keys.sides[side_i].layers[layer_i].keys=[]
            for (let i = 0; i < ninja.rows; i++) {
              let col=[]
              for (let j = 0; j < ninja.cols; j++) {
                const ktype = report[k]
                const code = report[k + 1]
                col.push({ ktype, code })
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
  const write_conf = () => {

  }
  const reset_conf = () => {

  }
  const load = () => {

  }
  const save = () => {

  }

  const request_kb_info = () => {
    console.log("request_kb_info ", device)
    if (!device)
      return;
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
      {ninja.keys && ninja.model != Model.none &&

        <div>
          <div className="flex jc-space-evenly flex-wrap" id="kb">
            <NinjaKeyboard  svg={Model[ninja.model]+"_left.svg"}
               rows={ninja.rows} cols={ninja.cols} keys={keysL}
               onKeyClicked={(a: any)=>{
                console.log("clicked left ",a)
                const l=a.l;
                const t=a.t;
                setKeyDialog({show:true,x:l,y:t})
               }}
            />
            <NinjaKeyboard  svg={Model[ninja.model]+"_right.svg"}
               rows={ninja.rows} cols={ninja.cols} keys={keysR}
               onKeyClicked={(a: any)=>{
                console.log("clicked right ",a)
                const l=a.l;
                const t=a.t;
                setKeyDialog({show:true,x:l,y:t})
               }}
            />

          </div>
          {keyDialog &&
            <div className="keyDialog" id="key_dialog">
              <div className="flex column">
                <b className="flex key justifyCenter"></b>
                <select className="flex justifyCenter">
                  <option></option>
                </select>
                <b className="flex key justifyCenter"></b>
                <select className="flex justifyCenter">
                </select>
                <button >Set</button>
                <button >Cancel</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  );
}

export default App;
