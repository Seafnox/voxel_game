
export interface FactorConstructor<TFactor extends Factor> {
  new(): TFactor;
}

export interface Factor {}
