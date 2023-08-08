import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'temperature', 'temperature'>> = {
  path: 'temperature.states.temperature.value',
  format: 'number',
  type: 'sensor',
  unit: '°C',
  name: 'temperature',
  deviceClass: 'temperature',
  stateClass: 'measurement',
};

export { sensor };
