import 'jest';
import { Chart } from '../chart';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

function toBuffer(canvas: HTMLCanvasElement) {
  return new Promise((resolve) => {
    canvas.toBlob((b) => {
      const file = new FileReader();
      file.onload = () => resolve(Buffer.from(file.result));
      file.readAsArrayBuffer(b);
    });
  });
}

export async function expectMatchSnapshot(canvas: HTMLCanvasElement) {
  const image = await toBuffer(canvas);
  expect(image).toMatchImageSnapshot();
}

export default async function matchChart(config: any, width = 300, height = 300, matchOptions = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  config.options = Object.assign(
    {
      responsive: false,
      animation: false,
      fontFamily: "'Arial', sans-serif",
    },
    config.options || {}
  );
  const ctx = canvas.getContext('2d');

  // sync
  Chart.helpers.requestAnimFrame = (c: () => void) => c();

  const _ = new Chart(ctx, config);

  const image = await toBuffer(canvas);
  expect(image).toMatchImageSnapshot(matchOptions);
}
