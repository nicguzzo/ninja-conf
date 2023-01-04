
const Keyboard={
    nSIDES:0,
    nLAYERS:0,
    nROWS:0,
    nCOLS:0,
    keys:[],
    layers:[],
    last:false,
    kb_info_p:null,
    kb_keys_p:null,
    process_input(data){
        let bytes=[]
        for(let i=0;i<data.byteLength;i++){
            bytes.push(data.getUint8(i))
        }
        
        if(bytes[0]==0){//kb info
            this.process_kb_info(bytes)
            this.kb_info_p.resolve();
        }else if(bytes[0]==1){//keys
            this.process_keys(bytes);
            this.kb_keys_p.resolve();
            
            /*if(side_i===this.nSIDES-1 && layer_i===this.nLAYERS-1){
                this.set_keys_text(this.left_side)
                this.set_keys_text(this.right_side)
                console.log("keys ",this.keys);
            }else{
                layer_i++;
                if(layer_i>=this.nLAYERS){
                    side_i++;
                    layer_i=0;
                }
                if(side_i<this.nSIDES&& layer_i<this.nLAYERS){
                    console.log(`request ${side_i} ${layer_i}`)
                    const data = [2,side_i,layer_i];//2 == get keys ,side, layer
                    this.hid.ninja_kb.sendReport(0, new Uint8Array(data));
                }
            }*/
            
        }else if(bytes[0]==2){
            console.log("raw ",bytes);
        }
    },
    
    async request_kb_info(device){
        if(device==null)
            return null
        const data = [0];//0 == request kb info
        this.last=false
        this.kb_info_p=promise();
        await device.sendReport(0, new Uint8Array(data));
        return this.kb_info_p
    },
    async request_keys(device,side, layer){
        console.log(`request ${side} ${layer}`)
        const data = [2,side,layer];//2 == request keys ,side, layer
        this.kb_keys_p=promise();
        device.sendReport(0, new Uint8Array(data));
        return this.kb_keys_p
    },

    async read_keys(device){
        for(let l=0;l<this.nLAYERS;l++){            
            for(let s=0;s<this.nSIDES;s++){
                await this.request_keys(device,s, l);
            }
        }
    },
    async write_keys(device){
        for(let s=0;s<this.nSIDES;s++){                        
            for(let l=0;l<this.nLAYERS;l++){
                let data=this.dump_keys(s,l)
                await device.sendReport(0, new Uint8Array(data));
                await setTimeout(()=>{},200)
            }
        }
    },
    dump_keys(side,layer){
        let data = [1,0,side,layer];
        for(let i=0;i<this.nROWS;i++){                    
            for(let j=0;j<this.nCOLS;j++){                        
                data.push(this.keys[side][layer][i][j].ktype)
                data.push(this.keys[side][layer][i][j].code)                        
            }
        }
        return data
    },
    async reset_keys(device){
        const data = [3];//3 == reset
        await device.sendReport(0, new Uint8Array(data));
    },
    process_kb_info(bytes){
        console.log("kbinfo ",bytes);
        this.nSIDES  = bytes[1]
        this.nLAYERS = bytes[2]
        this.nROWS   = bytes[3]
        this.nCOLS   = bytes[4]
        
        for(let i=0;i<this.nLAYERS;i++){
            this.layers.push({id:i,name:`Layer ${i}`})
        }
        this.keys=[]
        for(let s=0;s<this.nSIDES;s++){
            this.keys.push([])
            for(let i=0;i<this.nLAYERS;i++){
                this.keys[s].push([])
            }
        }
        console.log("sides ",this.nSIDES)
        console.log("layers ",this.nLAYERS)
        console.log("rows ",this.nROWS)
        console.log("cols ",this.nCOLS)
    },
    process_keys(bytes){
        console.log("keys ",bytes);
        let side_i  = bytes[2]
        let layer_i = bytes[3]
        let k=4
        let rows=[]
        for(let i=0;i<this.nROWS;i++){
            let col=[]
            for(let j=0;j<this.nCOLS;j++){
                const ktype=bytes[k]
                const code=bytes[k+1]
                col.push({ktype,code})
                k+=2
            }
            rows.push(col)
        }
        this.keys[side_i][layer_i]=rows
    }
}