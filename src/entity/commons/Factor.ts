
export interface FactorConstructor<TValue, TFactor extends Factor<TValue>> {
  new(): TFactor;
}

export interface Factor<TValue> {
  get value(): TValue;
  set value(value: TValue);
}
