import Theme from 'vitepress/theme';
import { createTypedChart } from 'vue-chartjs';
import { Tooltip, LinearScale } from 'chart.js';
import { ArcSlice, EulerDiagramController, VennDiagramController } from '../../../src';

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component(
      'VennDiagramChart',
      createTypedChart('venn', [Tooltip, LinearScale, ArcSlice, EulerDiagramController, VennDiagramController])
    );
    app.component(
      'EulerDiagramChart',
      createTypedChart('euler', [Tooltip, LinearScale, ArcSlice, EulerDiagramController, VennDiagramController])
    );
  },
};
