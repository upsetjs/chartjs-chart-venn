/// <reference types="jest" />
import { VennDiagramController, IVennDiagramControllerConfiguration } from './VennDiagramController';
import { extractSets, ISet } from '../data';
import { registry } from '@sgratzl/chartjs-esm-facade';
import { ArcSlice } from '../elements';
import matchChart from '../__tests__/matchChart';

describe('venn', () => {
  beforeAll(() => {
    registry.addControllers(VennDiagramController);
    registry.addElements(ArcSlice);
  });
  test('default', () => {
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
    expect(data.labels).toHaveLength(7);
    return matchChart<ISet<string>, string, IVennDiagramControllerConfiguration<ISet<string>, string>>(
      {
        type: VennDiagramController.id as 'venn',
        data,
        options: {},
      },
      1000,
      500
    );
  });
});
