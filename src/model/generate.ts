import { IArcSlice } from './interfaces';

export function generateArcSlicePath(s: IArcSlice, p = 0) {
  return `M ${s.x1 - p},${s.y1 - p} ${s.arcs
    .map(
      (arc) =>
        `A ${arc.r - p} ${arc.r - p} 0 ${arc.largeArcFlag ? 1 : 0} ${arc.sweepFlag ? 1 : 0} ${arc.x2 - p} ${arc.y2 - p}`
    )
    .join(' ')}`;
}
