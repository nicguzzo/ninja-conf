import { useEffect, useState} from 'react';

export interface DialogPos{
  x:number;
  y:number;
  show:boolean;
}

export const KeyDialog = (props: {pos:DialogPos}) => {
  const {pos}=props
  const display=(pos.show? "block":"none")
  const style={
    display,
    left:pos.x+"px",
    top:pos.y+"px"
  }
  console.log("pos ",style)
  return (
    <div className="keyDialog" id="key_dialog" style={style}>
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
  )
}
export default KeyDialog;