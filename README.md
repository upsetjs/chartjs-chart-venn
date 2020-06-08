# Chart.js Venn Diagram Chart

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

Chart.js module for charting venn diagrams. Adding new chart type: `venn`.

**Works only with Chart.js >= 3.0.0**

## Install

```bash
npm install --save chart.js@next chartjs-chart-venn@next
```

## Usage

see [Samples](https://github.com/sgratzl/chartjs-chart-venn/tree/master/samples) on Github

or at this [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/TODO)

## PCP

### Data Structure

the data items are the regular data items along with their labels. For each attribute there is an dataset. e.g., in the following example there are three items (A, B, C) with three axes / features (f1, f2, f3).

```js
const objs = [
  { label: 'A', f1: 5, f2: 3, f4: 3 },
  { label: 'B', f1: 2, f2: 1, f4: 8 },
  { label: 'C', f1: 10, f2: 6, f4: 2 },
];
const attrs = ['f1', 'f2', 'f3'];
const config = {
  type: 'pcp',
  data: {
    labels: objs.map((obj) => obj.label),
    datasets: attrs.map((attr) => ({
      label: attr,
      data: objs.map((obj) => obj[attr]),
    })),
  },
  options: {},
};
```

### Styling of elements

Two new elements were added: `lineSegment` as a subclass of line for a line segment between two axes and `linearAxis` for representing the vertical axis as a wrapper around a linear scale.

```ts
interface ILineSegmentOptions {
  // all options from
  // https://www.chartjs.org/docs/latest/charts/line.html#line-styling

  /**
   * line tension > 0 (e.g., 0.3) to create bezier curves
   * @default 0
   */
  tension: number;
}
```

```ts
interface ILinearAxisOptions {
  // all options from
  // https://www.chartjs.org/docs/latest/axes/cartesian/linear.html#linear-cartesian-axis
  /**
   * width of the visible axis
   * @default 30
   */
  axisWidth: number;
}
```

## Scaling

The Parallel Coordinates controller `pcp` uses a linear scale. There is also the `logarithmicPcp` that uses a logarithmic scale.
Using chart.js hybrid charts, one can specify the type per dataset. e.g.,

```js
const config = {
  type: 'pcp',
  data: {
    labels: ['1', '2', '3'],
    datasets: [
      {
        label: 'A',
        data: [1, 2, 3]
      },
      {
        type: 'logarithmicPcp',
        label: 'B',
        data: [1, 2, 10000]
      }
    })),
  },
  options: {},
};
```

### ESM and Tree Shaking

The ESM build of the library supports tree shaking thus having no side effects. As a consequence the chart.js library won't be automatically manipulated nor new controllers automatically registered. One has to manually import and register them.

Variant A:

```js
import Chart from 'chart.js';
import { ParallelCoordinatesController } from 'chartjs-chart-pcp';

// register controller in chart.js and ensure the defaults are set
ParallelCoordinatesController.register();
...

new Chart(ctx, {
  type: ParallelCoordinatesController.id,
  data: [...],
});
```

Variant B:

```js
import { ParallelCoordinatesChart } from 'chartjs-chart-pcp';

new ParallelCoordinatesChart(ctx, {
  data: [...],
});
```

## Development Environment

```sh
npm i -g yarn
yarn set version 2
cat .yarnrc_patch.yml >> .yarnrc.yml
yarn
yarn pnpify --sdk
```

### Common commands

```sh
yarn compile
yarn test
yarn lint
yarn fix
yarn build
yarn docs
yarn release
yarn release:pre
```

[npm-image]: https://badge.fury.io/js/chartjs-chart-venn.svg
[npm-url]: https://npmjs.org/package/chartjs-chart-venn
[github-actions-image]: https://github.com/sgratzl/chartjs-chart-venn/workflows/ci/badge.svg
[github-actions-url]: https://github.com/sgratzl/chartjs-chart-venn/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
