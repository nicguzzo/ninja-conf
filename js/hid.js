const filters= [
    {
        vendorId: 0xcaca, // nicguzzo
        productId: 0x0001, // ninja v1
        usagePage: 0x1,
        usage:0x05
    },
    {
        vendorId: 0xcaca, // nicguzzo
        productId: 0x0002, // ninja corne
        usagePage: 0x1,
        usage:0x05
    },
    {
        vendorId: 0xcaca, // nicguzzo
        productId: 0x0003, // ninja v2
        usagePage: 0x1,
        usage:0x05
    },
]

const Hid={
    ninja_kb_device:null,
    
    //asks the browser to request the devices picking dialog
    async get_devices(){
        if(device==null){
            const [dev] = await navigator.hid.requestDevice({ filters });//this MUST be called from button or user interaction
            device=dev
        }
        return await this.open_hid_device(device)
    },
    async open(){    
        const devices  = await navigator.hid.getDevices()
        console.log(devices)
        device=null
        if(devices==null)
            return false
        if (devices.length>0)
            return false

        for(i in devices){
            if(devices[i].productName.includes("Ninja")){
                device=devices[i]
                break;
            }
        }
        return await this.open_hid_device(device)
    
    },
    async close(){
        const devices  = await navigator.hid.getDevices()
        for(const d in devices){
            await devices[d].forget()
        }
        this.ninja_kb_device=null
    },
    async open_hid_device(device){        
        console.log("open_hid_device device ",device)
        this.ninja_kb_device=null
        if(device==null)
            return false
        console.log(device.productName)
        if(device.productName.includes("Ninja")){
            this.ninja_kb_device=device
            await this.ninja_kb_device.open()
            await this.add_report_listener()
            
            console.log("opened")
            return true
        }
        console.log("can not open")
        return false
    },

    async add_report_listener(){
        await this.ninja_kb_device.addEventListener("inputreport", event => {
            const { data, device, reportId } = event;
            Keyboard.process_input(data)
        });
    },
}