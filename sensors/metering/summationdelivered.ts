import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'metering', 'summationdelivered'>> = {
  path: 'metering.states.summationdelivered.value',
  format: 'number',
  type: 'sensor',
  unit: 'kWh',
  name: 'consumption',
  deviceClass: 'energy',
  stateClass: 'total',
};

export { sensor };
