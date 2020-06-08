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
    constructor(item: CanvasRenderingContext2D | string | HTMLCanvasElement, config: any);

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

  export const controllers: any;

  export class DatasetController {}
  export class Element {}

  export type IMapping = {
    [key: string]: IMapping | number | string | boolean | null;
  };

  export const defaults: {
    set(key: string, value: IMapping): void;
    [key: string]: any;
  };

  export const helpers: any;
}
