# API Docs from Homely


**These were sent to me by Homely on the 17th of Feb 2023 and may be out of date**

1. [SDK](#sdk)
2. [API](#api)
   1. [Access token API](#access-token---api)
   2. [Refresh token API](#refresh-token---api)
   3. [Location API](#location---api)
   4. [Home API](#home---api)
3. [Websocket](#websocket)


## SDK

The SDK is designed so that Homely users can develop their own smart-home app solutions. All you need is to connect your solution to the
REST-API, authenticate, and start receiving live events from your sensors through a WebSocket connection.

With the use of standard REST-API and WebSockets, this SDK can be implemented with all third-party app builders or modern developer tools. E.
g. Node Red, Homey, Java, Javascript, .Net, etc.

#### General

The SDK-API’s makes it possible for users to subscribe to live-data from a set of their private sensors. Sensor data available through the API is:
* HAN-plug (current and total consumption)
* Alarm state
* Temperature
* Door/window status (open/closed)

The API provides real-time data through APIs' and web socket, and provide these as JSON objects to the Smart Home Central. The list below
shows an overall description of the process from connecting the Smart Home Central, to real-time data is received through the API’s on the
Safe4 Onesti IOT platform:
* Get Access Token: The Smart Home Central call API for authentication Access Token - API
  * The user is authenticated by using the same username and password as they use in the Homely app, and receives a time
limited Access Token
* Get available Locations: After authentication, the user can query a list of all locations where the user is either registered as an ADMIN
or OWNER Location - API
* Get sensor states from Location: Based on the list of available locations for the user, the user can get the current state for one or
more devices for a location Home - API
* Get live updates from sensors: The user can then choose to subscribe to real-time data from one or more locations WebSocket
  * The web socket then provides the Smart Home Central with real-time data.
* Get refresh-token: When the time limit for the Access Token is reached, an updated token can be retrieved using the refresh token Refr
esh Token - API

![Homely SDK example](./sdk-example.png)


## API

All non-oauth APIs require an access token to be sent in the Authorization header. The access token is retrieved by calling the oauth/token

Example header: ``Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lk...``

**API URL's**

* https://sdk.iotiliti.cloud/homely/oauth/token
* https://sdk.iotiliti.cloud/homely/locations
* https://sdk.iotiliti.cloud/homely/home/{locationId}

All data from these API’s is by default in English, except for manually set names for the location and sensors.

#### Access Token - API

**POST /homely/oauth/token**

##### POST request body

| Field name          | Type   | Description                                      |
|---------------------|--------|--------------------------------------------------|
| username (required) | String | The same email address as used in the Homely app |
| password (required) | String | The same password as used in the Homely app      |

##### Example request

```json
{
  "username": "api@homely.com",
  "password": "MyValidPassword"
}
```

##### Example response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lk...",
  "expires_in": 60,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2l...",
  "token_type": "bearer",
  "not-before-policy": 1618215605,
  "session_state": "ebc511e7-0a53-40c4-a6a6-95efd5c82f53",
  "scope": ""
}
```

#### Refresh token - API

**POST /homely/oauth/refresh-token**



##### POST request body

| Field name               | Type   | Description                                                |
|--------------------------|--------|------------------------------------------------------------|
| refresh_token (required) | String | The refresh token received when retrieving an access token |

##### Example request

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2l..."
}
```

##### Example response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lk...",
  "expires_in": 60,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2l...",
  "token_type": "bearer",
  "not-before-policy": 1618215605,
  "session_state": "ebc511e7-0a53-40c4-a6a6-95efd5c82f53",
  "scope": ""
}
```

#### Location - API

**GET /homely/locations**

This API is used for retrieving all Locations (gateways) that the user has access to, as an Owner or Admin.

This API is using Bearer Token as Authentication method. When using this API, the verification is done by using the received Token from Access
Token - API

**Example response**

```json
[
  {
    "name": "Kringsjå ~ 109FD",
    "role": "ADMIN",
    "userId": "697bcd43-2d2b-4a20-a0f0-2918d7c340a7",
    "locationId": "182bb447-8fa3-4fab-aa1a-5f01d15d6b59",
    "gatewayserial": "02000001000109FD"
  },
  {
    "name": "Hytta",
    "role": "ADMIN",
    "userId": "697bcd43-2d2b-4a20-a0f0-2918d7c340a7",
    "locationId": "232bb400-8fa3-4fab-aa1a-5f01d15d6b62",
    "gatewayserial": "02000001000123FD"
  }
]
```

#### Home - API

**GET /homely/home/{locationId}**

This API is used for retrieving the alarm state from a Location (gateway), and detailed information/state from the available sensors at this
Location. The Location ID is retrieved by using the Location - API

This API is using Bearer Token as Authentication method. When using this API, the verification is done by using the received Token from Access
Token - API

| Field name            | Type   | Description                                                     |
|-----------------------|--------|-----------------------------------------------------------------|
| locationId (required) | String | The unique id for the location, retrieved from the location API |

<details>
<summary>Example response</summary>

```json
{
	"locationId": "182bb447-8fa3-4fab-aa1a-5f01d15d6b59",
	"gatewayserial": "02000001000109FD",
	"name": "Kringsjå ~ 109FD",
	"alarmState": "DISARMED",
	"userRoleAtLocation": "ADMIN",
	"devices": [{
			"id": "60566ab4-114b-44f9-b355-b08eae8e2bb8",
			"name": "Motion Sensor Mini",
			"serialNumber": "0015BC001A016A18",
			"location": "Floor 1 - Entrance",
			"online": false,
			"modelId": "e806ca73-4be0-4bd2-98cb-71f273b09812",
			"modelName": "Motion Sensor Mini",
			"features": {
				"alarm": {
					"states": {
						"alarm": {
							"value": true,
							"lastUpdated": "2022-03-07T10:17:06.109Z"
						},
						"tamper": {
							"value": true,
							"lastUpdated": "2022-03-07T10:17:12.031Z"
						}
					}
				},
				"temperature": {
					"states": {
						"temperature": {
							"value": 20.3,
							"lastUpdated": "2022-03-07T10:16:23.730Z"
						}
					}
				},
				"battery": {
					"states": {
						"low": {
							"value": false,
							"lastUpdated": "2021-10-22T12:54:34.415Z"
						},
						"defect": {
							"value": false,
							"lastUpdated": "2021-10-22T12:54:34.444Z"
						},
						"voltage": {
							"value": 2.9,
							"lastUpdated": "2022-03-07T03:23:20.184Z"

						}
					}
				},
				"diagnostic": {
					"states": {
						"networklinkstrength": {
							"value": 87,
							"lastUpdated": "2022-03-07T10:17:13.992Z"
						},
						"networklinkaddress": {
							"value": "0015BC002C102E91",
							"lastUpdated": "2022-02-21T12:01:35.472Z"
						}
					}
				}
			}
		},
		{
			"id": "93fc76e9-1a1f-4e63-8cf4-963f2e834eaf",
			"name": "ELKO Super TR",
			"serialNumber": "000D6F000D8106CC",
			"location": "",
			"online": true,
			"modelId": "72bb9e84-5bd3-4900-8b2e-0fe706299bf4",
			"modelName": "ELKO Super TR",
			"features": {
				"thermostat": {
					"states": {
						"LocalTemperature": {
							"value": 2380,
							"lastUpdated": "2022-03-09T13:12:12.871Z"
						},
						"AbsMinHeatSetpointLimit": {
							"value": 5,
							"lastUpdated": "2022-02-03T14:36:22.076Z"
						},
						"AbsMaxHeatSetpointLimit": {
							"value": 50,
							"lastUpdated": "2022-02-22T13:19:22.773Z"
						},
						"OccupiedCoolingSetpoint": {
							"value": 2600,
							"lastUpdated": "2022-02-03T14:36:23.359Z"
						},
						"OccupiedHeatingSetpoint": {
							"value": 2800,
							"lastUpdated": "2022-03-04T13:57:03.957Z"
						},
						"ControlSequenceOfOperation": {
							"value": 2,

							"lastUpdated": "2022-02-03T14:36:23.833Z"
						},
						"SystemMode": {
							"value": 1,
							"lastUpdated": "2022-02-03T14:36:23.960Z"
						},
						"mf415": {
							"value": true,
							"lastUpdated": "2022-03-08T16:37:39.425Z"
						},
						"mf413": {
							"value": false,
							"lastUpdated": "2022-02-03T14:36:33.303Z"
						},
						"mf412": {
							"value": false,
							"lastUpdated": "2022-02-03T14:36:33.043Z"
						},
						"mf411": {
							"value": false,
							"lastUpdated": "2022-02-03T14:36:32.800Z"
						},
						"mf406": {
							"value": true,
							"lastUpdated": "2022-02-03T14:39:13.128Z"
						},
						"mf419": {
							"value": 0,
							"lastUpdated": "2022-02-03T14:36:34.587Z"
						},
						"mf418": {
							"value": 10,
							"lastUpdated": "2022-02-07T13:25:33.056Z"
						},
						"mf417": {
							"value": 0,
							"lastUpdated": "2022-02-03T14:36:34.134Z"
						},
						"mf416": {
							"value": "01010601000A52",
							"lastUpdated": "2022-02-03T14:36:33.859Z"
						},
						"mf414": {
							"value": 28,
							"lastUpdated": "2022-02-03T14:36:27.325Z"
						},
						"mf409": {
							"value": 55546,
							"lastUpdated": "2022-02-03T14:36:26.509Z"
						},

						"mf408": {
							"value": 2000,
							"lastUpdated": "2022-03-08T16:54:34.031Z"
						},
						"mf407": {
							"value": null,
							"lastUpdated": null
						},
						"mf405": {
							"value": false,
							"lastUpdated": "2022-02-03T14:36:31.827Z"
						},
						"mf404": {
							"value": 15,
							"lastUpdated": "2022-02-22T13:19:23.746Z"
						},
						"mf403": {
							"value": "00",
							"lastUpdated": "2022-02-03T14:36:31.506Z"
						},
						"mf402": {
							"value": null,
							"lastUpdated": null
						},
						"mf401": {
							"value": 2000,
							"lastUpdated": "2022-02-22T13:19:22.961Z"
						}
					}
				}
			}
		},
		{
			"id": "a8034720-2a17-4b2a-95f4-eec910cdeddf",
			"name": "Flood Alarm",
			"serialNumber": "0015BC0033001BFC",
			"location": "",
			"online": true,
			"modelId": "84ea6e1b-7bc4-4678-ae57-9489c2ab1e7b",
			"modelName": "Flood Alarm",
			"features": {
				"alarm": {
					"states": {
						"flood": {
							"value": false,
							"lastUpdated": "2021-12-08T13:08:08.242Z"
						}
					}
				},
				"temperature": {

					"states": {
						"temperature": {
							"value": 22.8,
							"lastUpdated": "2022-03-09T12:57:32.980Z"
						}
					}
				},
				"battery": {
					"states": {
						"low": {
							"value": false,
							"lastUpdated": "2021-12-08T13:08:08.173Z"
						},
						"voltage": {
							"value": 2.9,
							"lastUpdated": "2022-03-09T10:27:25.956Z"
						}
					}
				},
				"diagnostic": {
					"states": {
						"networklinkstrength": {
							"value": 83,
							"lastUpdated": "2022-03-09T13:07:52.617Z"
						},
						"networklinkaddress": {
							"value": "0015BC002C102E91",
							"lastUpdated": "2022-03-08T00:25:49.935Z"
						}
					}
				}
			}
		},
		{
			"id": "1d6d0206-bfcc-4c8b-83f1-c23d7270fe9f",
			"name": "HAN plug",
			"serialNumber": "0015BC001B024D94",
			"location": "Floor 1 - Entrance",
			"online": true,
			"modelId": "45ffe7b0-93d7-4450-be28-51a3efb443ba",
			"modelName": "EMI Norwegian HAN",
			"features": {
				"metering": {
					"states": {
						"summationdelivered": {
							"value": 769670,
							"lastUpdated": "2022-03-09T13:00:07.206Z"
						},
						"summationreceived": {
							"value": 0,

							"lastUpdated": "2022-01-26T16:00:02.793Z"
						},
						"demand": {
							"value": 105,
							"lastUpdated": "2022-03-09T13:13:07.180Z"
						},
						"check": {
							"value": false,
							"lastUpdated": "2022-01-26T15:31:57.273Z"
						}
					}
				},
				"diagnostic": {
					"states": {
						"networklinkstrength": {
							"value": 98,
							"lastUpdated": "2022-03-09T12:53:34.797Z"
						},
						"networklinkaddress": {
							"value": "0015BC002C102E91",
							"lastUpdated": "2022-03-07T22:56:38.694Z"
						}
					}
				}
			}
		}
	]
}
```

</details>

#### Error responses

Error responses
When an error occurs, the API will return an error message consisting of error code and error message.

```json
{
  "statusCode": number,
  "message": string | string[]
}
```

statusCode: number with HTTP response status code https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

message: a string or an array of strings with information about the error code

**Examples**:

Trying to access with a non-valid authorization token:
```json
{
"statusCode": 401,
"message": "Unauthorized"
}
```

Missing one request payload param for example password in authentication endpoint:
```json
{
"statusCode": 400,
"message": ["password must be a string"]
}
```

Refresh Token has expired:
```json
{
"statusCode": 400,
"message": "Refresh token expired"
}
```

User does not have access to the specified location:
```json
{
"statusCode": 403,
"message": "User a8dc1a32-9ac4-4ec1-b793-5e7946e389ba has no access
to location 182bb447-8fa3-4fab-aa1a-5f01d15d6b51"
}
```

### WebSocket

The purpose of this guide is to set a valid connection to the Homely WebSocket channel using SocketIO. The WebSocket protocol enables
continuous communication between your solution and the WebSocket server in SDK.

Address to our WebSocket connection: //sdk.iotiliti.cloud

In addition you have to set an extra header with the authorization token to identify user and location (gateway). Use the same Token as you
received through Access Token - API

wss://sdk.iotiliti.cloud?locationId={locationId}&token=Bearer{token}

Example Connection in javascript w/ socket.io:

*NB: “JWT” is replaced by the actual token*

```js
const socket = io('//test-sdk.iotiliti.cloud', {
  {
    reconnection: false,
    transports: ['websocket'],
    autoConnect: true,
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer JWT`,
        },
      },
    },
  }
});

socket.on('event', function (data) {
// data.type -> event subject
// data.payload -> payload
  console.log(data);
});
```

The socket API is not very well documented, the only data-type I've seen this far is ``device-state-changed``, which is received whenever a sensor state is updated



