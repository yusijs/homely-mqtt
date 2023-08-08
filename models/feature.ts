export type Feat<T extends string> = {
  [key in T]: {
    value: boolean | number | string;
    lastUpdated: string;
  };
};

export type Feature<K extends string, T extends string> = {
  [key in K]: {
    states: Feat<T>;
  };
};
