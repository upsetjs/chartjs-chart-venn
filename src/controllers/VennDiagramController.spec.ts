import { LinearScale, registry } from 'chart.js';
import { VennDiagramController } from './VennDiagramController';
import { extractSets } from '../data';
import { ArcSlice } from '../elements';
import createChart from '../__tests__/createChart';
import { describe, beforeAll, test, expect } from 'vitest';
describe('venn', () => {
  beforeAll(() => {
    registry.addControllers(VennDiagramController);
    registry.addElements(ArcSlice);
    registry.addScales(LinearScale);
  });
  test('default', () => {
    const data = extractSets(
      [
        { label: ' ', values: ['alex', 'casey', 'drew', 'hunter'] },
        { label: '  ', values: ['casey', 'drew', 'jade'] },
        { label: '   ', values: ['drew', 'glen', 'jade'] },
      ],
      {
        label: 'Sports',
      }
    );
    expect(data.labels).toHaveLength(7);
    return createChart(
      {
        type: VennDiagramController.id as 'venn',
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
