/**
 * This file contains the types for the Homely API.
 */

import { AlarmState } from './alarm-state';

/**
 * The Homely API returns a list of locations, each location has a locationId which is used to get the details of the location.
 */
export type HomelyLocation = {
  name: string;
  role: string;
  userId: string;
  locationId: string;
};

/**
 * The root Home object contains the details of the location, including the devices and their states.
 */
export type Home = {
  locationId: string;
  gatewayserial: string;
  name: string;
  alarmState: AlarmState;
  userRoleAtLocation: string;
  devices: Device[];
};

/**
 * Each device has a list of features, each feature has a list of states.
 */
export type Device = {
  features: Features;
  id: string;
  location: string;
  modelId: string;
  modelName: string;
  name: string;
  online: boolean;
  serialNumber: string;
  homeId: string;
};

/**
 * Non-exhaustive list of features. These are all the ones I know about for now, but others may be relevant in the future (e.g. locks)
 */
export type Features = {
  alarm: Alarm;
  temperature: Temperature;
  battery: Battery;
  diagnostic: Diagnostic;
};

export type Alarm = {
  states: States;
};

export type FireAlarmStates = {
  fire: State<boolean>;
};

export type TemperatureStates = {
  temperature: {
    value: number;
    lastUpdated: string;
  };
};

export type States = {
  alarm?: State<boolean>;
  tamper?: State<boolean>;
  sensitivitylevel?: State<number>;
} & Partial<FireAlarmStates> &
  Partial<TemperatureStates>;

export type State<T = boolean | string | number> = {
  value: T;
  lastUpdated: string;
};

export type Temperature = {
  states: {
    temperature: State<number>;
  };
};

export type Battery = {
  states: BatteryState;
};

export type BatteryState = {
  low: State<boolean>;
  voltage: State<number>;
  defect?: State<boolean>;
};

export type Diagnostic = {
  states: DiagnosticStates;
};

export type DiagnosticStates = {
  networklinkstrength: State<number>;
  networklinkaddress: State<string>;
};
