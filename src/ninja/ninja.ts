export enum Model {
  none,
  ninja1,
  corne,
  ninja2
}

export interface IKeyInfo{
  side: number;
  x:number;
  y:number;
  row: number;
  col: number;
  key:IKey
}

export interface IKey {
  keyType: number;
  keyCode: number;
  keyName: string;
}

export interface ILayer {
  keys: IKey[][],
  promise: any //outside resolvable promise
}

export interface ISide {
  layers: ILayer[]
}

export interface IKeys {
  sides: ISide[]
}

export interface INinja {
  sides: number;
  layers: number;
  rows: number;
  cols: number;
  model: Model;
  keys?: IKeys;
}

export const filters = [
  {
    vendorId: 0xcaca, // nicguzzo
    productId: 0x0001, // ninja v1
    usagePage: 0x1,
    usage: 0x05
  },
  {
    vendorId: 0xcaca, // nicguzzo
    productId: 0x0002, // ninja corne
    usagePage: 0x1,
    usage: 0x05
  },
  {
    vendorId: 0xcaca, // nicguzzo
    productId: 0x0003, // ninja v2
    usagePage: 0x1,
    usage: 0x05
  },
]

export function getSvgElementById(doc:Document,tid:string){
  return <SVGTextElement|null> doc.getElementById(tid);
}