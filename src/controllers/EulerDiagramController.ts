import { Chart, ChartConfiguration, ContextType } from '@sgratzl/chartjs-esm-facade';
import { IVennDiagramLayout } from '../model/layout';
import { VennDiagramController } from './VennDiagramController';
import euler from '../model/euler';
import { IBoundingBox } from '../model/interfaces';
import patchController from './patchController';
import { ArcSlice } from '../elements';

export class EulerDiagramController extends VennDiagramController {
  static readonly id = 'euler';
  static readonly defaults = VennDiagramController.defaults;

  protected computeLayout(size: IBoundingBox): IVennDiagramLayout {
    const sets = (this as any)._data as readonly { sets: readonly string[]; value: number }[];
    return euler(sets, size);
  }
}

export class EulerDiagramChart extends Chart {
  static readonly id = EulerDiagramController.id;

  constructor(item: ContextType, config: Omit<ChartConfiguration, 'type'>) {
    super(item, patchController(config, EulerDiagramController, ArcSlice));
  }
}
