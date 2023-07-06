import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';
import { data } from './basic';

// #region config
export const config: ChartConfiguration<'venn'> = {
  type: 'venn',
  data,
  options: {
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Arial',
            size: 18,
          },
          color: 'green',
        },
      },
      y: {
        ticks: {
          font: {
            family: 'Arial',
            size: 20,
          },
          color: 'red',
        },
      },
    },
  },
};
// #endregion config
