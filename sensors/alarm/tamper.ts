import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'alarm', 'tamper'>> = {
  path: 'alarm.states.tamper.value',
  format: 'boolean',
  type: 'binary_sensor',
  name: 'tamper',
  deviceClass: 'tamper',
  deviceSuffix: 'tamper',
};

export { sensor };
