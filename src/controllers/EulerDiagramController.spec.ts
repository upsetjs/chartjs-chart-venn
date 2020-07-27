/// <reference types="jest" />
import { registry } from '@sgratzl/chartjs-esm-facade';
import { EulerDiagramController, IEulerDiagramControllerConfiguration } from './EulerDiagramController';
import { extractSets, ISet } from '../data';
import { ArcSlice } from '../elements';
import matchChart from '../__tests__/matchChart';

describe('Euler', () => {
  beforeAll(() => {
    registry.addControllers(EulerDiagramController);
    registry.addElements(ArcSlice);
  });
  test('default', () => {
    const data = extractSets(
      [
        { label: '', values: [1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18] },
        { label: '', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23] },
        { label: '', values: [1, 11, 12, 4, 5, 24, 25, 26, 27, 28, 29, 30] },
      ],
      {
        label: 'Sets',
      }
    );
    expect(data.labels).toHaveLength(7);
    return matchChart<ISet<number>, string, IEulerDiagramControllerConfiguration<ISet<number>, string>>(
      {
        type: EulerDiagramController.id,
        data,
      },
      1000,
      500
    );
  });
});
