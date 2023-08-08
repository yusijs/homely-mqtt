With the Homely SDK, you can retrieve information, status, and live events from your own sensors in
your self-developed software or self-managed platform. Homely-SDK uses standard REST-API and

WebSocket for data retrieval, so that it can be easily built into your preferred platform such as Node-
RED, Crosser, or ioBroker.

![Homely-SDK](./sdk-flow.png)

To start receiving live-events from your sensors, do the following:
1. Authenticate yourself on REST-API to get access token
2. Use REST-API to get current status from your sensors
3. Configure WebSocket to get live events from the same sensors
   After implementing Homely-SDK you can use your preferred third-party software or platform to
   automate personal events based on these sensor data.
   Available events:
   • Door opened/closed
   • Temperature changes
   • Current and total consumption (HAN-plug)
   • Alarm state changed