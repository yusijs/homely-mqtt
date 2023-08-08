import alarm from './alarm';
import battery from './battery';
import diagnostics from './diagnostics';
import temperature from './temperature';

export const sensors = [...alarm, ...battery, ...diagnostics, ...temperature];
