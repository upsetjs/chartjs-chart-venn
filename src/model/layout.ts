import { circleIntersectionPoints, DEG2RAD, pointAtCircle } from './math';
import { IArc, ITextArcSlice, ITextCircle } from './interfaces';

// could be slice of three

export interface IVennDiagramLayout {
  sets: ITextCircle[];
  intersections: ITextArcSlice[];
}

export interface IChartArea {
  x: number;
  y: number;
  cx: number;
  cy: number;
  w: number;
  h: number;
  r: number;
}

function one(size: IChartArea): IVennDiagramLayout {
  const p0 = {
    cx: size.cx,
    cy: size.cy - size.r,
  };
  const p1 = {
    cx: size.cx,
    cy: size.cy + size.r,
  };
  return {
    sets: [
      {
        r: size.r,
        cx: size.cx,
        cy: size.cy,
        angle: 180,
        text: pointAtCircle(size.cx, size.cy, size.r * 1.1, 120 - 90),
      },
    ],
    intersections: [
      {
        x1: p0.cx,
        y1: p0.cy,
        text: {
          x: size.cx,
          y: size.cy,
        },
        arcs: [arc(size, 'inside', p1, size.r), arc(size, 'inside', p0, size.r)],
      },
    ],
  };
}

function arc(
  center: { cx: number; cy: number },
  mode: 'inside' | 'outside',
  p1: { cx: number; cy: number },
  r: number,
  largeArcFlag = false,
  sweepFlag = false
): IArc {
  return {
    r,
    largeArcFlag,
    sweepFlag,
    x2: p1.cx,
    y2: p1.cy,
    cx: center.cx,
    cy: center.cy,
    mode,
  };
}

export function computeCenter(arcs: IArc[]) {
  const sumX = arcs.reduce((acc, a) => acc + a.x2, 0);
  const sumY = arcs.reduce((acc, a) => acc + a.y2, 0);
  return {
    cx: sumX / arcs.length,
    cy: sumY / arcs.length,
  };
}

function arcCenter(p1: { cx: number; cy: number }, arcs: IArc[]): ITextArcSlice {
  const center = computeCenter(arcs);
  return {
    x1: p1.cx,
    y1: p1.cy,
    arcs,
    text: {
      x: center.cx,
      y: center.cy,
    },
  };
}

function two(size: IChartArea, radiOverlap: number): IVennDiagramLayout {
  // 0.5 radi overlap
  // 3.5 x 2 radi box
  const r = Math.floor(Math.min(size.h / 2, size.w / (4 - radiOverlap)));

  const c0x = size.cx - r * (1 - radiOverlap);
  const c0: ITextCircle = {
    r,
    cx: c0x,
    cy: size.cy,
    angle: 270,
    text: pointAtCircle(c0x, size.cy, r * 1.1, 300 - 90),
  };

  const c1x = size.cx + r * (1 - radiOverlap);
  const c1: ITextCircle = {
    r,
    cx: c1x,
    cy: size.cy,
    angle: 90,
    text: pointAtCircle(c1x, size.cy, r * 1.1, 60 - 90),
  };
  const [p0, p1] = circleIntersectionPoints(c0, c1);
  return {
    sets: [c0, c1],
    intersections: [
      {
        x1: p0.cx,
        y1: p0.cy,
        arcs: [arc(c0, 'inside', p1, r, false, true), arc(c1, 'outside', p0, r, true)],
        text: {
          x: c0x,
          y: size.cy,
        },
      },
      {
        x1: p0.cx,
        y1: p0.cy,
        arcs: [arc(c1, 'inside', p1, r, true, false), arc(c0, 'outside', p0, r, false, true)],
        text: {
          x: c1x,
          y: size.cy,
        },
      },
      arcCenter(p0, [arc(c0, 'inside', p1, r), arc(c1, 'inside', p0, r)]),
    ],
  };
}

function three(size: IChartArea, radiOverlap: number): IVennDiagramLayout {
  // 3.5 x 2 radi box
  // r + r * (2 - o) * cos(60) + r
  // r (1 + (2- o) * cos(60) + 1)
  const factor = 1 + (2 - radiOverlap * 2) * Math.cos(30 * DEG2RAD) + 1;
  const r = Math.floor(Math.min(size.h / factor, size.w / factor));

  const cx = size.cx;
  const a = r * (2 - radiOverlap * 2);
  const outerRadius = a / Math.sqrt(3);
  const cy = size.y + size.h - r - outerRadius; // outer circle

  const offset = outerRadius;

  const c0x = cx + offset * Math.cos(-90 * DEG2RAD);
  const c0y = cy - offset * Math.sin(-90 * DEG2RAD);
  const c0: ITextCircle = {
    r,
    cx: c0x,
    cy: c0y,
    angle: 180,
    text: pointAtCircle(c0x, c0y, r * 1.1, 120 - 90),
  };

  const c1x = cx - offset * Math.cos(30 * DEG2RAD);
  const c1y = cy - offset * Math.sin(30 * DEG2RAD);
  const c1: ITextCircle = {
    r,
    cx: c1x,
    cy: c1y,
    angle: 300,
    text: pointAtCircle(c1x, c1y, r * 1.1, 300 - 90),
  };

  const c2x = cx - offset * Math.cos(150 * DEG2RAD);
  const c2y = cy - offset * Math.sin(150 * DEG2RAD);
  const c2: ITextCircle = {
    r,
    cx: c2x,
    cy: c2y,
    angle: 60,
    text: pointAtCircle(c2x, c2y, r * 1.1, 60 - 90),
  };

  const [p12_0, p12_1] = circleIntersectionPoints(c1, c2);
  const [p20_0, p20_1] = circleIntersectionPoints(c2, c0);
  const [p01_0, p01_1] = circleIntersectionPoints(c0, c1);

  return {
    sets: [c0, c1, c2],
    intersections: [
      {
        x1: p01_1.cx,
        y1: p01_1.cy,
        arcs: [arc(c1, 'outside', p12_0, r), arc(c2, 'outside', p20_1, r), arc(c0, 'inside', p01_1, r, true, true)],
        text: {
          x: c0x,
          y: c0y,
        },
      },
      {
        x1: p12_1.cx,
        y1: p12_1.cy,
        arcs: [arc(c2, 'outside', p20_0, r), arc(c0, 'outside', p01_1, r), arc(c1, 'inside', p12_1, r, true, true)],
        text: {
          x: c1x,
          y: c1y,
        },
      },
      {
        x1: p20_1.cx,
        y1: p20_1.cy,
        arcs: [arc(c0, 'outside', p01_0, r), arc(c1, 'outside', p12_1, r), arc(c2, 'inside', p20_1, r, true, true)],
        text: {
          x: c2x,
          y: c2y,
        },
      },
      arcCenter(p20_0, [
        arc(c0, 'inside', p01_1, r),
        arc(c1, 'inside', p12_0, r),
        arc(c2, 'outside', p20_0, r, false, true),
      ]),
      arcCenter(p12_0, [
        arc(c2, 'inside', p20_1, r),
        arc(c0, 'inside', p01_0, r),
        arc(c1, 'outside', p12_0, r, false, true),
      ]),
      arcCenter(p01_0, [
        arc(c1, 'inside', p12_1, r),
        arc(c2, 'inside', p20_0, r),
        arc(c0, 'outside', p01_0, r, false, true),
      ]),
      arcCenter(p12_0, [
        arc(c2, 'inside', p20_0, r, false, true),
        arc(c0, 'inside', p01_0, r, false, true),
        arc(c1, 'inside', p12_0, r, false, true),
      ]),
    ],
  };
}

export default function vennDiagramLayout(sets: number, size: IChartArea, radiOverlap = 0.25): IVennDiagramLayout {
  switch (sets) {
    case 0:
      return {
        sets: [],
        intersections: [],
      };
    case 1:
      return one(size);
    case 2:
      return two(size, radiOverlap);
    default:
      return three(size, radiOverlap);
  }
}
