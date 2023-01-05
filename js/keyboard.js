
const Keyboard={
    MODEL:0,
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
        const first_byte=bytes[0]
        switch(first_byte){
            case 0://kb info
                this.process_kb_info(bytes)
                this.kb_info_p.resolve();
            break;
            case 1://keys
                this.process_keys(bytes);
                this.kb_keys_p.resolve();
            break;
            case 2:
                console.log("raw ",bytes);
            break;
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
        this.MODEL   = bytes[1]
        this.nSIDES  = bytes[2]
        this.nLAYERS = bytes[3]
        this.nROWS   = bytes[4]
        this.nCOLS   = bytes[5]
        
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
        console.log("model ",this.MODEL)
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