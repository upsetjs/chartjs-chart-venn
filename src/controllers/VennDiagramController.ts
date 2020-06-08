import { Chart, DatasetController, registerController, patchControllerConfig } from '../chart';
import { ArcSlice } from '../elements';

export class VennDiagramController extends DatasetController {
  static readonly id = 'venn';

  readonly dataElementType = ArcSlice.register();
  readonly dataElementOptions: string[] = [];

  static readonly defaults = {
    scales: {
      x: {
        type: 'linear',
        min: -1,
        max: 1,
        display: false,
      },
      y: {
        type: 'linear',
        min: -1,
        max: 1,
        display: false,
      },
    },
  };

  static register() {
    return registerController(VennDiagramController);
  }
}

export class VennDiagramsChart extends Chart {
  static readonly id = VennDiagramController.id;

  constructor(item: any, config: any) {
    super(item, patchControllerConfig(config, VennDiagramController));
  }
}
