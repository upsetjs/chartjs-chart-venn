import { CartesianScaleTypeRegistry, Chart, ChartConfiguration, ChartItem, CoreChartOptions } from 'chart.js';
import type { IVennDiagramLayout } from '../model/layout';
import { VennDiagramController, IVennDiagramControllerDatasetOptions } from './VennDiagramController';
import euler from '../model/euler';
import type { IBoundingBox } from '../model/interfaces';
import patchController from './patchController';
import { ArcSlice } from '../elements';
import { ISet } from 'src/data';

export class EulerDiagramController extends VennDiagramController {
  static readonly id = 'euler';

  /**
   * @hidden
   */
  static readonly defaults = VennDiagramController.defaults;

  protected computeLayout(size: IBoundingBox): IVennDiagramLayout {
    const sets = (this as any)._data as readonly { sets: readonly string[]; value: number }[];
    return euler(sets, size);
  }
}

export type IEulerDiagramControllerDatasetOptions = IVennDiagramControllerDatasetOptions;

declare module 'chart.js' {
  interface ChartTypeRegistry {
    euler: {
      chartOptions: CoreChartOptions<'euler'>;
      datasetOptions: IEulerDiagramControllerDatasetOptions;
      defaultDataPoint: number | ISet<number>;
      metaExtensions: Record<string, never>;
      parsedDataType: { x: number; y: number };
      scales: keyof CartesianScaleTypeRegistry;
    };
  }
}

export class EulerDiagramChart<DATA extends unknown[] = number[], LABEL = string> extends Chart<'euler', DATA, LABEL> {
  static id = EulerDiagramController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'euler', DATA, LABEL>, 'type'>) {
    super(item, patchController('euler', config, EulerDiagramController, ArcSlice));
  }
}
