declare module 'chart.js' {
  export interface IChartDataSet {
    label?: string;
    data: any[];
    [key: string]: undefined | string | any[] | ((ctx: any) => any | undefined);
  }

  export interface IChartData {
    labels: any[];
    datasets: IChartDataSet[];
  }

  export class Chart {
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

  export interface IPlugin {
    readonly id: string;
    beforeUpdate?(chart: Chart): void;
    beforeDatasetsDraw?(chart: Chart): void;
    beforeEvent?(chart: Chart, event: { type: string }): void;
  }

  export const plugins: {
    register(plugin: IPlugin): void;
  };

  export type IMapping = {
    [key: string]: IMapping | number | string | boolean | null;
  };

  export const defaults: {
    set(key: string, value: IMapping): void;
    [key: string]: any;
  };

  export interface IScaleConstructor {
    readonly id: string;
    readonly defaults: IMapping;
  }

  export const scaleService: {
    registerScale(scale: IScaleConstructor): void;
    getScaleConstructor(type: string): IScaleConstructor;
  };

  export const helpers: any;
}
