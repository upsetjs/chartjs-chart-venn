import ChartNS from 'chart.js';

export interface IChartDataSet {
  label?: string;
  data: any[];
  [key: string]: undefined | string | any[] | ((ctx: any) => any | undefined);
}

export interface IChartData {
  labels: any[];
  datasets: IChartDataSet[];
}

export declare class CoreChart {
  ctx?: CanvasRenderingContext2D;

  config: {
    options?: {
      scales: {
        [key: string]: IMapping;
      };
    };
  };

  data: IChartData;
  scales: { [key: string]: any };

  update(): void;
}

export type IMapping = {
  [key: string]: IMapping | number | string | boolean | null;
};

export const Chart = (ChartNS as unknown) as typeof ChartNS.Chart;

export type ElementConstructor = {
  readonly id: string;
  readonly defaults: IMapping;
};

/** @internal */
export const defaults = ChartNS.defaults;

/** @internal */
export function registerElement<T extends ElementConstructor>(element: T): T {
  defaults.set('elements', {
    [element.id]: element.defaults,
  });
  return element;
}

export declare class DatasetControllerType {}

export declare type DatasetControllerTypeConstructor = {
  new (): DatasetControllerType;
};

export declare type ControllerTypeConstructor = DatasetControllerTypeConstructor & {
  readonly id: string;
  readonly defaults: IMapping;

  register(): ControllerTypeConstructor;
};

/** @internal */
export function registerController<T extends ControllerTypeConstructor>(controller: T): T {
  defaults.set(controller.id, controller.defaults);
  ChartNS.controllers[controller.id] = controller;
  return controller;
}

export function patchControllerConfig(config: any, controller: ControllerTypeConstructor) {
  config.type = controller.register().id;
  return config;
}

export const DatasetController: DatasetControllerTypeConstructor = ChartNS.DatasetController;
export const Element = ChartNS.Element;

export declare interface IChartHelpers {
  merge<T = IMapping>(target: any, sources: any[]): T;
  valueOrDefault<T>(value: T | undefined, defaultValue: T): T;

  options: {
    _parseFont(options: any): { string: string };
  };
}
export const helpers = ChartNS.helpers;
export const merge = (ChartNS.helpers as IChartHelpers).merge;
// export const drawPoint = ChartNS.helpers.canvas.drawPoint;
// export const resolve = ChartNS.helpers.options.resolve;
// export const color = ChartNS.helpers.color;
export const valueOrDefault = (ChartNS.helpers as IChartHelpers).valueOrDefault;
export const _parseFont = (ChartNS.helpers as IChartHelpers).options._parseFont;
// export const clipArea = ChartNS.helpers.canvas.clipArea;
// export const unclipArea = ChartNS.helpers.canvas.unclipArea;
