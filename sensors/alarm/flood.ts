import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'alarm', 'flood'>> = {
  path: 'alarm.states.flood.value',
  format: 'boolean',
  deviceSuffix: 'alarm',
  type: 'binary_sensor',
  name: 'Flood',
  deviceClass: 'moisture',
};

export { sensor };
