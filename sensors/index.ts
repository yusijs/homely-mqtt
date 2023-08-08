import alarm from './alarm';
import battery from './battery';
import diagnostics from './diagnostics';
import temperature from './temperature';
import metering from './metering';

export const sensors = [
  ...alarm,
  ...battery,
  ...diagnostics,
  ...temperature,
  ...metering,
];
