# Homely-to-mqtt for home-assistant

This is a node-js application (docker-file included) that creates devices / entities in home-assistant. It uses the homely api to discover devices & listen for state changes over websockets, and then publishes the data to mqtt.

Devices are automatically discovered and created, and information on the devices is stored in a relational database (can use sqlite or any other db supported by sequelize).

### Configuration
Config is handled by [node-config](https://www.npmjs.com/package/config). It reads from the config-folder, and you can use whichever file-type you want (yaml, json, .properties etc). Read the node-config docs for more. An example is included (local.yml).

In addition some environment variables are required to be set:
- HOMELY_USER - email you use to log in to the homely app
- HOMELY_PASSWORD - the password you use to log in to the homely app
- MQTT_PASSWORD - the password for the mqtt user (optional)

### Caveats
- The homely API is read-only, so can only read state. Alarm etc cannot be armed.
- The supported devices are the ones delivered by the Homely API. Some devices are not sent over the api (at the time of writing, this includes at least Yale Doorman, alarm panel ++)
- The alarm itself is only listed as a sensor (text), as it is not possible to arm it.

### Supported devices

The application runs with discovery, and is confirmed to work for the following sensor-types:


| Sensor             	 | Tamper | Temperature | Battery low/ok | Battery defect | Battery voltage  | Link strength | Link address |
|----------------------|----|----|----|----|----|----|-----|
| Smoke                | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Motion               | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Heat                 | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Door/Window          | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Flood                | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |



Currently the devices listed below are verified to work. Others should work as well, but some sensor might be missing.

If you want to add a device, create a pull request adding information for the device to the sensors-folder

| Model name              	| Model id                             	|
|-------------------------	|--------------------------------------	|
| Intelligent Smoke Alarm 	| 15e64f49-fdbc-4cd6-9912-e2a6e838d44f 	|
| Alarm Motion Sensor 2   	| 17ddbcb4-8c00-4bc3-b06f-d20f51c0fe52 	|
| Intelligent Heat Alarm  	| ad923ba3-2b72-45e0-a9d7-91808a76f2ed 	|
| Motion Sensor Mini      	| 57038a68-3a39-43c8-be8d-11f58521eecc 	|
| Alarm Entry Sensor 2    	| 9b765375-e3f4-4627-b73c-b4143ce86c2c 	|
