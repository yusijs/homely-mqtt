import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'battery', 'defect'>> = {
  path: 'battery.states.defect.value',
  format: 'boolean',
  type: 'binary_sensor',
  name: 'battery_defect',
  entityCategory: 'diagnostic',
  icon: 'mdi:battery-alert',
};

export { sensor };
