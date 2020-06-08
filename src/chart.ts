import ChartNS, { IScaleConstructor, IPlugin } from 'chart.js';

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

export const Chart = ChartNS;

/** @internal */
export function registerPlugin<T extends IPlugin>(plugin: T): T {
  ChartNS.plugins.register(plugin);
  return plugin;
}
/** @internal */
export const defaults = ChartNS.defaults;
/** @internal */
export function registerScale<T extends IScaleConstructor>(scale: T): T {
  ChartNS.scaleService.registerScale(scale);
  return scale;
}

export declare class ScaleType<T> {
  type: string;
  chart: CoreChart;
  isHorizontal(): boolean;
  determineDataLimits(): void;
  getLabels(): (string | any)[];

  left: number;
  top: number;
  width: number;
  height: number;
  min: number;
  max: number;
  _startPixel: number;
  _length: number;

  buildTicks(): { label: string; value: string }[];
  configure(): void;

  options: T;

  getPixelForDecimal(value: number): number;
  getValueForPixel(pixel: number): number;
}

export declare class CategoryScaleType<T> extends ScaleType<T> {
  _numLabels: number;
  _valueRange: number;
  _startValue: number;
}

export interface CategoryScaleTypeConstructor {
  new <T>(): CategoryScaleType<T>;

  readonly id: string;
  readonly defaults: IMapping;
}

// export const Scale = ChartNS.Scale;
// export const LinearScale = ChartNS.scaleService.getScaleConstructor('linear');
// export const LogarithmicScale = ChartNS.scaleService.getScaleConstructor('logarithmic');
export const CategoryScale = ChartNS.scaleService.getScaleConstructor('category') as CategoryScaleTypeConstructor;

// export const DatasetController = ChartNS.DatasetController;
// export const BarController = controllers.bar;
// export const BubbleController = controllers.bubble;
// export const HorizontalBarController = controllers.horizontalBar;
// export const LineController = controllers.line;
// export const PolarAreaController = controllers.polarArea;
// export const ScatterController = controllers.scatter;

// export const Element = ChartNS.Element;
// export const Rectangle = ChartNS.elements.Rectangle;
// export const Point = ChartNS.elements.Point;
// export const Line = ChartNS.elements.Line;
// export const Arc = ChartNS.elements.Arc;

export declare interface IChartHelpers {
  merge<T = IMapping>(target: any, sources: any[]): T;
  valueOrDefault<T>(value: T | undefined, defaultValue: T): T;

  options: {
    _parseFont(options: any): { string: string };
  };
}
export const merge = (ChartNS.helpers as IChartHelpers).merge;
// export const drawPoint = ChartNS.helpers.canvas.drawPoint;
// export const resolve = ChartNS.helpers.options.resolve;
// export const color = ChartNS.helpers.color;
export const valueOrDefault = (ChartNS.helpers as IChartHelpers).valueOrDefault;
export const _parseFont = (ChartNS.helpers as IChartHelpers).options._parseFont;
// export const clipArea = ChartNS.helpers.canvas.clipArea;
// export const unclipArea = ChartNS.helpers.canvas.unclipArea;
