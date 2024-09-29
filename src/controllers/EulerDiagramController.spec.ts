import { LinearScale, registry } from 'chart.js';
import { EulerDiagramController } from './EulerDiagramController';
import { extractSets } from '../data';
import { ArcSlice } from '../elements';
import createChart from '../__tests__/createChart';
import { describe, beforeAll, test, expect } from 'vitest';
describe('Euler', () => {
  beforeAll(() => {
    registry.addControllers(EulerDiagramController);
    registry.addElements(ArcSlice);
    registry.addScales(LinearScale);
  });
  test('default', () => {
    const data = extractSets(
      [
        { label: ' ', values: [1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18] },
        { label: '  ', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23] },
        { label: '   ', values: [1, 11, 12, 4, 5, 24, 25, 26, 27, 28, 29, 30] },
      ],
      {
        label: 'Sets',
      }
    );
    expect(data.labels).toHaveLength(7);
    return createChart(
      {
        type: EulerDiagramController.id,
        data,
        options: {
          borderColor: 'transparent',
        },
      },
      1000,
      500
    ).toMatchImageSnapshot({
      failureThreshold: 0.02,
      failureThresholdType: 'percent',
    });
  });
});
