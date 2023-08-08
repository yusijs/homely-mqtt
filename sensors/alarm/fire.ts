import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'alarm', 'fire'>> = {
  path: 'alarm.states.fire.value',
  format: 'boolean',
  type: 'binary_sensor',
  deviceSuffix: 'alarm',
  name: 'fire',
  deviceClass: 'smoke',
};

export { sensor };
