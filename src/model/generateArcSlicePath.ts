import { IEllipse, ICircle, isEllipse } from './interfaces';
import type { IArcSliceProps } from '../elements';

export default function generateArcSlicePath(
  s: Pick<IArcSliceProps, 'x1' | 'y1' | 'arcs' | 'refs'> & { path?: string },
  refs: readonly (ICircle | IEllipse)[],
  p = 0
): string {
  if (s.path) {
    return s.path;
  }
  return `M ${s.x1 - p},${s.y1 - p} ${s.arcs
    .map((arc) => {
      const ref = refs[arc.ref];
      const rx = isEllipse(ref) ? ref.rx : ref.r;
      const ry = isEllipse(ref) ? ref.ry : ref.r;
      const rot = isEllipse(ref) ? ref.rotation : 0;
      return `A ${rx - p} ${ry - p} ${rot} ${arc.large ? 1 : 0} ${arc.sweep ? 1 : 0} ${arc.x2 - p} ${arc.y2 - p}`;
    })
    .join(' ')}`;
}
