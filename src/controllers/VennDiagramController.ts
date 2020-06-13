import { Chart, DatasetController, registerController, patchControllerConfig, BarController } from '../chart';
import { ArcSlice, IArcSliceOptions } from '../elements';
import { IMapping } from 'chart.js';
import layout from '../model/layout';
import { IArcSlice } from '../model/interfaces';

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
    p.dataElementOptions = BarController.prototype.dataElementOptions;
    return registerController(VennDiagramController);
  }

  update(mode?: 'reset' | 'normal') {
    super.update(mode);
    const meta = this._cachedMeta;
    const slices = ((meta.data || []) as unknown) as ArcSlice[];
    this.updateElements(slices, 0, mode);
  }

  updateElements(slices: ArcSlice[], start: number, mode?: 'reset' | 'normal') {
    // const meta = this._cachedMeta;
    // const reset = mode === 'reset';

    const xScale = this._cachedMeta.xScale as { left: number; right: number };
    const yScale = this._cachedMeta.yScale as { top: number; bottom: number };

    const w = xScale.right - xScale.left;
    const h = yScale.bottom - yScale.top;
    const nSets = Math.log2(slices.length + 1);
    const l = layout(nSets, {
      x: xScale.left,
      y: yScale.top,
      w,
      h,
      cx: w / 2 + xScale.left,
      cy: h / 2 + yScale.top,
      r: Math.min(w, h) / 2,
    });

    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(mode || 'normal', slices[start], firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions);

    // const xScale = meta.xScale;
    // const yScale = meta.yScale;

    // const basePoint = {
    //   x: xScale.getBasePixel(),
    //   y: yScale.getBasePixel(),
    // };

    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      const index = start + i;
      // const parsed = this.getParsed(index);

      const properties: IArcSlice & { options?: IArcSliceOptions } = Object.assign(
        {
          label: 'A',
        },
        l.intersections[i]
      );
      if (includeOptions) {
        properties.options = (this.resolveDataElementOptions(index, mode) as unknown) as IArcSliceOptions;
      }
      this.updateElement(slice, index, (properties as unknown) as IMapping, mode);
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
