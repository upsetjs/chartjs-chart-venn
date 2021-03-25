import venn0 from './data/venn0.json';
import venn1 from './data/venn1.json';
import venn2 from './data/venn2.json';
import venn3 from './data/venn3.json';
import venn4 from './data/venn4.json';
import venn5 from './data/venn5.json';
import { ITextEllipse, ITextArcSlice, ITextCircle, isEllipse, IBoundingBox } from './interfaces';

// could be slice of three

export interface IVennDiagramLayout {
  sets: (ITextCircle | ITextEllipse)[];
  intersections: ITextArcSlice[];
}

interface ILayout {
  sets: (ITextCircle | ITextEllipse)[];
  intersections: ITextArcSlice[];
  bb: IBoundingBox;
}

export default function layout(sets: number, bb: IBoundingBox): IVennDiagramLayout {
  const lookup = [venn0, venn1, venn2, venn3, venn4, venn5];
  const r = lookup[Math.min(lookup.length - 1, sets)] as ILayout;
  const f = Math.min(bb.width / r.bb.width, bb.height / r.bb.height);
  const x = f * -r.bb.x + (bb.width - f * r.bb.width) / 2 + bb.x;
  const y = f * -r.bb.y + (bb.height - f * r.bb.height) / 2 + bb.y;
  const mx = (v: number) => x + f * v;
  const my = (v: number) => y + f * v;

  return {
    sets: r.sets.map((c) => ({
      ...c,
      cx: mx(c.cx),
      cy: my(c.cy),
      text: {
        x: mx(c.text.x),
        y: my(c.text.y),
      },
      ...(isEllipse(c)
        ? {
            rx: c.rx * f,
            ry: c.ry * f,
          }
        : {
            r: c.r * f,
          }),
    })),
    intersections: r.intersections.map((c) => ({
      text: {
        x: mx(c.text.x),
        y: my(c.text.y),
      },
      x1: mx(c.x1),
      y1: my(c.y1),
      sets: c.sets,
      arcs: c.arcs.map((a) => ({ ...a, x2: mx(a.x2), y2: my(a.y2) })),
    })),
  };
}
