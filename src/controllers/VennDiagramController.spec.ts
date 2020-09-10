/// <reference types="jest" />
import { VennDiagramController, IVennDiagramControllerConfiguration } from './VennDiagramController';
import { extractSets, ISet } from '../data';
import { registry } from 'chart.js';
import { ArcSlice } from '../elements';
import createChart from '../__tests__/createChart';

describe('venn', () => {
  beforeAll(() => {
    registry.addControllers(VennDiagramController);
    registry.addElements(ArcSlice);
  });
  test('default', () => {
    const data = extractSets(
      [
        { label: '', values: ['alex', 'casey', 'drew', 'hunter'] },
        { label: '', values: ['casey', 'drew', 'jade'] },
        { label: '', values: ['drew', 'glen', 'jade'] },
      ],
      {
        label: 'Sports',
      }
    );
    expect(data.labels).toHaveLength(7);
    return createChart<ISet<string>, string, IVennDiagramControllerConfiguration<ISet<string>, string>>(
      {
        type: VennDiagramController.id as 'venn',
        data,
        options: {},
      },
      1000,
      500
    ).toMatchImageSnapshot();
  });
});
