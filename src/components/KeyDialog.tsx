import { useEffect, useState} from 'react';
import { getKeyCode,key_codes } from '../ninja/keys'
import { Key } from '../ninja/ninja'
export interface DialogPos{
  x:number;
  y:number;
  show:boolean;
  key:Key
}

export const KeyDialog = (props: {pos:DialogPos}) => {
  
  const {key,x,y,show}=props.pos
  const display=(show? "block":"none")
  const style={
    display,
    left:x+"px",
    top:y+"px"
  }
  //console.log("pos ",style)
  
  return (
    <div className="keyDialog" id="key_dialog" style={style}>
      <div className="flex column">
        <b className="flex key justifyCenter"></b>
        key:  {key.code}
        <select className="flex justifyCenter" value={key.code} >
          <option></option>
          {Object.entries(key_codes).map((x,i)=><option key={i} value={x[0]}>{x[1].symbol}</option>)}
        </select>
        
        <button >Set</button>
        <button >Cancel</button>
      </div>
    </div>
  )
}
export default KeyDialog;