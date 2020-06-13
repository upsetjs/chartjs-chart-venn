import { Chart, DatasetController, registerController, patchControllerConfig, defaults } from '../chart';
import { ArcSlice } from '../elements';
import { IMapping } from 'chart.js';
import layout from '../model/layout';

export class VennDiagramController extends DatasetController {
  static readonly id = 'venn';

  static readonly defaults = {
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
    p.dataElementOptions = defaults.bar.prototype.dataElementOptions;
    return registerController(VennDiagramController);
  }

  update(mode?: 'reset' | 'normal') {
    super.update(mode);
    const meta = this._cachedMeta;
    const slices = ((meta.data || []) as unknown) as ArcSlice[];
    this.updateElements(slices, 0, mode);
  }

  updateElements(slices: ArcSlice[], start: number, mode?: 'reset' | 'normal') {
    const meta = this._cachedMeta;
    const reset = mode === 'reset';

    const area = this.chart.chartArea;
    const w = area.right - area.left;
    const h = area.bottom - area.top;
    const l = layout(slices.length, {
      w,
      h,
      cx: w / 2 + area.left,
      cy: h / 2 + area.top,
      r: Math.min(w, h) / 2,
    });

    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(mode || 'normal', slices[start], firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions);

    const xScale = meta.xScale;
    const yScale = meta.yScale;

    const basePoint = {
      x: xScale.getBasePixel(),
      y: yScale.getBasePixel(),
    };

    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      const index = start + i;
      const parsed = this.getParsed(index);

      const properties: IMapping = {};
      if (includeOptions) {
        properties.options = this.resolveDataElementOptions(index, mode);
      }
      this.updateElement(slice, index, properties, mode);
    }
    this.updateSharedOptions(sharedOptions, mode);
  }

  draw() {
    const meta = this._cachedMeta;
    const elements = ((meta.data || []) as unknown) as ArcSlice[];

    const ctx = this._ctx;
    elements.forEach((elem) => elem.draw(ctx));
  }
}

export class VennDiagramsChart extends Chart {
  static readonly id = VennDiagramController.id;

  constructor(item: any, config: any) {
    super(item, patchControllerConfig(config, VennDiagramController));
  }
}
