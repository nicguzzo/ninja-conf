import { useEffect, useState} from 'react';
import { key_codes,layer_key_codes,getKeyCode } from '../ninja/keys'
import { IKeyInfo } from '../ninja/ninja'

type onSetCallback = (e:IKeyInfo) => any;

export const KeyDialog = (props:{keyinfo:IKeyInfo,show:boolean ,onClose:Function,onSet:onSetCallback}) => {
  
  const {show,keyinfo}=props
  const {key,x,y}=keyinfo
  const display=(show? "block":"none")
  const style={
    display,
    left:x+"px",
    top:y+"px"
  }
  
  const [keyCode,setKeycode]=useState<number>((key.keyType===0?key.keyCode:0))
  const [layerParam,setLayerParam]=useState<number>(key.keyCode)
  const [keyType,setKeytype]=useState<number>(key.keyType)

  const onKeyCode=(e: any)=>{
    console.log("onKeyCode ",e.target.value)
    setKeytype(0)
    setKeycode(+e.target.value)
  }
  const onLayer=(e: any)=>{
    console.log("onLayer ",e.target.value)
    setKeytype(e.target.value)
    setKeycode(0)
  }
  const onKtype=(e:any)=>{
    console.log("onKtype ",e.target.value)
    setKeytype(e.target.value)
  }
  const onParam=(e:any)=>{
    console.log("onParam ",e.target.value)
    setLayerParam(e.target.value)
    setKeycode(e.target.value)
  }
  
  useEffect(()=>{    
    if(key.keyType==0){      
      setKeycode(key.keyCode)      
    }else{
      if(key.keyType==1){
        setKeycode(0)
      }
    }
  },[keyinfo.key.keyCode])

  useEffect(()=>{
    setKeytype(key.keyType)
  },[keyinfo.key.keyType])
  
  return (
    <div className="keyDialog" id="key_dialog" style={style}>
      <div className="flex column">
        <b className="flex key justifyCenter"></b>
                
        <div className="flex align-center">
          <b>Key</b>
          <input type="radio" name="keyType" value={0} checked={keyType === 0} onChange={onKtype}/>
          <select className="flex justifyCenter" value={(keyType === 0?keyCode:0)} onChange={onKeyCode} >                        
            {Object.entries(key_codes).map((x,i)=><option key={i} value={x[0]}>{x[1].symbol} {x[1].name}</option>)}
          </select>        
        </div>
        <div className="flex align-center">
          <b>Layer</b>
          <input type="radio" name="keyType" value={1} checked={keyType >= 1} onChange={onKtype}/>
          <select className="flex justifyCenter" value={(keyType>0?keyType:0)} onChange={onLayer} >
            {Object.entries(layer_key_codes).map((x,i)=><option key={i} value={x[0]}>{x[1].name}</option>)}
          </select>
          {keyType >= 1 && getKeyCode(keyType,keyType).params>=1 && 
            <input type="number" className='param' value={layerParam} onChange={onParam}/>
          }
        </div>
        <button onClick={()=>{
          const keyName=getKeyCode(keyType,keyCode).name
          props.onSet({...keyinfo,key:{keyType,keyCode,keyName}})
        }} >Set</button>
        <button onClick={()=>props.onClose()} >Cancel</button>
      </div>
    </div>
  )
}
export default KeyDialog;