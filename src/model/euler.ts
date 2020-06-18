import { layout, ICircle, IPoint } from '@upsetjs/venn.js';
import { IVennDiagramLayout, IChartArea } from './layout';
import { pointAtCircle } from './math';

export function center(circles: readonly ICircle[]) {
  const sumX = circles.reduce((acc, a) => acc + a.x, 0);
  const sumY = circles.reduce((acc, a) => acc + a.y, 0);
  return {
    x: sumX / circles.length,
    y: sumY / circles.length,
  };
}

function angleAtCircle(p: IPoint, c: IPoint) {
  const x = p.x - c.x;
  const y = p.y - c.y;
  return (Math.atan2(y, x) / Math.PI) * 180;
}

export default function euler(
  sets: readonly { sets: readonly string[]; value: number }[],
  size: IChartArea
): IVennDiagramLayout {
  const r = layout(
    sets.map((s) => ({ sets: s.sets, size: s.value })),
    {
      width: size.w,
      height: size.h,
    }
  );
  const singleSets = r.filter((d) => d.data.sets.length === 1);
  const eulerCenter = center(singleSets.map((d) => d.circles[0]));

  return {
    sets: singleSets.map((d) => {
      const c = d.circles[0];
      const angle = angleAtCircle(c, eulerCenter);
      return {
        cx: c.x + size.x,
        cy: c.y + size.y,
        r: c.radius,
        angle: angle + 90,
        text: pointAtCircle(c.x + size.x, c.y + size.y, c.radius * 1.1, angle),
      };
    }),
    intersections: r.map((d) => {
      const arcs = d.arcs;
      const text = {
        x: d.text.x + size.x,
        y: d.text.y + size.y,
      };
      if (arcs.length === 0) {
        return {
          text,
          x1: 0,
          y1: 0,
          arcs: [],
        };
      }
      if (arcs.length === 1) {
        const c = arcs[0].circle;
        return {
          text,
          x1: c.x + size.x,
          y1: c.y - c.radius + size.y,
          arcs: [
            {
              cx: c.x + size.x,
              cy: c.y + size.y,
              r: c.radius,
              x2: c.x + size.x,
              y2: c.y + c.radius + size.y,
              largeArcFlag: false,
              sweepFlag: false,
              mode: 'inside',
            },
            {
              cx: c.x + size.x,
              cy: c.y + size.y,
              r: c.radius,
              x2: c.x + size.x,
              y2: c.y - c.radius + size.y,
              largeArcFlag: false,
              sweepFlag: false,
              mode: 'inside',
            },
          ],
        };
      }
      return {
        text,
        x1: d.arcs[0].p2.x + size.x,
        y1: d.arcs[0].p2.y + size.y,
        arcs: d.arcs.map((a) => ({
          r: a.circle.radius,
          x2: a.p1.x + size.x,
          y2: a.p1.y + size.y,
          cx: a.circle.x + size.x,
          cy: a.circle.y + size.y,
          sweepFlag: true,
          largeArcFlag: a.width > a.circle.radius,
          mode: 'inside',
        })),
      };
    }),
  };
}
