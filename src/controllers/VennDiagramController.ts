import {
  Chart,
  DatasetController,
  TooltipItem,
  UpdateMode,
  ChartItem,
  ScriptableAndArrayOptions,
  ControllerDatasetOptions,
  CommonHoverOptions,
  ChartConfiguration,
  LinearScale,
  ScriptableContext,
  Scale,
  CoreChartOptions,
  CartesianScaleTypeRegistry,
} from 'chart.js';
import { ArcSlice, IArcSliceOptions } from '../elements';
import layout, { IVennDiagramLayout } from '../model/layout';
import type { IArcSlice, IBoundingBox, ICircle, IEllipse } from '../model/interfaces';
import patchController from './patchController';
import { ISet } from 'src/data';

export class VennDiagramController extends DatasetController<'venn', ArcSlice> {
  static readonly id: string = 'venn';

  /**
   * @hidden
   */
  static readonly defaults = {
    dataElementType: ArcSlice.id,
  };

  /**
   * @hidden
   */
  static readonly overrides: any = {
    plugins: {
      tooltip: {
        callbacks: {
          title() {
            // Title doesn't make sense for scatter since we format the data as a point
            return '';
          },
          label(item: TooltipItem<'venn'>) {
            const labels = item.chart.data.labels as string[];
            const d = item.chart.data.datasets?.[item.datasetIndex].data?.[item.dataIndex] as any;
            return `${labels[item.dataIndex]}: ${d ? d.values || d.value.toLocaleString() : ''}`;
          },
        },
      },
    },
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

  /**
   * @hidden
   */
  initialize(): void {
    super.initialize();
    this.enableOptionSharing = true;
  }

  /**
   * @hidden
   */
  update(mode: UpdateMode): void {
    super.update(mode);
    const meta = this._cachedMeta;
    const slices = (meta.data || []) as unknown as ArcSlice[];
    this.updateElements(slices, 0, slices.length, mode);
  }

  protected computeLayout(size: IBoundingBox): IVennDiagramLayout {
    const nSets = Math.log2(this._cachedMeta.data.length + 1);
    return layout(nSets, size);
  }

  /**
   * @hidden
   */
  updateElements(slices: ArcSlice[], start: number, count: number, mode: UpdateMode): void {
    const xScale = this._cachedMeta.xScale as Scale & { left: number; right: number };
    const yScale = this._cachedMeta.yScale as Scale & { top: number; bottom: number };

    const w = xScale.right - xScale.left;
    const h = yScale.bottom - yScale.top;

    const l = this.computeLayout({
      x: xScale.left,
      y: yScale.top,
      width: w,
      height: h,
    });
    (this._cachedMeta as any)._layout = l;
    (this._cachedMeta as any)._setLayoutFont = {
      ...(xScale as any)._resolveTickFontOptions(0),
      color: (xScale as any).options.ticks.color,
    };
    (this._cachedMeta as any)._labelLayoutFont = {
      ...(yScale as any)._resolveTickFontOptions(0),
      color: (yScale as any).options.ticks.color,
    };

    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(firstOpts) as any;
    const includeOptions = this.includeOptions(mode, sharedOptions);

    for (let i = start; i < start + count; i += 1) {
      const slice = slices[i];
      const properties: IArcSlice & { options?: IArcSliceOptions; refs: (ICircle | IEllipse)[] } = {
        refs: l.sets,
        ...l.intersections[i],
      };
      if (includeOptions) {
        properties.options = sharedOptions || (this.resolveDataElementOptions(i, mode) as unknown as IArcSliceOptions);
      }
      this.updateElement(slice, i, properties as any, mode);
    }
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
  }

  /**
   * @hidden
   */
  draw(): void {
    const meta = this._cachedMeta;
    const elements = meta.data;

    const { ctx } = this.chart;
    elements.forEach((elem) => elem.draw(ctx));

    this.drawLabels(ctx);
  }

  private drawLabels(ctx: CanvasRenderingContext2D): void {
    const meta = this._cachedMeta;

    ctx.save();

    const l = (meta as any)._layout as IVennDiagramLayout;
    const setLayoutScale = meta.xScale as LinearScale;
    const setLayoutFont = (meta as any)._setLayoutFont;
    const labelLayoutScale = meta.yScale as LinearScale;
    const labelLayoutFont = (meta as any)._labelLayoutFont;

    if (labelLayoutScale?.options.ticks.display) {
      // set labels
      ctx.font = labelLayoutFont.string;
      ctx.fillStyle = labelLayoutFont.color;
      ctx.textBaseline = 'middle';

      const labels = this.chart.data.labels as string[];
      l.sets.forEach((set, i) => {
        ctx.textAlign = set.align === 'middle' ? 'center' : set.align;
        ctx.textBaseline = set.verticalAlign;
        ctx.fillText(labels[i], set.text.x, set.text.y);
      });
    }

    if (setLayoutScale?.options.ticks.display) {
      ctx.font = setLayoutFont.string;
      ctx.fillStyle = setLayoutFont.color;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const values = (this.getDataset() as any).data as { value: number }[];
      l.intersections.forEach((intersection, i) => {
        ctx.fillText(values[i].value.toLocaleString(), intersection.text.x, intersection.text.y);
      });
    }

    ctx.restore();
  }
}

export interface IVennDiagramControllerDatasetOptions
  extends ControllerDatasetOptions,
    ScriptableAndArrayOptions<IArcSliceOptions, ScriptableContext<'venn'>>,
    ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'venn'>> {}

declare module 'chart.js' {
  interface ChartTypeRegistry {
    venn: {
      chartOptions: CoreChartOptions<'venn'>;
      datasetOptions: IVennDiagramControllerDatasetOptions;
      defaultDataPoint: number | ISet<number>;
      metaExtensions: Record<string, never>;
      parsedDataType: { x: number; y: number };
      scales: keyof CartesianScaleTypeRegistry;
    };
  }
}

export class VennDiagramChart<DATA extends unknown[] = number[], LABEL = string> extends Chart<'venn', DATA, LABEL> {
  static id = VennDiagramController.id as 'venn';

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'venn', DATA, LABEL>, 'type'>) {
    super(item, patchController('venn', config, VennDiagramController, ArcSlice, [LinearScale]));
  }
}
