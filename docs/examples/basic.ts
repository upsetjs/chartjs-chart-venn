import type { ChartConfiguration } from 'chart.js';
import { Chart } from 'chart.js';
import { extractSets } from '../../src';

// #region data

export const data: ChartConfiguration<'venn'>['data'] = extractSets(
  [
    { label: 'Soccer', values: ['alex', 'casey', 'drew', 'hunter'] },
    { label: 'Tennis', values: ['casey', 'drew', 'jade'] },
    { label: 'Volleyball', values: ['drew', 'glen', 'jade'] },
  ],
  {
    label: 'Sports',
  }
);

// #endregion

// #region config
export const config: ChartConfiguration<'venn'> = {
  type: 'venn',
  data,
};
// #endregion config
