# Chart.js Venn Diagram Chart

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

Chart.js module for charting venn diagrams with oen, two, or three sets. Adding new chart type: `venn`.

**Works only with Chart.js >= 3.0.0**

![Sports Venn Diagram](https://user-images.githubusercontent.com/4129778/84571515-f32f9100-ad93-11ea-9354-039411eef43a.png)

## Install

```bash
npm install --save chart.js@next chartjs-chart-venn@next
```

## Usage

see [Samples](https://github.com/sgratzl/chartjs-chart-venn/tree/master/samples) on Github

or at this [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/ExPyZjG)

## Venn Diagram

### Data Structure

```ts
const config = {
  type: 'venn',
  data: ChartVenn.extractSets(
    [
      { label: 'Soccer', values: ['alex', 'casey', 'drew', 'hunter'] },
      { label: 'Tennis', values: ['casey', 'drew', 'jade'] },
      { label: 'Volleyball', values: ['drew', 'glen', 'jade'] },
    ],
    {
      label: 'Sports',
    }
  ),
  options: {},
};
```

### Styling of elements

`ArcSlice` elements have the basic `backgroundColor`, `borderColor`, and `borderWidth` properties similar to a regular Rectangle.

### ESM and Tree Shaking

The ESM build of the library supports tree shaking thus having no side effects. As a consequence the chart.js library won't be automatically manipulated nor new controllers automatically registered. One has to manually import and register them.

Variant A:

```js
import Chart from 'chart.js';
import { VennDiagramController } from 'chartjs-chart-venn';

// register controller in chart.js and ensure the defaults are set
VennDiagramController.register();
...

new Chart(ctx, {
  type: VennDiagramController.id,
  data: [...],
});
```

Variant B:

```js
import { VennDiagramChart } from 'chartjs-chart-venn';

new VennDiagramChart(ctx, {
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
