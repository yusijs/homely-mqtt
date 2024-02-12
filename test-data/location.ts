import { Home } from '../models/home';

export const testLocation = {
  locationId: '1df2622e-f6d4-4c6a-a46e-220eee625293',
  gatewayserial: '123456789123A12B',
  name: 'Home',
  alarmState: 'DISARMED',
  userRoleAtLocation: 'OWNER',
  devices: [
    {
      id: '388ddbab-6883-4abf-b80e-464a9631c8ad',
      name: 'RauchWohn',
      serialNumber: '0015BC0031016C2B',
      location: 'Floor 1 - Wohnzimmer',
      online: true,
      modelId: '15e64f49-fdbc-4cd6-9912-e2a6e838d44f',
      modelName: 'Intelligent Smoke Alarm',
      features: {
        alarm: {
          states: {
            fire: {
              value: false,
              lastUpdated: '2024-02-09T09:03:11.910Z',
            },
          },
        },
        temperature: {
          states: {
            temperature: {
              value: 23.9,
              lastUpdated: '2024-02-12T15:47:13.584Z',
            },
          },
        },
        battery: {
          states: {
            low: {
              value: false,
              lastUpdated: '2024-02-09T09:03:11.841Z',
            },
            voltage: {
              value: 3,
              lastUpdated: '2024-02-09T09:03:44.527Z',
            },
          },
        },
        diagnostic: {
          states: {
            networklinkstrength: {
              value: 98,
              lastUpdated: '2024-02-12T15:37:49.110Z',
            },
            networklinkaddress: {
              value: '0015BC002C10150D',
              lastUpdated: '2024-02-09T09:02:48.569Z',
            },
          },
        },
      },
    },
    {
      id: '54700105-6491-4494-aca6-21f7a9861cc1',
      name: 'HitzeKueche',
      serialNumber: '0015BC0034000F9E',
      location: 'Floor 1 - Kueche',
      online: true,
      modelId: 'ad923ba3-2b72-45e0-a9d7-91808a76f2ed',
      modelName: 'Intelligent Heat Alarm',
      features: {
        alarm: {
          states: {
            fire: {
              value: false,
              lastUpdated: '2024-02-09T09:19:05.813Z',
            },
          },
        },
        temperature: {
          states: {
            temperature: {
              value: 21,
              lastUpdated: '2024-02-12T15:52:46.698Z',
            },
          },
        },
        battery: {
          states: {
            low: {
              value: false,
              lastUpdated: '2024-02-09T09:19:05.779Z',
            },
            voltage: {
              value: 3,
              lastUpdated: '2024-02-09T09:19:06.383Z',
            },
          },
        },
        diagnostic: {
          states: {
            networklinkstrength: {
              value: 40,
              lastUpdated: '2024-02-12T15:52:49.768Z',
            },
            networklinkaddress: {
              value: '0015BC0041004693',
              lastUpdated: '2024-02-11T12:11:09.193Z',
            },
          },
        },
      },
    },
    {
      id: 'bd53d485-45c7-4190-bbb9-20348efbb44b',
      name: 'Flood Alarm',
      serialNumber: '0015BC003300224D',
      location: 'Floor 1 - Kueche',
      online: true,
      modelId: '84ea6e1b-7bc4-4678-ae57-9489c2ab1e7b',
      modelName: 'Flood Alarm',
      features: {
        alarm: {
          states: {
            flood: {
              value: false,
              lastUpdated: '2024-02-12T08:48:43.939Z',
            },
          },
        },
        temperature: {
          states: {
            temperature: {
              value: 18.9,
              lastUpdated: '2024-02-12T14:03:35.541Z',
            },
          },
        },
        battery: {
          states: {
            low: {
              value: false,
              lastUpdated: '2024-02-12T08:48:43.889Z',
            },
            voltage: {
              value: 3,
              lastUpdated: '2024-02-12T09:07:09.913Z',
            },
          },
        },
        diagnostic: {
          states: {
            networklinkstrength: {
              value: 40,
              lastUpdated: '2024-02-12T15:53:43.001Z',
            },
            networklinkaddress: {
              value: '0015BC0041004693',
              lastUpdated: '2024-02-12T09:05:41.936Z',
            },
          },
        },
      },
    },
    {
      id: '9285f962-cdce-4704-89b6-c2d203071ad9',
      name: 'Alarm Motion Sensor 2',
      serialNumber: '0015BC001A106F61',
      location: 'Floor 1 - Wohnzimmer',
      online: true,
      modelId: '17ddbcb4-8c00-4bc3-b06f-d20f51c0fe52',
      modelName: 'Alarm Motion Sensor 2',
      features: {
        setup: {
          states: {
            appledenable: {
              value: true,
              lastUpdated: '2024-02-12T09:15:12.053Z',
            },
            errledenable: {
              value: true,
              lastUpdated: '2024-02-12T09:15:12.016Z',
            },
          },
        },
        alarm: {
          states: {
            alarm: {
              value: false,
              lastUpdated: '2024-02-12T12:10:00.325Z',
            },
            tamper: {
              value: false,
              lastUpdated: '2024-02-12T09:36:03.529Z',
            },
            sensitivitylevel: {
              value: 3,
              lastUpdated: '2024-02-12T09:15:15.403Z',
            },
          },
        },
        temperature: {
          states: {
            temperature: {
              value: 19.3,
              lastUpdated: '2024-02-12T14:19:17.648Z',
            },
          },
        },
        battery: {
          states: {
            low: {
              value: false,
              lastUpdated: '2024-02-12T09:15:15.644Z',
            },
            defect: {
              value: false,
              lastUpdated: '2024-02-12T09:15:15.687Z',
            },
            voltage: {
              value: 3.1,
              lastUpdated: '2024-02-12T09:15:05.552Z',
            },
          },
        },
        diagnostic: {
          states: {
            networklinkstrength: {
              value: 47,
              lastUpdated: '2024-02-12T15:55:03.680Z',
            },
            networklinkaddress: {
              value: '0015BC0041004693',
              lastUpdated: '2024-02-12T09:28:09.285Z',
            },
          },
        },
      },
    },
    {
      id: '33660ecc-c25a-4d21-8888-bfaf908b2bcf',
      name: 'Kellertuer',
      serialNumber: '0015BC004400C6AC',
      location: 'Floor 0 - FlurUnten',
      online: true,
      modelId: '9b765375-e3f4-4627-b73c-b4143ce86c2c',
      modelName: 'Alarm Entry Sensor 2',
      features: {
        alarm: {
          states: {
            alarm: {
              value: false,
              lastUpdated: '2024-02-12T10:04:02.238Z',
            },
            tamper: {
              value: false,
              lastUpdated: '2024-02-09T17:17:39.811Z',
            },
          },
        },
        temperature: {
          states: {
            temperature: {
              value: 19.2,
              lastUpdated: '2024-02-12T15:22:17.044Z',
            },
          },
        },
        battery: {
          states: {
            low: {
              value: false,
              lastUpdated: '2024-02-09T11:53:41.376Z',
            },
            defect: {
              value: null,
              lastUpdated: null,
            },
            voltage: {
              value: 3.1,
              lastUpdated: '2024-02-09T11:53:23.087Z',
            },
          },
        },
        diagnostic: {
          states: {
            networklinkstrength: {
              value: 80,
              lastUpdated: '2024-02-12T15:53:18.148Z',
            },
            networklinkaddress: {
              value: '0015BC0041004693',
              lastUpdated: '2024-02-09T11:53:38.504Z',
            },
          },
        },
      },
    },
    {
      id: 'f8dece0d-681e-47b3-a0bc-0ab6bc4ffe42',
      name: 'RauchGaeste',
      serialNumber: '0015BC0031016A89',
      location: 'Floor 2 - Gaestezimmer',
      online: true,
      modelId: '15e64f49-fdbc-4cd6-9912-e2a6e838d44f',
      modelName: 'Intelligent Smoke Alarm',
      features: {
        alarm: {
          states: {
            fire: {
              value: false,
              lastUpdated: '2024-02-09T09:41:09.261Z',
            },
          },
        },
        temperature: {
          states: {
            temperature: {
              value: 18.8,
              lastUpdated: '2024-02-12T15:11:56.297Z',
            },
          },
        },
        battery: {
          states: {
            low: {
              value: false,
              lastUpdated: '2024-02-09T09:41:09.239Z',
            },
            voltage: {
              value: 3,
              lastUpdated: '2024-02-12T15:45:45.010Z',
            },
          },
        },
        diagnostic: {
          states: {
            networklinkstrength: {
              value: 33,
              lastUpdated: '2024-02-12T15:55:29.671Z',
            },
            networklinkaddress: {
              value: '0015BC002C10150D',
              lastUpdated: '2024-02-09T09:41:42.212Z',
            },
          },
        },
      },
    },
    {
      id: '3c54aec8-c2fa-4d3c-815b-6ad5b804a1b2',
      name: 'RauchFlurUnten',
      serialNumber: '0015BC003101D0C3',
      location: 'Floor 0 - FlurUnten',
      online: true,
      modelId: '15e64f49-fdbc-4cd6-9912-e2a6e838d44f',
      modelName: 'Intelligent Smoke Alarm',
      features: {
        alarm: {
          states: {
            fire: {
              value: false,
              lastUpdated: '2024-02-09T09:54:54.851Z',
            },
          },
        },
        temperature: {
          states: {
            temperature: {
              value: 17.5,
              lastUpdated: '2024-02-12T15:53:32.913Z',
            },
          },
        },
        battery: {
          states: {
            low: {
              value: false,
              lastUpdated: '2024-02-09T09:54:54.825Z',
            },
            voltage: {
              value: 3,
              lastUpdated: '2024-02-09T09:54:55.852Z',
            },
          },
        },
        diagnostic: {
          states: {
            networklinkstrength: {
              value: 92,
              lastUpdated: '2024-02-12T15:44:07.278Z',
            },
            networklinkaddress: {
              value: '0015BC002F0082C5',
              lastUpdated: '2024-02-09T18:02:31.487Z',
            },
          },
        },
      },
    },
    {
      id: '3b06b112-e11e-4107-a568-6e799db8eab2',
      name: 'RauchSchlaf',
      serialNumber: '0015BC003101CE52',
      location: 'Floor 0 - Schlafzimmer',
      online: true,
      modelId: '15e64f49-fdbc-4cd6-9912-e2a6e838d44f',
      modelName: 'Intelligent Smoke Alarm',
      features: {
        alarm: {
          states: {
            fire: {
              value: false,
              lastUpdated: '2024-02-09T09:46:52.910Z',
            },
          },
        },
        temperature: {
          states: {
            temperature: {
              value: 15.3,
              lastUpdated: '2024-02-12T15:54:38.486Z',
            },
          },
        },
        battery: {
          states: {
            low: {
              value: false,
              lastUpdated: '2024-02-09T09:46:52.881Z',
            },
            voltage: {
              value: 3,
              lastUpdated: '2024-02-09T09:46:53.381Z',
            },
          },
        },
        diagnostic: {
          states: {
            networklinkstrength: {
              value: 83,
              lastUpdated: '2024-02-12T15:18:41.606Z',
            },
            networklinkaddress: {
              value: '0015BC002F0082C5',
              lastUpdated: '2024-02-12T09:17:38.327Z',
            },
          },
        },
      },
    },
    {
      id: '7af931df-2ba1-4c2a-b370-75d867df1685',
      name: 'RauchWerkstatt',
      serialNumber: '0015BC0031008672',
      location: 'Floor 1 - Werkstatt',
      online: true,
      modelId: 'ffe30099-92c5-4471-879f-41f412d423ab',
      modelName: 'Smoke Alarm',
      features: {
        alarm: {
          states: {
            fire: {
              value: false,
              lastUpdated: '2024-02-09T12:50:14.053Z',
            },
          },
        },
        temperature: {
          states: {
            temperature: {
              value: 16.6,
              lastUpdated: '2024-02-12T15:52:58.442Z',
            },
          },
        },
        battery: {
          states: {
            low: {
              value: false,
              lastUpdated: '2024-02-09T12:50:14.031Z',
            },
            voltage: {
              value: 3,
              lastUpdated: '2024-02-10T10:54:07.818Z',
            },
          },
        },
        diagnostic: {
          states: {
            networklinkstrength: {
              value: 98,
              lastUpdated: '2024-02-12T09:04:07.277Z',
            },
            networklinkaddress: {
              value: '0015BC004100469E',
              lastUpdated: '2024-02-09T12:51:37.456Z',
            },
          },
        },
      },
    },
  ],
} as Home;
