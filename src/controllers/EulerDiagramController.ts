import { Chart, IChartDataset, IChartConfiguration, ChartItem } from 'chart.js';
import { IVennDiagramLayout } from '../model/layout';
import { VennDiagramController, IVennDiagramControllerDatasetOptions } from './VennDiagramController';
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

export type IEulerDiagramControllerDatasetOptions = IVennDiagramControllerDatasetOptions;

export type IEulerDiagramControllerDataset<T = number> = IChartDataset<T, IEulerDiagramControllerDatasetOptions>;

export type IEulerDiagramControllerConfiguration<T = number[], L = string> = IChartConfiguration<
  'euler',
  T,
  L,
  IEulerDiagramControllerDataset<T>
>;

export class EulerDiagramChart<T = number, L = string> extends Chart<T, L, IEulerDiagramControllerConfiguration<T, L>> {
  static readonly id = EulerDiagramController.id;

  constructor(item: ChartItem, config: Omit<IEulerDiagramControllerConfiguration<T, L>, 'type'>) {
    super(item, patchController('euler', config, EulerDiagramController, ArcSlice));
  }
}
