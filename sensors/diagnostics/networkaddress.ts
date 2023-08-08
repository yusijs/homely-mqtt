import { Sensor } from '../model';
import { Feature } from '../../models/feature';

const sensor: Sensor<Feature<'diagnostic', 'networklinkaddress'>> = {
  path: 'diagnostic.states.networklinkaddress.value',
  format: 'string',
  type: 'sensor',
  name: 'networklink_address',
  entityCategory: 'diagnostic',
};

export { sensor };
