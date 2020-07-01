import { defaults, Element, registerElement } from '../chart';
import { ITextArcSlice, ICircle, IEllipse } from '../model/interfaces';
import { generateArcSlicePath } from '../model/generate';
import { dist } from '../model/math';

export interface IArcSliceOptions {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface IArcSliceProps extends ITextArcSlice {
  options?: IArcSliceOptions;
  refs: (ICircle | IEllipse)[];
}

export class ArcSlice extends Element {
  static readonly id = 'arcSlice';
  static readonly _type = 'arcSlice';
  static readonly defaults = /* #__PURE__ */ Object.assign({}, defaults.elements.rectangle, {
    backgroundColor: '#efefef',
  });

  static register() {
    return registerElement(ArcSlice);
  }

  inRange(mouseX: number, mouseY: number) {
    const props = this.getProps<IArcSliceProps>(['arcs', 'refs']);

    for (let i = 0; i < props.arcs.length; i++) {
      const arc = props.arcs[i];
      const ref = props.refs[arc.ref];
      const p = {
        cx: Number.isNaN(mouseX) ? ref.cx : mouseX,
        cy: Number.isNaN(mouseY) ? ref.cy : mouseY,
      };

      // TODO
      const d = dist(p, ref) - (ref as ICircle).r;
      if ((arc.mode === 'i' && d > 0) || (arc.mode === 'o' && d < 0)) {
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
    const arc = this.getProps<ITextArcSlice>(['text']);
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
    const props = this.getProps<IArcSliceProps>(['x1', 'y1', 'arcs', 'refs']);

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
