export const keys_letters_numbers={
    from:0x4, to:0xe7
}
export const getKeyCode=(c)=>{
  return key_codes[c];
}

const key_codes={
0x00:{symbol:"NoEventIndicated",name:"",},
0x01:{symbol:"ErrorRollOver",name:"",},
0x02:{symbol:"POSTFail",name:"",},
0x03:{symbol:"ErrorUndefine",name:"",},
0x04:{symbol:"A",name:"KeyA",},
0x05:{symbol:"B",name:"KeyB",},
0x06:{symbol:"C",name:"KeyC",},
0x07:{symbol:"D",name:"KeyD",},
0x08:{symbol:"E",name:"KeyE",},
0x09:{symbol:"F",name:"KeyF",},
0x0A:{symbol:"G",name:"KeyG",},
0x0B:{symbol:"H",name:"KeyH",},
0x0C:{symbol:"I",name:"KeyI",},
0x0D:{symbol:"J",name:"KeyJ",},
0x0E:{symbol:"K",name:"KeyK",},
0x0F:{symbol:"L",name:"KeyL",},
0x10:{symbol:"M",name:"KeyM",},
0x11:{symbol:"N",name:"KeyN",},
0x12:{symbol:"O",name:"KeyO",},
0x13:{symbol:"P",name:"KeyP",},
0x14:{symbol:"Q",name:"KeyQ",},
0x15:{symbol:"R",name:"KeyR",},
0x16:{symbol:"S",name:"KeyS",},
0x17:{symbol:"T",name:"KeyT",},
0x18:{symbol:"U",name:"KeyU",},
0x19:{symbol:"V",name:"KeyV",},
0x1A:{symbol:"W",name:"KeyW",},
0x1B:{symbol:"X",name:"KeyX",},
0x1C:{symbol:"Y",name:"KeyY",},
0x1D:{symbol:"Z",name:"KeyZ",},
0x1E:{symbol:"1",name:"Digit1",},
0x1F:{symbol:"2",name:"Digit2",},
0x20:{symbol:"3",name:"Digit3",},
0x21:{symbol:"4",name:"Digit4",},
0x22:{symbol:"5",name:"Digit5",},
0x23:{symbol:"6",name:"Digit6",},
0x24:{symbol:"7",name:"Digit7",},
0x25:{symbol:"8",name:"Digit8",},
0x26:{symbol:"9",name:"Digit9",},
0x27:{symbol:"0",name:"Digit0",},
0x28:{symbol:"⏎",name:"Enter",},
0x29:{symbol:"␛",name:"Escape",},
0x2A:{symbol:"␈",name:"Backscape",},
0x2B:{symbol:"⭾",name:"Tab",},
0x2C:{symbol:"⎵",name:"Space",},
0x2D:{symbol:"- _",name:"Minus",},
0x2E:{symbol:"= +",name:""},
0x2F:{symbol:"[ {",name:"BracketLeft"},
0x30:{symbol:"] }",name:"BracketRight"},
0x31:{symbol:"\\ |",name:"Slash"},
0x32:{symbol:"...",name:""},
0x33:{symbol:"; :",name:"Semicolon"},
0x34:{symbol:"' \"",name:"Quote"},
0x35:{symbol:"` ~",name:"Backquote"},
0x36:{symbol:", <",name:"Comma"},
0x37:{symbol:". >",name:"Period"},
0x38:{symbol:"/ ?",name:"Backslash"},
0x39:{symbol:"⇪",name:"Caps Lock"},
0x3A:{symbol:"F1",name:"F1",},
0x3B:{symbol:"F2",name:"F2",},
0x3C:{symbol:"F3",name:"F3",},
0x3D:{symbol:"F4",name:"F4",},
0x3E:{symbol:"F5",name:"F5",},
0x3F:{symbol:"F6",name:"F6",},
0x40:{symbol:"F7",name:"F7",},
0x41:{symbol:"F8",name:"F8",},
0x42:{symbol:"F9",name:"F9",},
0x43:{symbol:"F10",name:"F10",},
0x44:{symbol:"F11",name:"F11",},
0x45:{symbol:"F12",name:"F12",},
0x46:{symbol:"PrtScr",name:"",},
0x47:{symbol:"ScrLck",name:"",},
0x48:{symbol:"Pause",name:"",},
0x49:{symbol:"Ins",name:"Insert",},
0x4A:{symbol:"Home",name:"Home",},
0x4B:{symbol:"PgUp",name:"PageUp",},
0x4C:{symbol:"␡",name:"Delete",},
0x4D:{symbol:"End",name:"End",},
0x4E:{symbol:"PgDwn",name:"PageDown",},
0x4F:{symbol:"→",name:"ArrowRight",},
0x50:{symbol:"←",name:"ArrowLeft",},
0x51:{symbol:"↓",name:"ArrowDown",},
0x52:{symbol:"↑",name:"ArrowUp",},
0x53:{symbol:"KpNLC",name:"NumLock",},
0x54:{symbol:"KpDiv",name:"",},
0x55:{symbol:"KpMul",name:"",},
0x56:{symbol:"KpSub",name:"",},
0x57:{symbol:"KpAdd",name:"",},
0x58:{symbol:"KpEnter",name:"NumpadEnter",},
0x59:{symbol:"Kp1",name:"",},
0x5A:{symbol:"Kp2",name:"",},
0x5B:{symbol:"Kp3",name:"",},
0x5C:{symbol:"Kp4",name:"",},
0x5D:{symbol:"Kp5",name:"",},
0x5E:{symbol:"Kp6",name:"",},
0x5F:{symbol:"Kp7",name:"",},
0x60:{symbol:"Kp8",name:"",},
0x61:{symbol:"Kp9",name:"",},
0x62:{symbol:"Kp0",name:"",},
0x63:{symbol:"KpDot",name:"",},
0x64:{symbol:"NUSBs",name:"NonUSBackslash",},
0x65:{symbol:"App",name:"Application",},
0x66:{symbol:"Power",name:"",},
0x67:{symbol:"KpEq",name:"",},
0x68:{symbol:"F13",name:"",},
0x69:{symbol:"F14",name:"",},
0x6A:{symbol:"F15",name:"",},
0x6B:{symbol:"F16",name:"",},
0x6C:{symbol:"F17",name:"",},
0x6D:{symbol:"F18",name:"",},
0x6E:{symbol:"F19",name:"",},
0x6F:{symbol:"F20",name:"",},
0x70:{symbol:"F21",name:"",},
0x71:{symbol:"F22",name:"",},
0x72:{symbol:"F23",name:"",},
0x73:{symbol:"F24",name:"",},
0x74:{symbol:"Exec",name:"",},
0x75:{symbol:"Help",name:"",},
0x76:{symbol:"Menu",name:"",},
0x77:{symbol:"Select",name:"",},
0x78:{symbol:"Stop",name:"",},
0x79:{symbol:"Again",name:"",},
0x7A:{symbol:"Undo",name:"",},
0x7B:{symbol:"Cut",name:"",},
0x7C:{symbol:"Copy",name:"",},
0x7D:{symbol:"Paste",name:"",},
0x7E:{symbol:"Find",name:"",},
0x7F:{symbol:"Mute",name:"",},
0x80:{symbol:"VolUp",name:"",},
0x81:{symbol:"VolDown",name:"",},
0x82:{symbol:"LckCapsLck",name:"LockingCapsLock",},
0x83:{symbol:"LckNumLck",name:"LockingNumLock",},
0x84:{symbol:"LckScrLck",name:"LockingScrollLock",},
0x85:{symbol:"KpComma",name:"KeypadComma",},
0x86:{symbol:"KpEqSgn",name:"KeypadEqualSign",},
0x87:{symbol:"Kanji1",name:"",},
0x88:{symbol:"Kanji2",name:"",},
0x89:{symbol:"Kanji3",name:"",},
0x8A:{symbol:"Kanji4",name:"",},
0x8B:{symbol:"Kanji5",name:"",},
0x8C:{symbol:"Kanji6",name:"",},
0x8D:{symbol:"Kanji7",name:"",},
0x8E:{symbol:"Kanji8",name:"",},
0x8F:{symbol:"Kanji9",name:"",},
0x90:{symbol:"LANG1",name:"",},
0x91:{symbol:"LANG2",name:"",},
0x92:{symbol:"LANG3",name:"",},
0x93:{symbol:"LANG4",name:"",},
0x94:{symbol:"LANG5",name:"",},
0x95:{symbol:"LANG6",name:"",},
0x96:{symbol:"LANG7",name:"",},
0x97:{symbol:"LANG8",name:"",},
0x98:{symbol:"LANG9",name:"",},
0x99:{symbol:"AltErase",name:"AlternateErase",},
0x9A:{symbol:"SysReqAtt",name:"SysReqAttention",},
0x9B:{symbol:"Cancel",name:"",},
0x9C:{symbol:"Clear",name:"",},
0x9D:{symbol:"Prior",name:"",},
0x9E:{symbol:"Return",name:"",},
0x9F:{symbol:"Separator",name:"",},
0xA0:{symbol:"Out",name:"",},
0xA1:{symbol:"Oper",name:"",},
0xA2:{symbol:"ClrAgn",name:"ClearAgain",},
0xA3:{symbol:"CSProp",name:"CrSelProps",},
0xA4:{symbol:"ExSel",name:"",},
0xE0:{symbol:"Ctrl",name:"ControlLeft",},
0xE1:{symbol:"⇧",name:"ShiftLeft",},
0xE2:{symbol:"Alt",name:"AltLeft",},
0xE3:{symbol:"LGUI",name:"MetaLeft",},
0xE4:{symbol:"Ctrl",name:"ControlRight",},
0xE5:{symbol:"⇧",name:"ShiftRight",},
0xE6:{symbol:"AltGr",name:"AltRight",},
0xE7:{symbol:"RGUI",name:"MetaRight",},
0x100:{symbol:"Layer",name:""},
}