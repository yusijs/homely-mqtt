import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'metering', 'demand'>> = {
  path: 'metering.states.demand.value',
  format: 'number',
  type: 'sensor',
  unit: 'kWh',
  name: 'demand',
  deviceClass: 'energy',
  stateClass: 'total',
};

export { sensor };
