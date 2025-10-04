import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';
import { data } from './basic';

// #region config
export const config: ChartConfiguration<'venn'> = {
  type: 'venn',
  data: {
    labels: data.labels,
    datasets: [
      {
        ...data.datasets[0],
        backgroundColor: 'blue',
        borderColor: 'red',
        borderWidth: 10,
      },
    ],
  },
  options: {
    layout: {
      padding: 10,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
        ticks: {
          color: 'white',
          font: {
            size: 20,
          },
          callback: (v, i) => `${i}: ${v}`,
        },
      },
    },
  },
};
// #endregion config
