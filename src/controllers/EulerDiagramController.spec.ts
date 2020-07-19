/// <reference types="jest" />
import { registry } from '@sgratzl/chartjs-esm-facade';
import { EulerDiagramController } from './EulerDiagramController';
import { extractSets } from '../data';
import { ArcSlice } from '../elements';

describe('Euler', () => {
  beforeAll(() => {
    registry.addControllers(EulerDiagramController);
    registry.addElements(ArcSlice);
  });
  test('default', () => {
    const data = extractSets(
      [
        { label: 'Aklj; kj ;', values: [1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18] },
        { label: 'Basfeaf', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23] },
        { label: 'C wewe', values: [1, 11, 12, 4, 5, 24, 25, 26, 27, 28, 29, 30] },
      ],
      {
        label: 'Sets',
      }
    );
    expect(data.labels).toHaveLength(7);
    // return matchChart(
    //   {
    //     type: EulerDiagramController.id,
    //     data,
    //     options: {
    //       legend: {
    //         display: false,
    //       },
    //     },
    //   },
    //   1000,
    //   500
    // );
  });
});
