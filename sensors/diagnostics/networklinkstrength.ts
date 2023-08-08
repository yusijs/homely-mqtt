import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'diagnostic', 'networklinkstrength'>> = {
  path: 'diagnostic.states.networklinkstrength.value',
  format: 'number',
  type: 'sensor',
  unit: 'dBm',
  deviceClass: 'signal_strength',
  name: 'networklink_strength',
  deviceSuffix: 'networklinkstrength',
  entityCategory: 'diagnostic',
};

export { sensor };
