import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'metering', 'summationreceived'>> = {
  path: 'metering.states.summationreceived.value',
  format: 'number',
  type: 'sensor',
  unit: 'kWh',
  name: 'production',
  deviceClass: 'energy',
  stateClass: 'total',
};

export { sensor };
