import { defaults, Element, registerElement } from '../chart';
import { IArcSlice, ITextArcSlice } from '../model/interfaces';
import { generateArcSlicePath } from '../model/generate';
import { dist } from '../model/math';

export interface IArcSliceOptions {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export class ArcSlice extends Element {
  static readonly id = 'arcSlice';
  static readonly _type = 'arcSlice';
  static readonly defaults = /* #__PURE__ */ Object.assign({}, defaults.elements.rectangle, {
    backgroundColor: 'lightgray',
  });

  static register() {
    return registerElement(ArcSlice);
  }

  inRange(mouseX: number, mouseY: number) {
    const props = this.getProps<IArcSlice>(['arcs']);

    for (let i = 0; i < props.arcs.length; i++) {
      const arc = props.arcs[i];
      const p = {
        cx: Number.isNaN(mouseX) ? arc.cx : mouseX,
        cy: Number.isNaN(mouseY) ? arc.cy : mouseY,
      };

      const d = dist(p, arc) - arc.r;
      if ((arc.mode === 'inside' && d > 0) || (arc.mode === 'outside' && d < 0)) {
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const options = (this.options as unknown) as IArcSliceOptions;
    const props = this.getProps<IArcSlice>(['x1', 'y1', 'arcs']);

    ctx.beginPath();
    const path = new Path2D(generateArcSlicePath(props));

    if (options.backgroundColor) {
      ctx.fillStyle = options.backgroundColor;
      ctx.fill(path);
    }
    if (options.borderColor) {
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      ctx.stroke(path);
    }

    // TODO render label

    ctx.restore();
  }
}
