import matchChart from '../__tests__/matchChart';
import { VennDiagramController } from './VennDiagramController';

describe('venn', () => {
  beforeAll(() => {
    VennDiagramController.register();
  });
  test('default', () => {
    return matchChart(
      {
        type: VennDiagramController.id,
        data: {
          labels: [],
          datasets: {
            label: 'Test',
            data: [],
          },
        },
        options: {
          legend: {
            display: false,
          },
        },
      },
      1000,
      500
    );
  });
});
