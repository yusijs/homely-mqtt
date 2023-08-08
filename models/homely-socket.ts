export type HomelySocket = {
  type: "device-state-changed";
  data: {
    deviceId: string;
    gatewayId: string;
    locationId: string;
    modelId: string;
    rootLocationId: string;
    changes: [
      {
        feature: "temperature" | "alarm" | "battery" | "diagnostic";
        stateName: string;
        value: string | number | boolean;
        lastUpdated: "2023-08-01T12:37:30.145Z";
      },
    ];
  };
};
