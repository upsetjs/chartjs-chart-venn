import {
  Element,
  BarElement,
  VisualElement,
  CommonElementOptions,
  ScriptableAndArrayOptions,
  ChartType,
  CommonHoverOptions,
  ScriptableContext,
} from 'chart.js';
import { ITextArcSlice, ICircle, IEllipse, isEllipse } from '../model/interfaces';
import generateArcSlicePath from '../model/generateArcSlicePath';
import { dist, DEG2RAD } from '../model/math';

export interface IArcSliceOptions extends CommonElementOptions, Record<string, unknown> {}

export interface IArcSliceProps extends ITextArcSlice {
  refs: (ICircle | IEllipse)[];
}

export class ArcSlice extends Element<IArcSliceProps, IArcSliceOptions> implements VisualElement {
  static readonly id = 'arcSlice';

  /**
   * @hidden
   */
  static readonly defaults = /* #__PURE__ */ { ...BarElement.defaults, backgroundColor: '#efefef' };

  /**
   * @hidden
   */
  static readonly defaultRoutes = /* #__PURE__ */ {
    borderColor: 'borderColor',
  };

  /**
   * @hidden
   */
  inRange(mouseX: number, mouseY: number): boolean {
    const props = this.getProps(['arcs', 'refs', 'sets']);

    const usedSets = new Set(props.sets);

    function checkRef(p: { cx: number; cy: number }, ref: IEllipse | ICircle, inside: boolean) {
      if (isEllipse(ref)) {
        // (x−a)2 + (y−b)2 = r2
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
        // (x−a)2 + (y−b)2 = r2
        const d = dist(p, ref);
        if ((inside && d > ref.r) || (!inside && d < ref.r)) {
          return false;
        }
      }
      return true;
    }

    for (const arc of props.arcs ?? []) {
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
    for (let i = 0; i < remaining.length; i += 1) {
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

  /**
   * @hidden
   */
  inXRange(mouseX: number): boolean {
    return this.inRange(mouseX, Number.NaN);
  }

  /**
   * @hidden
   */
  inYRange(mouseY: number): boolean {
    return this.inRange(Number.NaN, mouseY);
  }

  /**
   * @hidden
   */
  getCenterPoint(): { x: number; y: number } {
    const arc = this.getProps(['text']);
    return arc.text;
  }

  /**
   * @hidden
   */
  tooltipPosition(): { x: number; y: number } {
    return this.getCenterPoint();
  }

  /**
   * @hidden
   */

  hasValue(): boolean {
    return true;
  }

  /**
   * @hidden
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const options = this.options as unknown as IArcSliceOptions;
    const props = this.getProps(['x1', 'y1', 'arcs', 'refs']);

    ctx.beginPath();
    let path: Path2D | undefined;
    if (window.Path2D) {
      path = new Path2D(generateArcSlicePath(props, props.refs));
    } else {
      // try old school
      // M ${s.x1 - p},${s.y1 - p} ${s.arcs
      //   .map((arc) => {
      //     return `A ${rx - p} ${ry - p} ${rot} ${arc.large ? 1 : 0} ${arc.sweep ? 1 : 0} ${arc.x2 - p} ${arc.y2 - p}`;
      //   }
      ctx.beginPath();
      ctx.moveTo(props.x1, props.y1);
      for (const arc of props.arcs) {
        const ref = props.refs[arc.ref];
        const rx = isEllipse(ref) ? ref.rx : ref.r;
        const ry = isEllipse(ref) ? ref.ry : ref.r;
        const rot = isEllipse(ref) ? ref.rotation : 0;
        // no proper angle rotation
        ctx.ellipse(ref.cx, ref.cy, rx, ry, rot, 0, Math.PI * 2, !arc.sweep);
      }
      ctx.closePath();
    }

    if (options.backgroundColor) {
      ctx.fillStyle = options.backgroundColor;
      if (path) {
        ctx.fill(path);
      } else {
        ctx.fill();
      }
    }
    if (options.borderColor) {
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      if (path) {
        ctx.stroke(path);
      } else {
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

declare module 'chart.js' {
  export interface ElementOptionsByType<TType extends ChartType> {
    arcSlice: ScriptableAndArrayOptions<IArcSliceOptions & CommonHoverOptions, ScriptableContext<TType>>;
  }
}
