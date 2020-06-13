import { defaults, Element, registerElement } from '../chart';
import { IArcSlice, ITextArcSlice } from '../model/interfaces';
import { generateArcSlicePath } from '../model/generate';

export interface IArcSliceOptions {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export class ArcSlice extends Element {
  static readonly id = 'arcSlice';
  static readonly _type = 'arcSlice';
  static readonly defaults = /* #__PURE__ */ Object.assign({}, defaults.elements.rectangle);

  static register() {
    return registerElement(ArcSlice);
  }

  inRange(mouseX: number, mouseY: number) {
    // const bb = this.getBounds();
    // const r =
    //   (Number.isNaN(mouseX) || (mouseX >= bb.x && mouseX <= bb.x2)) &&
    //   (Number.isNaN(mouseY) || (mouseY >= bb.y && mouseY <= bb.y2));

    // const projection = this.projectionScale.geoPath.projection();
    // if (r && !Number.isNaN(mouseX) && !Number.isNaN(mouseY) && typeof projection.invert === 'function') {
    //   // test for real if within the bounds
    //   const longlat = projection.invert([mouseX, mouseY]);
    //   return longlat && geoContains(this.feature, longlat);
    // }

    // return r;
    return false; // TODO
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
