/// <reference types="jest" />
import { VennDiagramController } from './VennDiagramController';
import { extractSets } from '../data';
import { registry } from '@sgratzl/chartjs-esm-facade';
import { ArcSlice } from '../elements';

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
    // return matchChart(
    //   {
    //     type: VennDiagramController.id,
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
