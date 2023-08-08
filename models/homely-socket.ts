export type HomelySocket = {
  type: 'device-state-changed';
  data: {
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
};
