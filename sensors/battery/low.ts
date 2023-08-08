import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'battery', 'low'>> = {
  path: 'battery.states.low.value',
  format: 'boolean',
  type: 'binary_sensor',
  name: 'battery_low',
  deviceClass: 'battery',
  entityCategory: 'diagnostic',
};

export { sensor };
