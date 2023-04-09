
import {Model,Ninja} from '../ninja/ninja'

const  NinjaKeyboard = (props:{model: Model})=>{
    const {model}=props;
    console.log("model ",model)
    
    if ( model!=Model.none ){
        const model_s=Model[model];    
        const svg_left="/"+model_s+"_left.svg";
        const svg_right="/"+model_s+"_right.svg";
        return (
            <div>
                <div className="flex jc-space-evenly flex-wrap" id="kb">
                    <object data={svg_left} id="left_side" type="image/svg+xml" />
                    <object data={svg_right} id="right_side" type="image/svg+xml" />
                </div>
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
            </div>
        )
    }else{
        return (<div></div>)
    }
}


export default NinjaKeyboard;