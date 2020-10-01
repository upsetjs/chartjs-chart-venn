import { Chart, IChartConfiguration, ChartItem, ICartesianScaleTypeRegistry, ICoreChartOptions } from 'chart.js';
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

declare module 'chart.js' {
  enum ChartTypeEnum {
    euler = 'euler',
  }
  interface IChartTypeRegistry {
    euler: {
      chartOptions: ICoreChartOptions;
      datasetOptions: IEulerDiagramControllerDatasetOptions;
      defaultDataPoint: number[];
      scales: keyof ICartesianScaleTypeRegistry;
    };
  }
}

export class EulerDiagramChart<DATA extends unknown[] = number[], LABEL = string> extends Chart<'euler', DATA, LABEL> {
  static id = EulerDiagramController.id;

  constructor(item: ChartItem, config: Omit<IChartConfiguration<'euler', DATA, LABEL>, 'type'>) {
    super(item, patchController('euler', config, EulerDiagramController, ArcSlice));
  }
}
