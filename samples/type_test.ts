import { Chart, LinearScale } from 'chart.js';
import { VennDiagramController, ArcSlice, EulerDiagramController, extractSets } from '../build';

// register controller in chart.js and ensure the defaults are set
Chart.register(VennDiagramController, ArcSlice, LinearScale, EulerDiagramController);

const ctx = document.querySelector('canvas').getContext('2d');

const data = extractSets(
  [
    { label: 'Soccer', values: ['alex', 'casey', 'drew', 'hunter'] },
    { label: 'Tennis', values: ['casey', 'drew', 'jade'] },
    { label: 'Volleyball', values: ['drew', 'glen', 'jade'] },
  ],
  {
    label: 'Sports',
  }
);

const chart = new Chart(ctx, {
  type: 'venn',
  data: {
    labels: data.labels,
    datasets: [
      {
        ...data.datasets[0],
        backgroundColor: 'red',
      },
    ],
  },
  options: {
    elements: {
      arcSlice: {
        backgroundColor: 'red',
      },
    },
  },
});

const euler = new Chart(ctx, {
  type: 'euler',
  data: {
    labels: data.labels,
    datasets: [
      {
        ...data.datasets[0],
        backgroundColor: 'blue',
      },
    ],
  },
  options: {
    elements: {
      arcSlice: {
        backgroundColor: 'red',
      },
    },
  },
});
