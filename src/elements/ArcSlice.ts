import { Element, Rectangle, IVisualElement } from '@sgratzl/chartjs-esm-facade';
import { ITextArcSlice, ICircle, IEllipse, isEllipse } from '../model/interfaces';
import { generateArcSlicePath } from '../model/generate';
import { dist, DEG2RAD } from '../model/math';

export interface IArcSliceOptions {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface IArcSliceProps extends ITextArcSlice {
  options?: IArcSliceOptions;
  refs: (ICircle | IEllipse)[];
}

export class ArcSlice extends Element<IArcSliceProps, IArcSliceOptions> implements IVisualElement {
  static readonly id = 'arcSlice';
  static readonly defaults = /* #__PURE__ */ Object.assign({}, Rectangle.defaults, {
    backgroundColor: '#efefef',
  });

  inRange(mouseX: number, mouseY: number) {
    const props = this.getProps(['arcs', 'refs', 'sets']);

    const usedSets = new Set(props.sets);

    function checkRef(p: { cx: number; cy: number }, ref: IEllipse | ICircle, inside: boolean) {
      if (isEllipse(ref)) {
        //(x−a)2 + (y−b)2 = r2
        const a = ref.rotation * DEG2RAD;
        const x = p.cx - ref.cx;
        const y = p.cy - ref.cy;
        const d =
          (x * Math.cos(a) + y * Math.sin(a)) ** 2 / ref.rx ** 2 +
          (x * Math.sin(a) - y * Math.cos(a)) ** 2 / ref.ry ** 2;
        if ((inside && d > 1) || (!inside && d < 1)) {
          return false;
        }
      } else {
        //(x−a)2 + (y−b)2 = r2
        const d = dist(p, ref);
        if ((inside && d > ref.r) || (!inside && d < ref.r)) {
          return false;
        }
      }
      return true;
    }

    for (let i = 0; i < props.arcs!.length; i++) {
      const arc = props.arcs[i];
      const ref = props.refs[arc.ref];
      const p = {
        cx: Number.isNaN(mouseX) ? ref.cx : mouseX,
        cy: Number.isNaN(mouseY) ? ref.cy : mouseY,
      };

      usedSets.delete(arc.ref);

      if (!checkRef(p, ref, arc.mode === 'i')) {
        return false;
      }
    }

    const remaining = Array.from(usedSets);
    for (let i = 0; i < remaining.length; i++) {
      const ref = props.refs[remaining[i]];
      const p = {
        cx: Number.isNaN(mouseX) ? ref.cx : mouseX,
        cy: Number.isNaN(mouseY) ? ref.cy : mouseY,
      };

      if (!checkRef(p, ref, true)) {
        return false;
      }
    }
    return true;
  }

  inXRange(mouseX: number) {
    return this.inRange(mouseX, Number.NaN);
  }

  inYRange(mouseY: number) {
    return this.inRange(Number.NaN, mouseY);
  }

  getCenterPoint() {
    const arc = this.getProps(['text']);
    return arc.text;
  }

  tooltipPosition() {
    return this.getCenterPoint();
  }

  hasValue() {
    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const options = (this.options as unknown) as IArcSliceOptions;
    const props = this.getProps(['x1', 'y1', 'arcs', 'refs']);

    ctx.beginPath();
    const path = new Path2D(generateArcSlicePath(props, props.refs));

    if (options.backgroundColor) {
      ctx.fillStyle = options.backgroundColor;
      ctx.fill(path);
    }
    if (options.borderColor) {
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      ctx.stroke(path);
    }

    ctx.restore();
  }
}
