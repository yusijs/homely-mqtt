import { AlarmState } from './alarm-state';

export type DeviceStateData = {
  deviceId: string;
  gatewayId: string;
  locationId: string;
  modelId: string;
  rootLocationId: string;
  changes: [
    {
      feature: string;
      stateName: string;
      value: string | number | boolean;
      lastUpdated: string;
    },
  ];
};

export type AlarmStateData = {
  locationId: string;
  state: AlarmState;
  userId: string;
  userName: string;
  timestamp: string;
  eventId: number;
};

export type DeviceStateChange = {
  type: 'device-state-changed';
  data: DeviceStateData;
};

export type AlarmStateChange = {
  type: 'alarm-state-changed';
  data: AlarmStateData;
};

export type HomelySocket = DeviceStateChange | AlarmStateChange;
