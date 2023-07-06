import type { ChartConfiguration } from 'chart.js';
import { Chart } from 'chart.js';
import { extractSets } from '../../src';

// #region data

export const data: ChartConfiguration<'euler'>['data'] = extractSets(
  [
    { label: 'A', values: [1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18] },
    { label: 'B', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23] },
    { label: 'C', values: [1, 11, 12, 4, 5, 24, 25, 26, 27, 28, 29, 30] },
  ],
  {
    label: 'Sets',
  }
);

// #endregion

// #region config
export const config: ChartConfiguration<'euler'> = {
  type: 'euler',
  data,
};
// #endregion config
