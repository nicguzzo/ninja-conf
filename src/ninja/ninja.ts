import { promise } from './utils'

export enum Model {
  none,
  ninja1,
  corne,
  ninja2
}

export interface Key {
  ktype: number,
  code: number
}

export interface Layer {
  keys: Key[],
  promise: any //outside resolvable promise
}

export interface Side {
  layers: Layer[]
}

export interface Keys {
  sides: Side[]
}

export interface Ninja {
  sides: number,
  layers: number,
  rows: number,
  cols: number,
  model: Model
  keys?: Keys
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