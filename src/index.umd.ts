import { VennDiagramController, EulerDiagramController } from './controllers';
import { registry } from 'chart.js';
import { ArcSlice } from './elements';

export * from '.';

registry.addControllers(VennDiagramController, EulerDiagramController);
registry.addElements(ArcSlice);
