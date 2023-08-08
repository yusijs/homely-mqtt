/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
import { Device } from '../models/home';

type Entry = { key: string; value: any; optional: boolean };

type Explode<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? Explode<T[K]> extends infer E
          ? E extends Entry
            ? {
                key: `${K}${E['key'] extends '' ? '' : '.'}${E['key']}`;
                value: E['value'];
                optional: E['key'] extends ''
                  ? {} extends Pick<T, K>
                    ? true
                    : false
                  : E['optional'];
              }
            : never
          : never
        : never;
    }[keyof T]
  : { key: ''; value: T; optional: false };

type Collapse<T extends Entry> = {
  [E in Extract<T, { optional: false }> as E['key']]: E['value'];
} & Partial<{
  [E in Extract<T, { optional: true }> as E['key']]: E['value'];
}> extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

/**
 * Flatten a nested object into a single level object with dot-notation keys
 * @example
 *  type Foo = {
 *    a: {
 *      b: {
 *        c: string;
 *      }
 *      d: number;
 *      e: boolean;
 *    }
 *  }
 *  Flatten<Foo> = {
 *    'a.b.c': string;
 *    'a.d': number;
 *    'a.e': boolean;
 *  }
 */
type Flatten<T> = Collapse<Explode<T>>;

type _Sensor<T = object> = {
  /**
   * Path to the value in the `device.features` object (dot-notation)
   * @example 'battery.states.battery.value'
   * @example 'alarm.states.fire.value'
   * @example 'alarm.states.alarm.value'
   */
  path: keyof Flatten<T>;
  /**
   * The data-format of the sensor
   */
  format: 'number' | 'string' | 'boolean';
  /**
   * Sensor type, either `sensor` or `binary_sensor`. Used for Home Assistant discovery.
   */
  type: 'sensor' | 'binary_sensor';
  /**
   * Friendly name of the device, this is what shows up in the Home Assistant UI
   */
  name: string;
  /**
   * The suffix appended to the unique_id field, this is combined with the deviceId to create a unique id for the sensor to update it in home assistant
   */
  deviceSuffix?: string;
  /**
   * A function that returns the friendly name of the device, this is what shows up in the Home Assistant UI.
   * This is used for e.g. alarm sensors, since both contact & motion is exposed as "alarm.states.alarm"
   * @example (dev) => dev.modelName.toLowerCase().includes('motion') ? 'motion' : 'contact'
   * @param dev
   */
  getName: (dev: Device) => string;
  /**
   * The device class of the sensor, e.g 'door' or 'motion'. Used to classify the sensor in Home Assistant.
   */
  deviceClass?: string;
  /**
   * A function that returns the device class, e.g 'door' or 'motion'. Used to classify the sensor in Home Assistant.
   * @example (dev) => dev.modelName.toLowerCase().includes('motion') ? 'motion' : 'door'
   * @param dev
   */
  getDeviceClass?: (dev: Device) => string;
  id?: string;
  /**
   * The unit of the sensor, e.g '°C' or '%'. Used to show the correct unit in Home Assistant.
   */
  unit?: string;
  /**
   * Category of the entity. Used for e.g. marking a sensor as being diagnostic
   */
  entityCategory?: string;
  /**
   * Custom icon for the sensor. Used to override the default icon in Home Assistant.
   */
  icon?: string;
  /**
   * Function that returns a custom icon for the sensor. Used to override the default icon in Home Assistant.
   * @param dev
   */
  getIcon?: (dev: Device) => string;
  /**
   * Home assistant state class, e.g 'total' or 'measurement'. Used by home assistant to know if e.g. statistics should be created.
   */
  stateClass?: string;
};

export type SensorWithName<T = object> = Omit<_Sensor<T>, 'getName'>;
type SensorWithNameGetter<T = object> = Omit<_Sensor<T>, 'name'>;

export type Sensor<T = object> = SensorWithName<T> | SensorWithNameGetter<T>;
