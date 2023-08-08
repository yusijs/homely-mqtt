import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'battery', 'voltage'>> = {
  path: 'battery.states.voltage.value',
  format: 'number',
  type: 'sensor',
  name: 'battery_voltage',
  unit: 'V',
  deviceClass: 'voltage',
  entityCategory: 'diagnostic',
};

export { sensor };
