import { Chart, DatasetController, registerController, patchControllerConfig, BarController } from '../chart';
import { ArcSlice, IArcSliceOptions } from '../elements';
import layout, { IVennDiagramLayout, IChartArea } from '../model/layout';
import { IArcSlice } from '../model/interfaces';
import { ISet } from '../data';

export class VennDiagramController extends DatasetController {
  static readonly id: string = 'venn';

  static readonly defaults = {
    tooltips: {
      callbacks: {
        title() {
          // Title doesn't make sense for scatter since we format the data as a point
          return '';
        },
        label(
          item: { index: number; values: any[]; datasetIndex: number },
          data: { labels: string[]; datasets: { data: ISet<any>[] }[] }
        ) {
          const d = data.datasets[item.datasetIndex].data[item.index];
          return `${data.labels[item.index]}: ${d.values || d.value.toLocaleString()}`;
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

  static register() {
    const p = VennDiagramController.prototype as any;
    p.dataElementType = ArcSlice.register();
    p.dataElementOptions = BarController.prototype.dataElementOptions;
    return registerController(VennDiagramController);
  }

  update(mode?: 'reset' | 'normal') {
    super.update(mode);
    const meta = this._cachedMeta;
    const slices = ((meta.data || []) as unknown) as ArcSlice[];
    this.updateElements(slices, 0, mode);
  }

  protected computeLayout(size: IChartArea): IVennDiagramLayout {
    const nSets = Math.log2(this._cachedMeta.data.length + 1);
    return layout(nSets, size);
  }

  updateElements(slices: ArcSlice[], start: number, mode?: 'reset' | 'normal') {
    const xScale = this._cachedMeta.xScale as { left: number; right: number };
    const yScale = this._cachedMeta.yScale as { top: number; bottom: number };

    const w = xScale.right - xScale.left;
    const h = yScale.bottom - yScale.top;

    const l = this.computeLayout({
      x: xScale.left,
      y: yScale.top,
      w,
      h,
      cx: w / 2 + xScale.left,
      cy: h / 2 + yScale.top,
      r: Math.min(w, h) / 2,
    });
    (this._cachedMeta as any)._layout = l;
    (this._cachedMeta as any)._layoutFont = (xScale as any)._resolveTickFontOptions(0);

    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(mode || 'normal', slices[start], firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions);

    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      const index = start + i;
      const properties: IArcSlice & { options?: IArcSliceOptions } = Object.assign({}, l.intersections[index]);
      if (includeOptions) {
        properties.options = (this.resolveDataElementOptions(index, mode) as unknown) as IArcSliceOptions;
      }
      this.updateElement(slice, index, properties as any, mode);
    }
    this.updateSharedOptions(sharedOptions, mode);
  }

  draw() {
    const meta = this._cachedMeta;
    const elements = ((meta.data || []) as unknown) as ArcSlice[];

    const ctx = this._ctx;
    elements.forEach((elem) => elem.draw(ctx));

    ctx.save();

    const l = (meta as any)._layout as IVennDiagramLayout;
    const font = (meta as any)._layoutFont;
    ctx.textBaseline = 'middle';
    ctx.font = font.string;
    ctx.fillStyle = font.color;
    ctx.textBaseline = 'middle';
    const labels = (this as any)._labels as string[];
    l.sets.forEach((set, i) => {
      ctx.textAlign = set.angle > 200 ? 'right' : set.angle < 200 ? 'left' : 'center';
      ctx.fillText(labels[i], set.text.x, set.text.y);
    });
    ctx.textAlign = 'center';
    const values = (this as any).getDataset().data as { value: number }[];
    l.intersections.forEach((l, i) => {
      ctx.fillText(values[i].value.toLocaleString(), l.text.x, l.text.y);
    });

    ctx.restore();
  }
}

export class VennDiagramChart extends Chart {
  static readonly id = VennDiagramController.id;

  constructor(item: any, config: any) {
    super(item, patchControllerConfig(config, VennDiagramController));
  }
}
