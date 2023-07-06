import type { ChartConfiguration } from 'chart.js';
import { Chart } from 'chart.js';
import { extractSets } from '../../src';

// #region data

export const data: ChartConfiguration<'venn'>['data'] = {
  labels: [
    'Soccer',
    'Tennis',
    'Volleyball',
    'Soccer ∩ Tennis',
    'Soccer ∩ Volleyball',
    'Tennis ∩ Volleyball',
    'Soccer ∩ Tennis ∩ Volleyball',
  ],
  datasets: [
    {
      label: 'Sports',
      data: [
        { sets: ['Soccer'], value: 2 },
        { sets: ['Tennis'], value: 0 },
        { sets: ['Volleyball'], value: 1 },
        { sets: ['Soccer', 'Tennis'], value: 1 },
        { sets: ['Soccer', 'Volleyball'], value: 0 },
        { sets: ['Tennis', 'Volleyball'], value: 1 },
        { sets: ['Soccer', 'Tennis', 'Volleyball'], value: 1 },
      ],
    },
  ],
};

// #endregion

// #region config
export const config: ChartConfiguration<'venn'> = {
  type: 'venn',
  data,
};
// #endregion config
