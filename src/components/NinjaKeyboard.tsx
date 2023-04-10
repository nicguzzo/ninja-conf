
import { ILayer,IKeyInfo,getSvgElementById } from '../ninja/ninja'
import { getKeyCode } from '../ninja/keys'
import { useEffect, createRef, RefObject, useState } from 'react';

const canvas = document.createElement("canvas");
const canvas_context = canvas.getContext("2d");

type KeyClickedCallback = (e:IKeyInfo) => any;

export const NinjaKeyboard = (props: { svg:string,rows:number,cols:number,side:number,keys:ILayer|null,onKeyClicked:KeyClickedCallback }) => {
  const { svg,rows,cols,side,keys } = props;

  const svg_ref:RefObject<HTMLObjectElement>  = createRef();

  const svgNS = "http://www.w3.org/2000/svg";
  const font = "Courier";
  const font_size = "18";
  /*const [keys,setKeys]=useState<ILayer|null>(props.keys)

  useEffect(()=>{
    console.log("props changed ",keys);
    setKeys(props.keys)
  },[props.keys])*/

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
          let t = getKeyCode(key.keyType,key.keyCode).symbol;
          
          if (t != null) {
            const l = displayTextWidth(t, font, font_size) / 2;
            let tid = `key_text_${side}_r${i}c${j}`;
            
            //let key_txt_e:SVGTextElement|null = null;
            //let _txt_e = doc.getElementById(tid);
            let key_txt_e = getSvgElementById(doc,tid)
            
            if (key_txt_e == null) {
              key_txt_e = document.createElementNS(svgNS, "text");
              key_txt_e.setAttribute("id", tid);
              key_txt_e.setAttribute("cursor", "pointer");
              key_txt_e.setAttributeNS(null, "text-align", "center");

              key_txt_e.addEventListener("click", (event) => {
                event.stopPropagation()
                const {x,y}=getCoords(svg,key_rect_e)
                keyClicked(side,i, j,x,y)
                //props.onKeyClicked({side, row:i, col:j,x,y,key:keys.keys[i][j]})
              });
              key_rect_e.setAttribute("cursor", "pointer");
              key_rect_e.addEventListener("click", (event) => {
                event.stopPropagation()
                const {x,y}=getCoords(svg,key_rect_e)                
                //props.onKeyClicked({side, row:i, col:j,x,y,key:keys.keys[i][j]})
                keyClicked(side,i, j,x,y)
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

  const  keyClicked=(side:number,row:number,col:number,x:number,y:number)=>{
    console.log("keyClicked ",keys)
    if(keys){
      props.onKeyClicked({side, row, col,x,y,key:keys.keys[row][col]})
    }else{
      console.log("no keys")
    }
  }
  
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
      return {x:0,y:0}
    }
    const svg_bb = svg.getBoundingClientRect();
    const key_bb = rect_e.getBoundingClientRect();
    const x = svg_bb.x + key_bb.x;
    const y = key_bb.y + key_bb.height + svg_bb.y;
    return {x,y}
  }

  if (svg!="") {
    
    return (
      <object data={svg} type="image/svg+xml" ref={svg_ref}/>
    )
  } else {
    return (<div></div>)
  }
}


export default NinjaKeyboard;
