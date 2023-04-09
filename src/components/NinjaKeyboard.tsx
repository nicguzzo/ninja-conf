
import { Model, Ninja,Layer } from '../ninja/ninja'
import { getKeyCode } from '../ninja/keys'
import { useEffect, useState,createRef,RefObject } from 'react';

const canvas = document.createElement("canvas");
const canvas_context = canvas.getContext("2d");

const NinjaKeyboard = (props: { svg:string,rows:number,cols:number,keys:Layer|null,onKeyClicked:Function }) => {
  const { svg,rows,cols,keys } = props;

  const svg_ref:RefObject<HTMLObjectElement>  = createRef();


  //const [keys,setKeys]=useState(props.ninja.keys)

  const svgNS = "http://www.w3.org/2000/svg";
  const font = "Courier";
  const font_size = "18";
  //const layer=0

  //console.log("NinjaKeyboard ninja ",props.ninja)

  useEffect(()=>{
    console.log("keys changed ",keys);
    if(!svg_ref.current){
      console.log("bad svg");
      return;
    }
    const svg=svg_ref.current
    const doc = svg.contentDocument;

    if(!doc){
      console.log("bad doc");
      return;
    }
    if(!keys){
      console.log("bad keys");
      return;
    }
    const side = svg.id.includes("left_side") ? 0 : 1;
    let g = doc.getElementById("svg9");
    if(!g){
      console.log("bad g svg9");
      return;
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let key_rect_e = doc.getElementById(`r${i}c${j}`);
        if (key_rect_e != null) {
          let key = keys.keys[i][j]
          //let key = keys.sides[side].layers[layer].keys[i][j];
          let t = "";
          if (key.ktype == 0) {
            t = getKeyCode(key.code).symbol;
          } else if (key.ktype == 1) {
            t = "Layer";
          }
          if (t != null) {
            const l = displayTextWidth(t, font, font_size) / 2;
            let tid = `key_text_${side}_r${i}c${j}`;
            //let _txt_e = doc.getElementById(tid);
            //let key_txt_e:SVGTextElement = _txt_e;
            let key_txt_e:SVGTextElement|null = null;
            if (key_txt_e == null) {
              key_txt_e = document.createElementNS(svgNS, "text");
              key_txt_e.setAttribute("id", tid);
              key_txt_e.setAttribute("cursor", "pointer");
              key_txt_e.setAttributeNS(null, "text-align", "center");

              key_txt_e.addEventListener("click", (event) => {
                const coords=getCoords(svg,key_rect_e)
                props.onKeyClicked({side, i, j,coords})
                //this.set_key_info(svg, side, i, j);
              });
              //key_rect_e = key_rect_e;
              key_rect_e.setAttribute("cursor", "pointer");
              key_rect_e.addEventListener("click", (event) => {
                const coords=getCoords(svg,key_rect_e,)
                props.onKeyClicked({side, i, j,coords})
                //this.set_key_info(svg, side, i, j, event);
              });
              g.appendChild(key_txt_e);
            }
            const bb = key_rect_e.getBoundingClientRect();
            key_txt_e.setAttributeNS(
              null,
              "x",
              (bb.x + (bb.right - bb.x) / 2 - l).toString()
            );
            key_txt_e.setAttributeNS(
              null,
              "y",
              (bb.y + (bb.bottom - bb.y) / 2 + 10).toString()
            );
            key_txt_e.setAttributeNS(null, "font-family", font);
            key_txt_e.setAttributeNS(null, "font-size", font_size);
            key_txt_e.innerHTML = t
              .replace(/</, "&lt;")
              .replace(/>/, "&gt;");
          }
        }
      }
    }
  },[keys])
  
  const displayTextWidth=(text:string, font:string, size:string)=>{
    if (canvas_context != null) {
      canvas_context.font = size + "px " + font;
      const metrics = canvas_context.measureText(text);
      return metrics.width;
    } else {
      return 0;
    }
  }

  const getCoords=(svg:HTMLObjectElement,rect_e:HTMLElement|null)=>{
    if(!rect_e){
      return {l:0,t:0}
    }
    const svg_bb = svg.getBoundingClientRect();
    const key_bb = rect_e.getBoundingClientRect();
    //const dialog_bb = this.dialog.getBoundingClientRect();
    //const w = dialog_bb.width - key_bb.width;
    const w = 100
    const l = svg_bb.x + key_bb.x - w / 2 + "px";
    const t = key_bb.y + key_bb.height + svg_bb.y + "px";
    return {l,t}
  }

  if (svg!="") {
    
    return (
      <div>
        <div className="flex jc-space-evenly flex-wrap" id="kb">
          <object data={svg} type="image/svg+xml" ref={svg_ref}/>          
        </div>
      </div>
    )
  } else {
    return (<div></div>)
  }
}


export default NinjaKeyboard;